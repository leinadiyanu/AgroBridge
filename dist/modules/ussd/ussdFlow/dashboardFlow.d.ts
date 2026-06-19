import { Role } from "@prisma/client";
export declare const farmerFlow: {
    start: string;
    steps: {
        menu: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => string | undefined;
        };
        postCrop: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        postQuantity: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        postPrice: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        postLocation: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        postDate: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        pricePredictCrop: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        myListings: {
            prompt: string;
            isTerminal: boolean;
        };
        incomingOrders: {
            prompt: string;
            isTerminal: boolean;
        };
        earnings: {
            prompt: string;
            isTerminal: boolean;
        };
    };
};
export declare const buyerFlow: {
    start: string;
    steps: {
        menu: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => string | undefined;
        };
        browseProduce: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        pricePredictCrop: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        myOrders: {
            prompt: string;
            isTerminal: boolean;
        };
    };
};
export declare const agentFlow: {
    start: string;
    steps: {
        menu: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => string | undefined;
        };
        myFarmers: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "viewFarmers" | "addFarmerPhone";
        };
        addFarmerPhone: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        facilitatePhone: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        facilitateBuyerPhone: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        facilitateAmount: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        facilitatePin: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        pricePredictCrop: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        viewFarmers: {
            prompt: string;
            isTerminal: boolean;
        };
        reports: {
            prompt: string;
            isTerminal: boolean;
        };
    };
};
export declare const dashboardFlowFor: (role: Role) => any;
//# sourceMappingURL=dashboardFlow.d.ts.map