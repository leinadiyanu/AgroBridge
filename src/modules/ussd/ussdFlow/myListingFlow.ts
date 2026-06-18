export const myListingsFlow = {
  start: "showListings",

  steps: {
    showListings: {
      prompt: "CON My Listings\nFetching...",
      validate: () => true,
      error: "",
      action: "MY_LISTINGS",
    },

    listingAction: {
      prompt: "CON Choose action:\n1. Mark as Sold\n2. Cancel Listing\n0. Back",
      validate: (input: string) => ["1", "2", "0"].includes(input),
      error: "CON Invalid option. Choose 1, 2, or 0:",
      next: (input: string) => {
        if (input === "1") return "confirmSold";
        if (input === "2") return "confirmCancel";
        return "back";
      },
    },

    confirmSold: {
      prompt: "CON Mark listing as sold?\n1. Yes\n2. No",
      validate: (input: string) => ["1", "2"].includes(input),
      error: "CON Enter 1 for Yes or 2 for No:",
      next: (input: string) => (input === "1" ? "doMarkSold" : "back"),
    },

    doMarkSold: {
      prompt: "",
      validate: () => true,
      error: "",
      action: "MARK_LISTING_SOLD",
    },

    confirmCancel: {
      prompt: "CON Cancel this listing?\n1. Yes\n2. No",
      validate: (input: string) => ["1", "2"].includes(input),
      error: "CON Enter 1 for Yes or 2 for No:",
      next: (input: string) => (input === "1" ? "doCancelListing" : "back"),
    },

    doCancelListing: {
      prompt: "",
      validate: () => true,
      error: "",
      action: "CANCEL_LISTING",
    },

    back: {
      prompt:
        "CON Farmer Dashboard\n" +
        "1. Post Produce\n" +
        "2. My Listings\n" +
        "3. Incoming Orders\n" +
        "4. Price Prediction\n" +
        "5. Earnings",
      validate: () => true,
      error: "",
      isTerminal: false,
      next: "back",
    },
  },
};