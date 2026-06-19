type NotificationEvent = {
    type: "order.placed";
    orderId: string;
} | {
    type: "order.confirmed";
    orderId: string;
} | {
    type: "order.cancelled";
    orderId: string;
    cancelledBy: string;
} | {
    type: "order.completed";
    orderId: string;
} | {
    type: "payment.received";
    orderId: string;
} | {
    type: "payment.initiated";
    orderId: string;
} | {
    type: "escrow.holding";
    orderId: string;
} | {
    type: "dispute.raised";
    orderId: string;
} | {
    type: "listing.sold";
    listingId: string;
} | {
    type: "listing.first_order";
    orderId: string;
} | {
    type: "welcome";
    userId: string;
} | {
    type: "web.activated";
    userId: string;
} | {
    type: "password.changed";
    userId: string;
} | {
    type: "farmer.assigned";
    farmerId: string;
    agentId: string;
} | {
    type: "transaction.facilitated";
    orderId: string;
} | {
    type: "price.alert";
    userId: string;
    farmer: {
        phoneNumber: string;
        email?: string | null;
    };
    crop: string;
    direction: string;
    advice: string;
} | {
    type: "listing.expiring";
    listingId: string;
    daysLeft: number;
};
export declare class NotificationService {
    notify(event: NotificationEvent): Promise<void>;
    private getOrder;
    private sendToUser;
    private onOrderPlaced;
    private onOrderConfirmed;
    private onOrderCancelled;
    private onOrderCompleted;
    private onPaymentReceived;
    private getUser;
    private getListing;
    private onPaymentInitiated;
    private onEscrowHolding;
    private onDisputeRaised;
    private onListingSold;
    private onListingFirstOrder;
    private onWelcome;
    private onWebActivated;
    private onPasswordChanged;
    private onFarmerAssigned;
    private onTransactionFacilitated;
    private onPriceAlert;
    private onListingExpiring;
}
export {};
//# sourceMappingURL=service.d.ts.map