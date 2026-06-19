import { sendSMS } from "../../modules/services/smsService.js";
import { sendEmail } from "../../modules/services/emailService.js";
import { templates } from "../notifications/notificationTemplates.js";
import { prisma } from "../../config/db.js";

type NotificationEvent =
  | { type: "order.placed"; orderId: string }
  | { type: "order.confirmed"; orderId: string }
  | { type: "order.cancelled"; orderId: string; cancelledBy: string }
  | { type: "order.completed"; orderId: string }
  | { type: "payment.received"; orderId: string }
  | { type: "payment.initiated"; orderId: string }
  | { type: "escrow.holding"; orderId: string }
  | { type: "dispute.raised"; orderId: string }
  | { type: "listing.sold"; listingId: string }
  | { type: "listing.first_order"; orderId: string }
  | { type: "welcome"; userId: string }
  | { type: "web.activated"; userId: string }
  | { type: "password.changed"; userId: string }
  | { type: "farmer.assigned"; farmerId: string; agentId: string }
  | { type: "transaction.facilitated"; orderId: string }
  | {
      type: "price.alert";
      userId: string;
      farmer: { phoneNumber: string; email?: string | null };
      crop: string;
      direction: string;
      advice: string;
    }
  | { type: "listing.expiring"; listingId: string; daysLeft: number };

export class NotificationService {
  async notify(event: NotificationEvent) {
    switch (event.type) {
      case "order.placed":
        return this.onOrderPlaced(event.orderId);
      case "order.confirmed":
        return this.onOrderConfirmed(event.orderId);
      case "order.cancelled":
        return this.onOrderCancelled(event.orderId, event.cancelledBy);
      case "order.completed":
        return this.onOrderCompleted(event.orderId);
      case "payment.received":
        return this.onPaymentReceived(event.orderId);
      case "payment.initiated":
        return this.onPaymentInitiated(event.orderId);
      case "escrow.holding":
        return this.onEscrowHolding(event.orderId);
      case "dispute.raised":
        return this.onDisputeRaised(event.orderId);
      case "listing.sold":
        return this.onListingSold(event.listingId);
      case "listing.first_order":
        return this.onListingFirstOrder(event.orderId);
      case "welcome":
        return this.onWelcome(event.userId);
      case "web.activated":
        return this.onWebActivated(event.userId);
      case "password.changed":
        return this.onPasswordChanged(event.userId);
      case "farmer.assigned":
        return this.onFarmerAssigned(event.farmerId, event.agentId);
      case "transaction.facilitated":
        return this.onTransactionFacilitated(event.orderId);
      case "price.alert":
        return this.onPriceAlert(
          event.userId,
          event.farmer,
          event.crop,
          event.direction,
          event.advice,
        );
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async getOrder(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: { select: { crop: true, quantity: true, price: true } },
        buyer: { select: { name: true, phoneNumber: true, email: true } },
        farmer: { select: { name: true, phoneNumber: true, email: true } },
      },
    });
  }

  private async sendToUser(
    user: { phoneNumber: string; email?: string | null },
    smsMessage: string,
    emailContent: { subject: string; html: string },
  ) {
    const tasks: Promise<any>[] = [sendSMS(user.phoneNumber, smsMessage)];

    if (user.email) {
      tasks.push(
        sendEmail({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      );
    }

    // Don't let notification failure crash the main flow
    await Promise.allSettled(tasks);
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

  private async onOrderPlaced(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;

    const { sms, email } = templates.orderPlaced(
      order.listing.crop,
      order.quantity,
      order.buyer.name,
    );

    await this.sendToUser(order.farmer, sms, email);
  }

  private async onOrderConfirmed(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;

    const { sms, email } = templates.orderConfirmed(
      order.listing.crop,
      order.quantity,
      order.farmer.name,
    );

    await this.sendToUser(order.buyer, sms, email);
  }

  private async onOrderCancelled(orderId: string, cancelledBy: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;

    const { sms, email } = templates.orderCancelled(
      order.listing.crop,
      cancelledBy,
    );

    // Notify both parties
    await Promise.allSettled([
      this.sendToUser(order.buyer, sms, email),
      this.sendToUser(order.farmer, sms, email),
    ]);
  }

  private async onOrderCompleted(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;

    const { sms, email } = templates.orderCompleted(
      order.listing.crop,
      order.totalPrice,
    );

    await this.sendToUser(order.farmer, sms, email);
  }

  private async onPaymentReceived(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;

    const { sms, email } = templates.paymentReceived(
      order.listing.crop,
      order.totalPrice,
    );

    await this.sendToUser(order.farmer, sms, email);
  }

  // ── User helpers ───────────────────────────────────────────────────────────

  private async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, phoneNumber: true, email: true },
    });
  }

  private async getListing(listingId: string) {
    return prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        farmer: { select: { name: true, phoneNumber: true, email: true } },
      },
    });
  }

  // ── New handlers ───────────────────────────────────────────────────────────

  private async onPaymentInitiated(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;
    const { sms, email } = templates.paymentInitiated(
      order.listing.crop,
      order.totalPrice,
    );
    await this.sendToUser(order.buyer, sms, email);
  }

  private async onEscrowHolding(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;
    const { sms, email } = templates.escrowHolding(
      order.listing.crop,
      order.totalPrice,
    );
    // notify both
    await Promise.allSettled([
      this.sendToUser(order.buyer, sms, email),
      this.sendToUser(order.farmer, sms, email),
    ]);
  }

  private async onDisputeRaised(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;
    const { sms, email } = templates.disputeRaised(order.listing.crop, orderId);
    await Promise.allSettled([
      this.sendToUser(order.buyer, sms, email),
      this.sendToUser(order.farmer, sms, email),
    ]);
  }

  private async onListingSold(listingId: string) {
    const listing = await this.getListing(listingId);
    if (!listing) return;
    const { sms, email } = templates.listingSold(
      listing.crop,
      listing.quantity,
    );
    await this.sendToUser(listing.farmer, sms, email);
  }

  private async onListingFirstOrder(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;
    const { sms, email } = templates.listingFirstOrder(
      order.listing.crop,
      order.buyer.name,
    );
    await this.sendToUser(order.farmer, sms, email);
  }

  private async onWelcome(userId: string) {
    const user = await this.getUser(userId);
    if (!user) return;
    const { sms, email } = templates.welcomeMessage(user.name);
    await this.sendToUser(user, sms, email);
  }

  private async onWebActivated(userId: string) {
    const user = await this.getUser(userId);
    if (!user) return;
    const { sms, email } = templates.webActivated(user.name);
    await this.sendToUser(user, sms, email);
  }

  private async onPasswordChanged(userId: string) {
    const user = await this.getUser(userId);
    if (!user) return;
    const { sms, email } = templates.passwordChanged(user.name);
    await this.sendToUser(user, sms, email);
  }

  private async onFarmerAssigned(farmerId: string, agentId: string) {
    const [farmer, agent] = await Promise.all([
      this.getUser(farmerId),
      this.getUser(agentId),
    ]);
    if (!farmer || !agent) return;

    const farmerMsg = templates.farmerAssigned(farmer.name, agent.name);
    const agentMsg = templates.agentFarmerAdded(farmer.name);

    await Promise.allSettled([
      this.sendToUser(farmer, farmerMsg.sms, farmerMsg.email),
      this.sendToUser(agent, agentMsg.sms, agentMsg.email),
    ]);
  }

  private async onTransactionFacilitated(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) return;
    const { sms, email } = templates.transactionFacilitated(
      order.listing.crop,
      order.totalPrice,
    );
    await Promise.allSettled([
      this.sendToUser(order.buyer, sms, email),
      this.sendToUser(order.farmer, sms, email),
    ]);
  }

  private async onPriceAlert(
    userId: String,
    farmer: { phoneNumber: string; email?: string | null },
    crop: string,
    direction: string,
    advice: string,
  ) {
    const { sms, email } = templates.priceAlert(crop, direction, advice);
    await this.sendToUser(farmer, sms, email);
  }

  private async onListingExpiring(listingId: string) {
    const listing = await this.getListing(listingId);
    if (!listing) return;

    const { sms, email } = templates.listingExpiringSoon(listing.crop, 0);
    await this.sendToUser(listing.farmer, sms, email);
  }
}
