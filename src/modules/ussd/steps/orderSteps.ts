export const orderSteps = {
  showOrders: { action: "MY_INCOMING_ORDERS" },
  orderAction: {
    prompt: "CON Invalid selection. Select order number or 0 to go back",
    validate: (input: string) => /^[0-3]$/.test(input),
    error: "CON Invalid selection. Select order number or 0 to go back",
    saveAs: "selectedOrderId",
    transform: (input: string, data: any) => input === "0" ? "0" : (data.orderIds as string)?.split(",")?.[parseInt(input) - 1] ?? "",
    next: (input: string) => (input === "0" ? "menu" : "orderSubmenu"),
  },
  orderSubmenu: {
    prompt: "CON Choose action:\n1. Confirm Order\n2. Cancel Order\n0. Back",
    validate: (input: string) => ["1", "2", "0"].includes(input),
    error: "CON Invalid option. Choose 1, 2, or 0:",
    next: (input: string) => (input === "1" ? "confirmOrder" : input === "2" ? "cancelOrder" : "menu"),
  },
  confirmOrder: { prompt: "CON Confirm this order?\n1. Yes\n2. No", validate: (input: string) => ["1", "2"].includes(input), error: "CON Enter 1 for Yes or 2 for No:", next: (input: string) => (input === "1" ? "doConfirmOrder" : "menu") },
  doConfirmOrder: { action: "CONFIRM_ORDER" },
  cancelOrder: { prompt: "CON Cancel this order?\n1. Yes\n2. No", validate: (input: string) => ["1", "2"].includes(input), error: "CON Enter 1 for Yes or 2 for No:", next: (input: string) => (input === "1" ? "doCancelOrder" : "menu") },
  doCancelOrder: { action: "CANCEL_ORDER" },
};