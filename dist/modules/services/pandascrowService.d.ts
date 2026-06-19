interface CreateEscrowInput {
    amount: number;
    buyerEmail: string;
    sellerEmail: string;
    description: string;
    reference: string;
}
interface EscrowResponse {
    status: boolean;
    data: {
        escrow_id: string;
        status: string;
    };
}
export declare const createEscrow: (input: CreateEscrowInput) => Promise<EscrowResponse>;
export declare const releaseEscrow: (escrowId: string) => Promise<EscrowResponse>;
export declare const disputeEscrow: (escrowId: string, reason: string) => Promise<EscrowResponse>;
export {};
//# sourceMappingURL=pandascrowService.d.ts.map