import { OrderStatus } from "@prisma/client";
import { DeliveryMethod } from "@prisma/client";

export interface CreateOrderInput {
  listingId: string;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  deliveryLocation?: string; // buyer's address, required if not SELF_PICKUP
}

export interface CreateOrderInput {
  listingId: string;
  quantity: number;
}

export interface OrderFilterInput {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}