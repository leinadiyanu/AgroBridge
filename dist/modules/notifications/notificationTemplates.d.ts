export declare const templates: {
    orderPlaced: (crop: string, quantity: number, buyerName: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    orderConfirmed: (crop: string, quantity: number, farmerName: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    orderCancelled: (crop: string, cancelledBy: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    orderCompleted: (crop: string, amount: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    paymentReceived: (crop: string, amount: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    priceAlert: (crop: string, direction: string, advice: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    welcomeMessage: (name: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    listingExpiringSoon: (crop: string, daysLeft: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    listingSold: (crop: string, quantity: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    listingFirstOrder: (crop: string, buyerName: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    webActivated: (name: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    passwordChanged: (name: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    paymentInitiated: (crop: string, amount: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    escrowHolding: (crop: string, amount: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    disputeRaised: (crop: string, orderId: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    farmerAssigned: (farmerName: string, agentName: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    agentFarmerAdded: (farmerName: string) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
    transactionFacilitated: (crop: string, amount: number) => {
        sms: string;
        email: {
            subject: string;
            html: string;
        };
    };
};
//# sourceMappingURL=notificationTemplates.d.ts.map