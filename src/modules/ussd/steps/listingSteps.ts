export const listingSteps = {
  showListings: { action: "MY_LISTINGS" },
  listingAction: {
    prompt: "CON Invalid selection. Select listing number or 0 to go back",
    validate: (input: string) => /^[0-3]$/.test(input),
    error: "CON Invalid selection. Select listing number or 0 to go back",
    saveAs: "selectedListingId",
    transform: (input: string, data: any) => input === "0" ? "0" : (data.listingIds as string)?.split(",")?.[parseInt(input) - 1] ?? "",
    next: (input: string) => (input === "0" ? "menu" : "listingSubmenu"),
  },
  listingSubmenu: {
    prompt: "CON Choose action:\n1. Mark as Sold\n2. Cancel Listing\n0. Back",
    validate: (input: string) => ["1", "2", "0"].includes(input),
    error: "CON Invalid option. Choose 1, 2, or 0:",
    next: (input: string) => (input === "1" ? "confirmSold" : input === "2" ? "confirmCancel" : "menu"),
  },
  confirmSold: { prompt: "CON Mark listing as sold?\n1. Yes\n2. No", validate: (input: string) => ["1", "2"].includes(input), error: "CON Enter 1 for Yes or 2 for No:", next: (input: string) => (input === "1" ? "doMarkSold" : "menu") },
  doMarkSold: { action: "MARK_LISTING_SOLD" },
  confirmCancel: { prompt: "CON Cancel this listing?\n1. Yes\n2. No", validate: (input: string) => ["1", "2"].includes(input), error: "CON Enter 1 for Yes or 2 for No:", next: (input: string) => (input === "1" ? "doCancelListing" : "menu") },
  doCancelListing: { action: "CANCEL_LISTING" },
};