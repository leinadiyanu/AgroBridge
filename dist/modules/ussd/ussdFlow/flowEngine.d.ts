import { UssdRepository } from "../repository.js";
export declare class FlowEngine {
    private repo;
    constructor(repo: UssdRepository);
    run(flow: any, steps: string[], phoneNumber: string): Promise<string>;
}
//# sourceMappingURL=flowEngine.d.ts.map