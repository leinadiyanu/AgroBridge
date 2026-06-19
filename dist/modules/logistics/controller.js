import { LogisticsService } from "./service.js";
export class LogisticsController {
    constructor(service) {
        this.service = service;
        this.getQuote = async (req, res, next) => {
            try {
                const { from, to } = req.query;
                const result = await this.service.getDeliveryQuote(from, to);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map