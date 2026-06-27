export const buyerSteps = {
    menu: {
      prompt: `CON Buyer Dashboard
1. Browse & Order Produce
2. My Orders
3. Price Prediction`,
      validate: (input: string) => ["1", "2", "3"].includes(input),
      error: `CON Invalid option
1. Browse & Order Produce
2. My Orders
3. Price Prediction`,
      next: (input: string) => {
        const map: Record<string, string> = {
          "1": "browseProduce",
          "2": "myOrders",
          "3": "pricePredictCrop",
        };
        return map[input];
      },
    },

    // ── Browse & Order ──────────────────────────────────────────
    browseProduce: {
      prompt: "CON Enter crop to search",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Letters only e.g. Tomato",
      action: "BROWSE_PRODUCE",
    },

    browseSelect: {
      prompt: "CON Invalid selection. Select listing number or 0 to go back",
      validate: (input: string) => /^[0-3]$/.test(input),
      error: "CON Invalid selection. Select listing number or 0 to go back",
      saveAs: "selectedListingId",
      transform: (input: string, data: any) => {
        if (input === "0") return "0";
        const ids = (data.browseListingIds as string)?.split(",") ?? [];
        return ids[parseInt(input) - 1] ?? "";
      },
      next: (input: string) => (input === "0" ? "menu" : "enterOrderQuantity"),
    },

    enterOrderQuantity: {
      prompt: "CON Enter quantity to order (kg)",
      validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
      error: "CON Enter a valid quantity e.g. 20",
      action: "PLACE_ORDER",
    },

    // ── My Orders ────────────────────────────────────────────────
    myOrders: { action: "MY_ORDERS" },

    orderStatusAction: {
      prompt: "CON Invalid selection. Select order number or 0 to go back",
      validate: (input: string) => /^[0-3]$/.test(input),
      error: "CON Invalid selection. Select order number or 0 to go back",
      saveAs: "selectedBuyerOrderId",
      transform: (input: string, data: any) => {
        if (input === "0") return "0";
        const ids = (data.buyerOrderIds as string)?.split(",") ?? [];
        return ids[parseInt(input) - 1] ?? "";
      },
      next: (input: string) => (input === "0" ? "menu" : "buyerOrderSubmenu"),
    },
    buyerOrderSubmenu: {
      prompt: "CON 1. View Status\n2. Cancel Order\n0. Back",
      validate: (input: string) => ["1", "2", "0"].includes(input),
      error: "CON Invalid option. Choose 1, 2, or 0:",
      next: (input: string) =>
        input === "1"
          ? "viewOrderStatus"
          : input === "2"
            ? "confirmCancelMyOrder"
            : "menu",
    },
    viewOrderStatus: { action: "VIEW_ORDER_STATUS" },
    confirmCancelMyOrder: {
      prompt: "CON Cancel this order?\n1. Yes\n2. No",
      validate: (input: string) => ["1", "2"].includes(input),
      error: "CON Enter 1 for Yes or 2 for No:",
      next: (input: string) => (input === "1" ? "doCancelMyOrder" : "menu"),
    },
    doCancelMyOrder: { action: "CANCEL_MY_ORDER" },

    // ── Price Prediction (simple, unchanged) ────────────────────
    pricePredictCrop: {
      prompt: "CON Enter crop name for prediction",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Letters only e.g. Maize",
      action: "PREDICT_PRICE",
    },
};