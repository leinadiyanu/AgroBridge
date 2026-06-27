import type { ActionHandler } from "../actions/types.js";

export const listingActions: Record<string, ActionHandler> = {
  POST_PRODUCE: async ({ repo, session, phoneNumber, latestInput }) => {
    const { postCrop, postQuantity, postPrice, postLocation } = session.data;
    if (!postCrop || !postQuantity || !postPrice || !postLocation) {
      await repo.deleteSession(phoneNumber);
      return "END Something went wrong. Please try again.";
    }
    const location = postLocation === "0" ? (session.data.profileLocation ?? session.data.location) : postLocation;
    if (!location) {
      await repo.deleteSession(phoneNumber);
      return "END Could not resolve location. Please try again.";
    }
    try {
      await repo.createListing({ phoneNumber, crop: postCrop, quantity: parseInt(postQuantity), price: parseInt(postPrice), location, availableFrom: latestInput });
      await repo.deleteSession(phoneNumber);
      return `END Listing posted!\n${postCrop}, ${postQuantity}kg @ NGN ${postPrice}/kg`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Failed to post listing. Try again.";
    }
  },

  MY_LISTINGS: async ({ repo, session, phoneNumber }) => {
    try {
      const listings = await repo.getListingsByPhone(phoneNumber);
      if (!listings.length) {
        await repo.deleteSession(phoneNumber);
        return "END You have no active listings.";
      }
      const lines = listings.slice(0, 3).map((l: any, i: number) => `${i + 1}. ${l.crop} ${l.quantity}kg @${l.price}/kg`).join("\n");
      session.data.listingIds = listings.slice(0, 3).map((l: any) => l.id).join(",");
      session.step = "listingAction";
      await repo.saveSession(phoneNumber, session);
      return `CON My Listings:\n${lines}\n\nSelect listing number or 0 to go back`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch listings. Try again.";
    }
  },

  MARK_LISTING_SOLD: async ({ repo, session, phoneNumber }) => {
    try {
      const listingId = session.data.selectedListingId;
      if (!listingId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      await repo.updateListingStatus(listingId, "SOLD");
      await repo.deleteSession(phoneNumber);
      return "END Listing marked as sold successfully.";
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not update listing. Try again.";
    }
  },

  CANCEL_LISTING: async ({ repo, session, phoneNumber }) => {
    try {
      const listingId = session.data.selectedListingId;
      if (!listingId) {
        await repo.deleteSession(phoneNumber);
        return "END Session expired. Please try again.";
      }
      await repo.updateListingStatus(listingId, "CANCELLED");
      await repo.deleteSession(phoneNumber);
      return "END Listing cancelled successfully.";
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not cancel listing. Try again.";
    }
  },
};