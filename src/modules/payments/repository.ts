import { prisma } from "../../config/db.js";

export class PaymentRepository {
  async createTransaction(data: {
    orderId: string;
    farmerId: string;
    buyerId: string;
    agentId?: string;
    amount: number;
    platformFee: number;
    farmerPayout: number;
    paystackRef: string;
  }) {
    return prisma.transaction.create({ data });
  }

  async findByPaystackRef(ref: string) {
    return prisma.transaction.findUnique({
      where: { paystackRef: ref },
      include: { order: true },
    });
  }

  async findByOrderId(orderId: string) {
    return prisma.transaction.findUnique({
      where: { orderId },
    });
  }

  async updateStatus(id: string, status: "PENDING" | "COMPLETED" | "FAILED") {
    return prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async updateEscrow(id: string, escrowRef: string, escrowStatus: string) {
    return prisma.transaction.update({
      where: { id },
      data: { escrowRef, escrowStatus },
    });
  }
}
