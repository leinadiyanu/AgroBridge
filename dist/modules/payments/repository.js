import { prisma } from "../../config/db.js";
export class PaymentRepository {
    async createTransaction(data) {
        return prisma.transaction.create({ data });
    }
    async findByPaystackRef(ref) {
        return prisma.transaction.findUnique({
            where: { paystackRef: ref },
            include: { order: true },
        });
    }
    async findByOrderId(orderId) {
        return prisma.transaction.findUnique({
            where: { orderId },
        });
    }
    async updateStatus(id, status) {
        return prisma.transaction.update({
            where: { id },
            data: { status },
        });
    }
    async updateEscrow(id, escrowRef, escrowStatus) {
        return prisma.transaction.update({
            where: { id },
            data: { escrowRef, escrowStatus },
        });
    }
}
//# sourceMappingURL=repository.js.map