import type { Request, Response, NextFunction } from "express";
import { ListingService } from "./service.js";
import { ListingCategory } from "@prisma/client";
import type { ListingFilterInput } from "./types.js";

interface IdParam {
  id: string;
}

export class ListingController {
  constructor(private service: ListingService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listing = await this.service.createListing(
        req.user!.id,
        req.user!.role,
        req.body,
      );
      res.status(201).json({ success: true, message: "Listing created", data: listing });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request<IdParam>, res: Response, next: NextFunction) => {
    try {
      const listing = await this.service.getListing(req.params.id);
      res.status(200).json({ success: true, data: listing });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: ListingFilterInput = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      ...(req.query.category && { category: req.query.category as ListingCategory }),
      ...(req.query.location && { location: req.query.location as string }),
      ...(req.query.crop && { crop: req.query.crop as string }),
      ...(req.query.minPrice && { minPrice: Number(req.query.minPrice) }),
      ...(req.query.maxPrice && { maxPrice: Number(req.query.maxPrice) }),
    };

    const result = await this.service.getListings(filters);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

  getMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listings = await this.service.getMyListings(req.user!.id, req.user!.role);
      res.status(200).json({ success: true, data: listings });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request<IdParam>, res: Response, next: NextFunction) => {
    try {
      const listing = await this.service.updateListing(
        req.user!.id,
        req.user!.role,
        req.params.id,
        req.body,
      );
      res.status(200).json({ success: true, message: "Listing updated", data: listing });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request<IdParam>, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteListing(req.user!.id, req.user!.role, req.params.id);
      res.status(200).json({ success: true, message: "Listing removed" });
    } catch (err) {
      next(err);
    }
  };
}