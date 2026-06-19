import { PredictionService } from "./service.js";
export class PredictionController {
    constructor(service) {
        this.service = service;
        this.predict = async (req, res, next) => {
            try {
                const result = await this.service.predict(req.body);
                res.status(200).json({
                    success: true,
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.bestTime = async (req, res, next) => {
            try {
                const result = await this.service.bestTime(req.params.commodity);
                res.status(200).json({
                    success: true,
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.health = async (req, res, next) => {
            try {
                const healthy = await this.service.isHealthy();
                res.status(200).json({
                    success: true,
                    data: { status: healthy ? "ok" : "unavailable" },
                });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map