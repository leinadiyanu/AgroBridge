export declare const predictionFlow: {
    start: string;
    steps: {
        choosePrediction: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: (input: string) => "back" | "enterCropForPredict" | "enterCropForBestTime";
        };
        enterCropForPredict: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            next: string;
        };
        enterStateForPredict: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            transform: (input: string, data: any) => string;
            action: string;
        };
        enterCropForBestTime: {
            prompt: string;
            validate: (input: string) => boolean;
            error: string;
            action: string;
        };
        back: {
            prompt: (role: string, name: string) => string;
            isTerminal: boolean;
            validate: () => boolean;
            error: string;
            next: string;
        };
    };
};
//# sourceMappingURL=predictionFlow.d.ts.map