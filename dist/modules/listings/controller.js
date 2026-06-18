import { ListingService } from "./service.js";
import { ListingCategory } from "@prisma/client";
export class ListingController {
    constructor(service) {
        this.service = service;
        this.create = async (req, res, next) => {
            try {
                const listing = await this.service.createListing(req.user.id, req.user.role, req.body);
                res.status(201).json({ success: true, message: "Listing created", data: listing });
            }
            catch (err) {
                next(err);
            }
        };
        this.getOne = async (req, res, next) => {
            try {
                const listing = await this.service.getListing(req.params.id);
                res.status(200).json({ success: true, data: listing });
            }
            catch (err) {
                next(err);
            }
        };
        this.getAll = async (req, res, next) => {
            try {
                const filters = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 20,
                    ...(req.query.category && { category: req.query.category }),
                    ...(req.query.location && { location: req.query.location }),
                    ...(req.query.crop && { crop: req.query.crop }),
                    ...(req.query.minPrice && { minPrice: Number(req.query.minPrice) }),
                    ...(req.query.maxPrice && { maxPrice: Number(req.query.maxPrice) }),
                };
                const result = await this.service.getListings(filters);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.getMine = async (req, res, next) => {
            try {
                const listings = await this.service.getMyListings(req.user.id, req.user.role);
                res.status(200).json({ success: true, data: listings });
            }
            catch (err) {
                next(err);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const listing = await this.service.updateListing(req.user.id, req.user.role, req.params.id, req.body);
                res.status(200).json({ success: true, message: "Listing updated", data: listing });
            }
            catch (err) {
                next(err);
            }
        };
        this.remove = async (req, res, next) => {
            try {
                await this.service.deleteListing(req.user.id, req.user.role, req.params.id);
                res.status(200).json({ success: true, message: "Listing removed" });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map