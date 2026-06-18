export declare const registerFlow: {
    start: string;
    steps: {
        name: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        location: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        role: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
            transform: (input: string) => any;
        };
        pin: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        confirmPin: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
    };
};
//# sourceMappingURL=registerFlow.d.ts.map