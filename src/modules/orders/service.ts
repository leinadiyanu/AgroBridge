import { Role } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { OrderRepository } from "./repository.js";
import { ListingRepository } from "../listings/repository.js";
import type { CreateOrderInput, OrderFilterInput } from "./types.js";
import { AppError } from "../../shared/middleware/index.js";
import { NotificationService } from "../notifications/service.js";
import { PaymentService } from "../payments/service.js";
import { PaymentRepository } from "../payments/repository.js";
import { LogisticsService } from "../logistics/service.js";

const logisticsService = new LogisticsService();
const paymentService = new PaymentService(new PaymentRepository());
const notificationService = new NotificationService();

export class OrderService {
  constructor(
    private repo: OrderRepository,
    private listingRepo: ListingRepository,
  ) {}

  async placeOrder(buyerId: string, userRole: Role, data: CreateOrderInput) {
    if (userRole !== Role.BUYER) {
      throw new AppError("Only buyers can place orders", 403);
    }

    const listing = await this.listingRepo.findById(data.listingId);
    if (!listing) throw new AppError("Listing not found", 404);
    if (listing.status !== "ACTIVE") {
      throw new AppError("This listing is no longer available", 400);
    }
    if (listing.farmerId === buyerId) {
      throw new AppError("You cannot order your own listing", 400);
    }
    if (data.quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
    }
    if (data.quantity > listing.quantity) {
      throw new AppError(
        `Only ${listing.quantity} ${listing.unit} available`,
        400,
      );
    }

    const totalPrice = data.quantity * listing.price;

    // Calculate delivery fee only if not self pickup
    let deliveryDistance: number | undefined;
    let deliveryFee = 0;

    if (data.deliveryMethod !== "SELF_PICKUP") {
      if (!data.deliveryLocation) {
        throw new AppError(
          "Delivery location is required for this delivery method",
          400,
        );
      }

      const quote = await logisticsService.getDeliveryQuote(
        listing.location,
        data.deliveryLocation,
      );
      deliveryDistance = quote.distance;
      deliveryFee = quote.fee;
    }

    const order = await this.repo.create(
      buyerId,
      listing.farmerId,
      data,
      totalPrice,
      deliveryDistance,
      deliveryFee,
    );

    const orderCount = await prisma.order.count({
      where: { listingId: data.listingId },
    });
    if (orderCount === 1) {
      await notificationService.notify({
        type: "listing.first_order",
        orderId: order.id,
      });
    } else {
      await notificationService.notify({
        type: "order.placed",
        orderId: order.id,
      });
    }

    return order;
  }

  async getMyOrders(userId: string, userRole: Role, filters: OrderFilterInput) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    if (userRole === Role.BUYER) {
      return this.repo.findByBuyer(userId, page, limit);
    }

    if (userRole === Role.FARMER) {
      return this.repo.findByFarmer(userId, page, limit);
    }

    throw new AppError("Unauthorized", 403);
  }

  async getOrder(userId: string, userRole: Role, orderId: string) {
    const order = await this.repo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    // Only buyer or farmer involved can view
    const isInvolved = order.buyerId === userId || order.farmerId === userId;
    if (!isInvolved && userRole !== Role.ADMIN) {
      throw new AppError("You do not have access to this order", 403);
    }

    return order;
  }

  async confirmOrder(userId: string, userRole: Role, orderId: string) {
    if (userRole !== Role.FARMER) {
      throw new AppError("Only farmers can confirm orders", 403);
    }

    const order = await this.repo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.farmerId !== userId) {
      throw new AppError("You can only confirm your own orders", 403);
    }
    if (order.status !== "PENDING") {
      throw new AppError("Only pending orders can be confirmed", 400);
    }

    const updated = await this.repo.updateStatus(orderId, "CONFIRMED");

    // TODO: trigger payment flow here (payments module)

    // Notify buyer
    await notificationService.notify({
      type: "order.confirmed",
      orderId: orderId,
    });

    return updated;
  }

  async cancelOrder(userId: string, userRole: Role, orderId: string) {
    const order = await this.repo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const isInvolved = order.buyerId === userId || order.farmerId === userId;
    if (!isInvolved) {
      throw new AppError("You do not have access to this order", 403);
    }

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      throw new AppError("This order cannot be cancelled", 400);
    }

    // Only buyer can cancel PENDING, both can cancel CONFIRMED
    if (order.status === "PENDING" && order.farmerId === userId) {
      throw new AppError(
        "Farmers cannot cancel pending orders — wait for it to be confirmed first",
        400,
      );
    }
    await notificationService.notify({
      type: "order.cancelled",
      orderId: orderId,
      cancelledBy: userRole === Role.BUYER ? "buyer" : "farmer",
    });

    return this.repo.updateStatus(orderId, "CANCELLED");
  }

  async completeOrder(userId: string, userRole: Role, orderId: string) {
    if (userRole !== Role.BUYER) {
      throw new AppError("Only buyers can mark orders as completed", 403);
    }

    const order = await this.repo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.buyerId !== userId) {
      throw new AppError("You can only complete your own orders", 403);
    }
    if (order.status !== "CONFIRMED") {
      throw new AppError("Only confirmed orders can be completed", 400);
    }

    const updated = await this.repo.updateStatus(orderId, "COMPLETED");

    // Trigger escrow release here (payments module)

    // inside completeOrder, after updating status to COMPLETED
    await paymentService.releasePayment(orderId);

    // Update listing quantity or mark as SOLD
    await notificationService.notify({
      type: "order.completed",
      orderId: orderId,
    });

    return updated;
  }
}
