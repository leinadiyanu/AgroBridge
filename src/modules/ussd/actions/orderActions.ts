import type { ActionHandler } from "../actions/types.js";

export const orderActions: Record<string, ActionHandler> = {
  MY_INCOMING_ORDERS: async ({ repo, session, phoneNumber }) => {
    try {
      const orders = await repo.getIncomingOrders(phoneNumber);
      if (!orders.length) {
        await repo.deleteSession(phoneNumber);
        return "END You have no incoming orders.";
      }
      const lines = orders.slice(0, 3).map((o: any, i: number) => `${i + 1}. ${o.listing.crop} ${o.quantity}kg - NGN ${o.totalPrice}\n   Buyer: ${o.buyer.name}`).join("\n");
      session.data.orderIds = orders.slice(0, 3).map((o: any) => o.id).join(",");
      session.step = "orderAction";
      await repo.saveSession(phoneNumber, session);
      return `CON Incoming Orders:\n${lines}\n\nSelect order number or 0 to go back`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch orders. Try again.";
    }
  },

  CONFIRM_ORDER: async ({ repo, session, phoneNumber }) => {
    try {
      const orderId = session.data.selectedOrderId;
      if (!orderId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      const result = await repo.confirmOrder(orderId);
      await repo.deleteSession(phoneNumber);
      if (!result.ok) return `END ${result.message}`;
      return `END Order confirmed.\n${result.crop} ${result.quantity}kg to ${result.buyerName}.\nAwaiting buyer payment.`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not confirm order. Try again.";
    }
  },

  CANCEL_ORDER: async ({ repo, session, phoneNumber }) => {
    try {
      const orderId = session.data.selectedOrderId;
      if (!orderId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      await repo.updateOrderStatus(orderId, "CANCELLED");
      await repo.deleteSession(phoneNumber);
      return "END Order cancelled.";
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not cancel order. Try again.";
    }
  },

  BROWSE_PRODUCE: async ({ repo, session, phoneNumber, latestInput }) => {
    try {
      const listings = await repo.getListingsByCrop(latestInput.trim());
      if (!listings.length) {
        await repo.deleteSession(phoneNumber);
        return `END No listings found for ${latestInput}.`;
      }
      const lines = listings.slice(0, 3).map((l: any, i: number) => `${i + 1}. ${l.crop} ${l.quantity}kg @${l.price}/kg - ${l.location}`).join("\n");
      session.data.browseListingIds = listings.slice(0, 3).map((l: any) => l.id).join(",");
      session.step = "browseSelect";
      await repo.saveSession(phoneNumber, session);
      return `CON Results:\n${lines}\n\nSelect listing number to order, or 0 to go back`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch listings. Try again.";
    }
  },

  PLACE_ORDER: async ({ repo, session, phoneNumber, value }) => {
    try {
      const listingId = session.data.selectedListingId;
      if (!listingId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      const result = await repo.createOrder({ buyerPhone: phoneNumber, listingId, quantity: parseInt(value) });
      await repo.deleteSession(phoneNumber);
      if (!result.ok) return `END ${result.message}`;
      return `END Order placed!\n${result.crop} ${value}kg\nTotal: NGN ${result.totalPrice}\nAwaiting farmer confirmation.`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Failed to place order. Try again.";
    }
  },

  MY_ORDERS: async ({ repo, session, phoneNumber }) => {
    try {
      const orders = await repo.getOrdersByBuyerPhone(phoneNumber);
      if (!orders.length) {
        await repo.deleteSession(phoneNumber);
        return "END You have no orders yet.";
      }
      const lines = orders.slice(0, 3).map((o: any, i: number) => `${i + 1}. ${o.listing.crop} ${o.quantity}kg - ${o.status}`).join("\n");
      session.data.buyerOrderIds = orders.slice(0, 3).map((o: any) => o.id).join(",");
      session.step = "orderStatusAction";
      await repo.saveSession(phoneNumber, session);
      return `CON My Orders:\n${lines}\n\nSelect order number or 0 to go back`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch orders. Try again.";
    }
  },

  VIEW_ORDER_STATUS: async ({ repo, session, phoneNumber }) => {
    try {
      const orderId = session.data.selectedBuyerOrderId;
      if (!orderId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      const order = await repo.getOrderById(orderId);
      await repo.deleteSession(phoneNumber);
      if (!order) return "END Order not found.";
      return `END ${order.listing.crop} ${order.quantity}kg\nStatus: ${order.status}\nTotal: NGN ${order.totalPrice}`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch order. Try again.";
    }
  },

  CANCEL_MY_ORDER: async ({ repo, session, phoneNumber }) => {
    try {
      const orderId = session.data.selectedBuyerOrderId;
      if (!orderId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      const order = await repo.getOrderById(orderId);
      if (!order || order.status !== "PENDING") {
        await repo.deleteSession(phoneNumber);
        return "END This order can no longer be cancelled.";
      }
      await repo.updateOrderStatus(orderId, "CANCELLED");
      await repo.deleteSession(phoneNumber);
      return "END Order cancelled.";
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not cancel order. Try again.";
    }
  },
};