import { OrderService } from "./service.js";
export class OrderController {
    constructor(service) {
        this.service = service;
        this.place = async (req, res, next) => {
            try {
                const order = await this.service.placeOrder(req.user.id, req.user.role, req.body);
                res.status(201).json({ success: true, message: "Order placed", data: order });
            }
            catch (err) {
                next(err);
            }
        };
        this.getMyOrders = async (req, res, next) => {
            try {
                const filters = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 20,
                };
                const result = await this.service.getMyOrders(req.user.id, req.user.role, filters);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.getOne = async (req, res, next) => {
            try {
                const order = await this.service.getOrder(req.user.id, req.user.role, req.params.id);
                res.status(200).json({ success: true, data: order });
            }
            catch (err) {
                next(err);
            }
        };
        this.confirm = async (req, res, next) => {
            try {
                const order = await this.service.confirmOrder(req.user.id, req.user.role, req.params.id);
                res.status(200).json({ success: true, message: "Order confirmed", data: order });
            }
            catch (err) {
                next(err);
            }
        };
        this.cancel = async (req, res, next) => {
            try {
                const order = await this.service.cancelOrder(req.user.id, req.user.role, req.params.id);
                res.status(200).json({ success: true, message: "Order cancelled", data: order });
            }
            catch (err) {
                next(err);
            }
        };
        this.complete = async (req, res, next) => {
            try {
                const order = await this.service.completeOrder(req.user.id, req.user.role, req.params.id);
                res.status(200).json({ success: true, message: "Order completed", data: order });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map