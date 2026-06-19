export declare const myListingsFlow: {
    start: string;
    steps: {
        showListings: {
            prompt: string;
            validate: () => boolean;
            error: string;
            action: string;
        };
        listingAction: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "confirmSold" | "confirmCancel";
        };
        confirmSold: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "doMarkSold";
        };
        doMarkSold: {
            prompt: string;
            validate: () => boolean;
            error: string;
            action: string;
        };
        confirmCancel: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "doCancelListing";
        };
        doCancelListing: {
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
//# sourceMappingURL=myListingFlow.d.ts.map