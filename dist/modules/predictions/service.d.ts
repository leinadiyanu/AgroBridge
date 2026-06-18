import type { PredictOutput, BestTimeOutput, PredictRequestInput } from "./types.js";
export declare class PredictionService {
    private buildInput;
    predict(input: PredictRequestInput): Promise<PredictOutput>;
    bestTime(commodity: string): Promise<BestTimeOutput>;
    isHealthy(): Promise<boolean>;
}
//# sourceMappingURL=service.d.ts.map