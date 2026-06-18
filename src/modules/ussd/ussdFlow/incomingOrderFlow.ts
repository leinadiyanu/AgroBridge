export const incomingOrdersFlow = {
  start: "showOrders",

  steps: {
    showOrders: {
      prompt: "CON Incoming Orders\nFetching...",
      validate: () => true,
      error: "",
      action: "MY_INCOMING_ORDERS",
    },

    orderAction: {
      prompt: "CON Choose action:\n1. Confirm Order\n2. Cancel Order\n0. Back",
      validate: (input: string) => ["1", "2", "0"].includes(input),
      error: "CON Invalid option:",
      next: (input: string) => {
        if (input === "1") return "confirmOrder";
        if (input === "2") return "cancelOrder";
        return "back";
      },
    },

    confirmOrder: {
      prompt: "CON Confirm this order?\n1. Yes\n2. No",
      validate: (input: string) => ["1", "2"].includes(input),
      error: "CON Enter 1 for Yes or 2 for No:",
      next: (input: string) => (input === "1" ? "doConfirmOrder" : "back"),
    },

    doConfirmOrder: {
      prompt: "",
      validate: () => true,
      error: "",
      action: "CONFIRM_ORDER",
    },

    cancelOrder: {
      prompt: "CON Cancel this order?\n1. Yes\n2. No",
      validate: (input: string) => ["1", "2"].includes(input),
      error: "CON Enter 1 for Yes or 2 for No:",
      next: (input: string) => (input === "1" ? "doCancelOrder" : "back"),
    },

    doCancelOrder: {
      prompt: "",
      validate: () => true,
      error: "",
      action: "CANCEL_ORDER",
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