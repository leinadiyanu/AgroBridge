// import { PrismaClient, Role } from "@prisma/client";
// import redisClient from "../../config/redis.js";
// import { hashPassword } from "../../shared/utils/hashPassword.js";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// // Shape of a USSD session stored in Redis
// export interface UssdSession {
//   step: string; // which step the user is currently on
//   data: Record<string, string>; // collected inputs so far e.g. { name: "John", location: "Lagos" }
// }

// export class UssdRepository {
//   // ─── Redis session methods ───────────────────────────────────────

//   async getSession(phoneNumber: string): Promise<UssdSession | null> {
//     const raw = await redisClient.get(`ussd:session:${phoneNumber}`);
//     return raw ? JSON.parse(raw) : null;
//   }

//   async saveSession(phoneNumber: string, session: UssdSession): Promise<void> {
//     await redisClient.set(
//       `ussd:session:${phoneNumber}`,
//       JSON.stringify(session),
//       { EX: 60 * 5 }, // expire after 5 minutes of inactivity
//     );
//   }

//   async deleteSession(phoneNumber: string): Promise<void> {
//     await redisClient.del(`ussd:session:${phoneNumber}`);
//   }

//   // ─── Prisma methods ──────────────────────────────────

//   // ---User----
//   async findUserByPhone(phoneNumber: string) {
//     return prisma.user.findFirst({ where: { phoneNumber } });
//   }

//   async createUser(data: {
//     phoneNumber: string;
//     name: string;
//     location: string;
//     role: Role;
//     pin: string;
//   }) {
//     const hashedPin = await hashPassword(data.pin);
//     return prisma.user.create({ data: { ...data, pin: hashedPin } });
//   }

//   async verifyPin(phoneNumber: string, pin: string): Promise<boolean> {
//     const user = await this.findUserByPhone(phoneNumber);
//     if (!user || !user.pin) return false;
//     return bcrypt.compare(pin, user.pin);
//   }

//   async linkFarmerToAgent(data: { agentPhone: string; farmerPhone: string }) {
//     const [agent, farmer] = await Promise.all([
//       prisma.user.findUnique({ where: { phoneNumber: data.agentPhone } }),
//       prisma.user.findUnique({ where: { phoneNumber: data.farmerPhone } }),
//     ]);
//     if (!agent || !farmer) throw new Error("Agent or farmer not found");
//     return prisma.agentFarmer.create({
//       data: { agentId: agent.id, farmerId: farmer.id },
//     });
//   }

//   async getFarmersByAgentPhone(phoneNumber: string) {
//     const agent = await prisma.user.findUnique({
//       where: { phoneNumber },
//       include: { managedFarmers: { include: { farmer: true } } },
//     });
//     if (!agent) return [];
//     return agent.managedFarmers.map((af) => af.farmer);
//   }

//   async getAgentReportSummary(phoneNumber: string) {
//     const agent = await prisma.user.findUnique({ where: { phoneNumber } });
//     if (!agent) throw new Error("Agent not found");

//     const [transactions, farmerCount] = await Promise.all([
//       prisma.transaction.findMany({ where: { agentId: agent.id } }),
//       prisma.agentFarmer.count({ where: { agentId: agent.id } }),
//     ]);

//     const completed = transactions.filter((t) => t.status === "COMPLETED");
//     const totalFacilitated = completed.reduce((sum, t) => sum + t.amount, 0);

//     return {
//       farmerCount,
//       transactionCount: completed.length,
//       totalFacilitated,
//     };
//   }

//   // ---Listing----
//   async createListing(data: {
//     phoneNumber: string;
//     crop: string;
//     quantity: number;
//     price: number;
//     location: string;
//     availableFrom: string;
//   }) {
//     const farmer = await prisma.user.findUnique({
//       where: { phoneNumber: data.phoneNumber },
//     });
//     if (!farmer) throw new Error("Farmer not found");

//     const [day, month, year] = data.availableFrom.split("/");
//     return prisma.listing.create({
//       data: {
//         farmerId: farmer.id,
//         crop: data.crop,
//         quantity: data.quantity,
//         price: data.price,
//         location: data.location,
//         availableFrom: new Date(`${year}-${month}-${day}`),
//         status: "ACTIVE",
//       },
//     });
//   }

//   async getListingsByCrop(crop: string): Promise<any[]> {
//     return prisma.listing.findMany({
//       where: {
//         crop: { contains: crop, mode: "insensitive" },
//         status: "ACTIVE",
//       },
//       take: 3,
//       orderBy: { createdAt: "desc" },
//     });
//   }

//   async getListingsByPhone(phoneNumber: string) {
//     const user = await prisma.user.findUnique({ where: { phoneNumber } });
//     if (!user) return [];
//     return prisma.listing.findMany({
//       where: { farmerId: user.id, status: "ACTIVE" },
//       orderBy: { createdAt: "desc" },
//       take: 3,
//     });
//   }

//   async updateListingStatus(id: string, status: "SOLD" | "CANCELLED") {
//     return prisma.listing.update({ where: { id }, data: { status } });
//   }

//   // ---Order----

//   async createOrder(data: {
//     buyerPhone: string;
//     listingId: string;
//     quantity: number;
//   }) {
//     const buyer = await prisma.user.findUnique({
//       where: { phoneNumber: data.buyerPhone },
//     });
//     if (!buyer) return { ok: false, message: "Buyer not found." };

//     const listing = await prisma.listing.findUnique({
//       where: { id: data.listingId },
//     });
//     if (!listing || listing.status !== "ACTIVE") {
//       return { ok: false, message: "Listing no longer available." };
//     }
//     if (data.quantity > listing.quantity) {
//       return { ok: false, message: `Only ${listing.quantity}kg available.` };
//     }

//     const totalPrice = data.quantity * listing.price;

//     const order = await prisma.order.create({
//       data: {
//         listingId: listing.id,
//         buyerId: buyer.id,
//         farmerId: listing.farmerId,
//         quantity: data.quantity,
//         totalPrice,
//         status: "PENDING",
//       },
//     });

//     return { ok: true, crop: listing.crop, totalPrice, orderId: order.id };
//   }

//   async getOrdersByBuyerPhone(phoneNumber: string) {
//     const buyer = await prisma.user.findUnique({ where: { phoneNumber } });
//     if (!buyer) return [];
//     return prisma.order.findMany({
//       where: { buyerId: buyer.id },
//       include: { listing: { select: { crop: true } } },
//       orderBy: { createdAt: "desc" },
//       take: 3,
//     });
//   }

//   async getOrderById(id: string) {
//     return prisma.order.findUnique({
//       where: { id },
//       include: { listing: { select: { crop: true } } },
//     });
//   }

//   async getIncomingOrders(phoneNumber: string) {
//     const user = await prisma.user.findUnique({ where: { phoneNumber } });
//     if (!user) return [];
//     return prisma.order.findMany({
//       where: { farmerId: user.id, status: "PENDING" },
//       include: {
//         listing: { select: { crop: true } },
//         buyer: { select: { name: true } },
//       },
//       orderBy: { totalPrice: "desc" }, // best offer shows up first
//       take: 3,
//     });
//   }

//   async updateOrderStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
//     return prisma.order.update({ where: { id }, data: { status } });
//   }

//   async confirmOrder(orderId: string) {
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: { listing: true, buyer: true },
//     });
//     if (!order || order.status !== "PENDING") {
//       return { ok: false, message: "Order no longer available." };
//     }
//     if (order.quantity > order.listing.quantity) {
//       return {
//         ok: false,
//         message: "Not enough stock left to fulfil this order.",
//       };
//     }

//     // No stock touched here — this just marks who the farmer picked.
//     // Other bidders stay PENDING, untouched, as a fallback.
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: "CONFIRMED" },
//     });

//     return {
//       ok: true,
//       crop: order.listing.crop,
//       quantity: order.quantity,
//       buyerName: order.buyer.name,
//     };
//   }

//   async completeOrderPayment(orderId: string) {
//     return prisma.$transaction(async (tx) => {
//       const order = await tx.order.findUnique({
//         where: { id: orderId },
//         include: { listing: true },
//       });
//       if (!order || order.status !== "CONFIRMED") {
//         throw new Error("Order not in a payable state");
//       }
//       if (order.quantity > order.listing.quantity) {
//         await tx.order.update({
//           where: { id: orderId },
//           data: { status: "CANCELLED" },
//         });
//         throw new Error("STOCK_UNAVAILABLE"); // see Gap 2 below
//       }

//       const remaining = order.listing.quantity - order.quantity;

//       await tx.listing.update({
//         where: { id: order.listingId },
//         data: {
//           quantity: remaining,
//           status: remaining === 0 ? "SOLD" : order.listing.status,
//         },
//       });
//       await tx.order.update({
//         where: { id: orderId },
//         data: { status: "COMPLETED" },
//       });

//       if (remaining === 0) {
//         await tx.order.updateMany({
//           where: {
//             listingId: order.listingId,
//             status: { in: ["PENDING", "CONFIRMED"] },
//             NOT: { id: orderId },
//           },
//           data: { status: "CANCELLED" },
//         });
//       }

//       const PLATFORM_FEE_RATE = 0.05; // swap for your real fee
//       const platformFee = order.totalPrice * PLATFORM_FEE_RATE;
//       const farmerPayout = order.totalPrice - platformFee;

//       await tx.transaction.create({
//         data: {
//           farmerId: order.farmerId,
//           buyerId: order.buyerId,
//           orderId: order.id,
//           amount: order.totalPrice,
//           platformFee,
//           farmerPayout,
//           status: "COMPLETED",
//         },
//       });
//     });
//   }

//   // ---Transaction----

//   async createTransaction(data: {
//     agentPhone?: string;
//     farmerPhone: string;
//     buyerPhone: string;
//     amount: number;
//     orderId?: string;
//   }) {
//     const [farmer, buyer, agent] = await Promise.all([
//       prisma.user.findUnique({ where: { phoneNumber: data.farmerPhone } }),
//       prisma.user.findUnique({ where: { phoneNumber: data.buyerPhone } }),
//       data.agentPhone
//         ? prisma.user.findUnique({ where: { phoneNumber: data.agentPhone } })
//         : Promise.resolve(null),
//     ]);

//     if (!farmer || !buyer) throw new Error("Farmer or buyer not found");
//     if (data.agentPhone && !agent) throw new Error("Agent not found");

//     return prisma.transaction.create({
//       data: {
//         farmerId: farmer.id,
//         buyerId: buyer.id,
//         agentId: agent?.id ?? null,
//         amount: data.amount,
//         orderId: data.orderId ?? null,
//       },
//     });
//   }

//   async getEarnings(phoneNumber: string) {
//     const farmer = await prisma.user.findUnique({ where: { phoneNumber } });
//     if (!farmer) throw new Error("Farmer not found");

//     const transactions = await prisma.transaction.findMany({
//       where: { farmerId: farmer.id },
//     });

//     const paidOut = transactions
//       .filter((t) => t.status === "COMPLETED")
//       .reduce((sum, t) => sum + t.farmerPayout, 0);

//     const pending = transactions
//       .filter((t) => t.status === "PENDING")
//       .reduce((sum, t) => sum + t.farmerPayout, 0);

//     return { total: paidOut + pending, pending, paidOut };
//   }

//   async expireStalePendingPayments() {
//     const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // tune the window to taste
//     return prisma.order.updateMany({
//       where: { status: "CONFIRMED", updatedAt: { lt: cutoff } },
//       data: { status: "CANCELLED" },
//     });
//   }
// }
