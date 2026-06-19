export declare const incomingOrdersFlow: {
    start: string;
    steps: {
        showOrders: {
            prompt: string;
            validate: () => boolean;
            error: string;
            action: string;
        };
        orderAction: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "confirmOrder" | "cancelOrder";
        };
        confirmOrder: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "doConfirmOrder";
        };
        doConfirmOrder: {
            prompt: string;
            validate: () => boolean;
            error: string;
            action: string;
        };
        cancelOrder: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "doCancelOrder";
        };
        doCancelOrder: {
            prompt: string;
            validate: () => boolean;
            error: string;
            action: string;
        };
        back: {
            prompt: string;
            validate: () => boolean;
            error: string;
            isTerminal: boolean;
            next: string;
        };
    };
};
//# sourceMappingURL=incomingOrderFlow.d.ts.map