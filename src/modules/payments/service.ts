import crypto from "crypto";
import { prisma } from "../../config/db.js";
import { PaymentRepository } from "./repository.js";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
} from "../services/paystackService.js";
import { createEscrow, releaseEscrow } from "../services/pandascrowService.js";
import { NotificationService } from "../notifications/service.js";
import { AppError } from "../../shared/middleware/index.js";

const PLATFORM_FEE_PERCENT = 0.05; // 5%
const notificationService = new NotificationService();

export class PaymentService {
  constructor(private repo: PaymentRepository) {}

  // ── Initiate payment — buyer pays for a confirmed order ───────────────────

  async initiatePayment(buyerId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: { select: { id: true, email: true, phoneNumber: true } },
        farmer: { select: { id: true, email: true, phoneNumber: true } },
        listing: { select: { crop: true } },
      },
    });

    if (!order) throw new AppError("Order not found", 404);
    if (order.buyerId !== buyerId) {
      throw new AppError("You can only pay for your own orders", 403);
    }
    if (order.status !== "CONFIRMED") {
      throw new AppError("Order must be confirmed before payment", 400);
    }

    const existing = await this.repo.findByOrderId(orderId);
    if (existing) {
      throw new AppError("Payment already initiated for this order", 409);
    }

    if (!order.buyer.email) {
      throw new AppError(
        "Email is required to process payment. Please add an email to your profile.",
        400,
      );
    }

    const reference = `agb_${crypto.randomBytes(8).toString("hex")}`;
    const grandTotal = order.totalPrice + (order.deliveryFee ?? 0);
    const platformFee = grandTotal * PLATFORM_FEE_PERCENT;
    const farmerPayout = grandTotal - platformFee;

    const paystackInit = await initializePaystackPayment(
      order.buyer.email,
      grandTotal,
      reference,
    );

    await this.repo.createTransaction({
      orderId,
      farmerId: order.farmerId,
      buyerId: order.buyerId,
      amount: grandTotal,
      platformFee,
      farmerPayout,
      paystackRef: reference,
    });

    await notificationService.notify({ type: "payment.initiated", orderId });

    return {
      authorizationUrl: paystackInit.data.authorization_url,
      reference,
    };
  }

  // ── Verify payment — called after Paystack redirect OR webhook ────────────

  async verifyPayment(reference: string) {
    const transaction = await this.repo.findByPaystackRef(reference);
    if (!transaction) throw new AppError("Transaction not found", 404);

    if (transaction.status === "COMPLETED") {
      return { message: "Payment already verified", transaction };
    }

    const verification = await verifyPaystackPayment(reference);

    if (verification.data.status !== "success") {
      await this.repo.updateStatus(transaction.id, "FAILED");
      throw new AppError("Payment was not successful", 400);
    }

    // Create escrow hold with Pandascrow
    const order = await prisma.order.findUnique({
      where: { id: transaction.orderId! },
      include: {
        buyer: { select: { email: true } },
        farmer: { select: { email: true } },
        listing: { select: { crop: true } },
      },
    });

    if (!order) throw new AppError("Associated order not found", 404);

    try {
      const escrow = await createEscrow({
        amount: transaction.amount,
        buyerEmail: order.buyer.email ?? "",
        sellerEmail: order.farmer.email ?? "",
        description: `AgroBridge order — ${order.listing.crop}`,
        reference,
      });

      await this.repo.updateEscrow(
        transaction.id,
        escrow.data.escrow_id,
        "held",
      );
    } catch {
      // Payment succeeded but escrow creation failed — flag for manual review
      await this.repo.updateEscrow(transaction.id, "", "escrow_failed");
    }

    await this.repo.updateStatus(transaction.id, "COMPLETED");

    await notificationService.notify({
      type: "escrow.holding",
      orderId: transaction.orderId!,
    });

    return { message: "Payment verified, funds held in escrow", transaction };
  }

  // ── Release payment — called when buyer confirms delivery ─────────────────

  async releasePayment(orderId: string) {
    const transaction = await this.repo.findByOrderId(orderId);
    if (!transaction)
      throw new AppError("No transaction found for this order", 404);

    if (transaction.escrowStatus !== "held") {
      throw new AppError("Funds are not currently held in escrow", 400);
    }

    if (!transaction.escrowRef) {
      throw new AppError("No escrow reference found. Contact support.", 500);
    }

    await releaseEscrow(transaction.escrowRef);
    await this.repo.updateEscrow(
      transaction.id,
      transaction.escrowRef,
      "released",
    );

    await notificationService.notify({ type: "payment.received", orderId });

    return { message: "Funds released to farmer successfully" };
  }
}
