// import { Role } from "@prisma/client";

// // ─── Farmer Flow ─────────────────────────────────────────────────────────────

// export const farmerFlow = {
//   start: "menu",
//   steps: {
//     menu: {
//       prompt: `CON Farmer Dashboard
// 1. Post Produce
// 2. My Listings
// 3. Incoming Orders
// 4. Price Prediction
// 5. Earnings`,
//       validate: (input: string) => ["1", "2", "3", "4", "5"].includes(input),
//       error: `CON Invalid option
// 1. Post Produce
// 2. My Listings
// 3. Incoming Orders
// 4. Price Prediction
// 5. Earnings`,
//       next: (input: string) => {
//         const map: Record<string, string> = {
//           "1": "postCrop",
//           "2": "showListings",
//           "3": "showOrders",
//           "4": "choosePrediction",
//           "5": "earnings",
//         };
//         return map[input];
//       },
//     },

//     // ── Post Produce (unchanged) ──────────────────────────────
//     postCrop: {
//       prompt: "CON Enter crop name",
//       validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
//       error: "CON Invalid crop name. Letters only",
//       next: "postQuantity",
//     },
//     postQuantity: {
//       prompt: "CON Enter quantity (kg)",
//       validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
//       error: "CON Enter a valid quantity e.g. 50",
//       next: "postPrice",
//     },
//     postPrice: {
//       prompt: "CON Enter your asking price (NGN per kg)",
//       validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
//       error: "CON Enter a valid price e.g. 500",
//       next: "postLocation",
//     },
//     postLocation: {
//       prompt: "CON Enter pickup location\n0. Use profile location",
//       validate: (input: string) => input.length >= 1,
//       error: "CON Enter a valid location",
//       next: "postDate",
//     },
//     postDate: {
//       prompt: "CON Available from (DD/MM/YYYY)",
//       validate: (input: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(input),
//       error: "CON Use format DD/MM/YYYY e.g. 20/06/2025",
//       action: "POST_PRODUCE",
//     },

//     // ── My Listings ────────────────────────────────────────────
//     showListings: { action: "MY_LISTINGS" },

//     listingAction: {
//       // landed on right after MY_LISTINGS — input here SELECTS a listing
//       prompt: "CON Invalid selection. Select listing number or 0 to go back",
//       validate: (input: string) => /^[0-3]$/.test(input),
//       error: "CON Invalid selection. Select listing number or 0 to go back",
//       saveAs: "selectedListingId",
//       transform: (input: string, data: any) => {
//         if (input === "0") return "0";
//         const ids = (data.listingIds as string)?.split(",") ?? [];
//         return ids[parseInt(input) - 1] ?? "";
//       },
//       next: (input: string) => (input === "0" ? "menu" : "listingSubmenu"),
//     },
//     listingSubmenu: {
//       prompt: "CON Choose action:\n1. Mark as Sold\n2. Cancel Listing\n0. Back",
//       validate: (input: string) => ["1", "2", "0"].includes(input),
//       error: "CON Invalid option. Choose 1, 2, or 0:",
//       next: (input: string) =>
//         input === "1"
//           ? "confirmSold"
//           : input === "2"
//             ? "confirmCancel"
//             : "menu",
//     },
//     confirmSold: {
//       prompt: "CON Mark listing as sold?\n1. Yes\n2. No",
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: "CON Enter 1 for Yes or 2 for No:",
//       next: (input: string) => (input === "1" ? "doMarkSold" : "menu"),
//     },
//     doMarkSold: { action: "MARK_LISTING_SOLD" },
//     confirmCancel: {
//       prompt: "CON Cancel this listing?\n1. Yes\n2. No",
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: "CON Enter 1 for Yes or 2 for No:",
//       next: (input: string) => (input === "1" ? "doCancelListing" : "menu"),
//     },
//     doCancelListing: { action: "CANCEL_LISTING" },

//     // ── Incoming Orders ────────────────────────────────────────
//     showOrders: { action: "MY_INCOMING_ORDERS" },

//     orderAction: {
//       prompt: "CON Invalid selection. Select order number or 0 to go back",
//       validate: (input: string) => /^[0-3]$/.test(input),
//       error: "CON Invalid selection. Select order number or 0 to go back",
//       saveAs: "selectedOrderId",
//       transform: (input: string, data: any) => {
//         if (input === "0") return "0";
//         const ids = (data.orderIds as string)?.split(",") ?? [];
//         return ids[parseInt(input) - 1] ?? "";
//       },
//       next: (input: string) => (input === "0" ? "menu" : "orderSubmenu"),
//     },
//     orderSubmenu: {
//       prompt: "CON Choose action:\n1. Confirm Order\n2. Cancel Order\n0. Back",
//       validate: (input: string) => ["1", "2", "0"].includes(input),
//       error: "CON Invalid option. Choose 1, 2, or 0:",
//       next: (input: string) =>
//         input === "1" ? "confirmOrder" : input === "2" ? "cancelOrder" : "menu",
//     },
//     confirmOrder: {
//       prompt: "CON Confirm this order?\n1. Yes\n2. No",
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: "CON Enter 1 for Yes or 2 for No:",
//       next: (input: string) => (input === "1" ? "doConfirmOrder" : "menu"),
//     },
//     doConfirmOrder: { action: "CONFIRM_ORDER" },
//     cancelOrder: {
//       prompt: "CON Cancel this order?\n1. Yes\n2. No",
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: "CON Enter 1 for Yes or 2 for No:",
//       next: (input: string) => (input === "1" ? "doCancelOrder" : "menu"),
//     },
//     doCancelOrder: { action: "CANCEL_ORDER" },

//     // ── Price Prediction (upgraded — predict price OR best time) ─
//     choosePrediction: {
//       prompt:
//         "CON Price Intelligence\n1. Predict crop price\n2. Best time to sell\n0. Back",
//       validate: (input: string) => ["1", "2", "0"].includes(input),
//       error: "CON Invalid option. Choose 1, 2, or 0:",
//       next: (input: string) =>
//         input === "1"
//           ? "enterCropForPredict"
//           : input === "2"
//             ? "enterCropForBestTime"
//             : "menu",
//     },
//     enterCropForPredict: {
//       prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)",
//       validate: (input: string) => input.trim().length > 0,
//       error: "CON Please enter a crop name:",
//       next: "enterStateForPredict",
//     },
//     enterStateForPredict: {
//       prompt: "CON Enter your state:\n(e.g. Lagos, Kano, Kaduna)",
//       validate: (input: string) => input.trim().length > 0,
//       error: "CON Please enter a state:",
//       transform: (input: string, data: any) =>
//         `${data.enterCropForPredict}|${input}`,
//       action: "PREDICT_PRICE",
//     },
//     enterCropForBestTime: {
//       prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)",
//       validate: (input: string) => input.trim().length > 0,
//       error: "CON Please enter a crop name:",
//       action: "BEST_TIME",
//     },

//     // ── Earnings ───────────────────────────────────────────────
//     earnings: { action: "EARNINGS" },
//   },
// };

// // ─── Buyer Flow ──────────────────────────────────────────────────────────────

// export const buyerFlow = {
//   start: "menu",
//   steps: {
//     menu: {
//       prompt: `CON Buyer Dashboard
// 1. Browse & Order Produce
// 2. My Orders
// 3. Price Prediction`,
//       validate: (input: string) => ["1", "2", "3"].includes(input),
//       error: `CON Invalid option
// 1. Browse & Order Produce
// 2. My Orders
// 3. Price Prediction`,
//       next: (input: string) => {
//         const map: Record<string, string> = {
//           "1": "browseProduce",
//           "2": "myOrders",
//           "3": "pricePredictCrop",
//         };
//         return map[input];
//       },
//     },

//     // ── Browse & Order ──────────────────────────────────────────
//     browseProduce: {
//       prompt: "CON Enter crop to search",
//       validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
//       error: "CON Letters only e.g. Tomato",
//       action: "BROWSE_PRODUCE",
//     },

//     browseSelect: {
//       prompt: "CON Invalid selection. Select listing number or 0 to go back",
//       validate: (input: string) => /^[0-3]$/.test(input),
//       error: "CON Invalid selection. Select listing number or 0 to go back",
//       saveAs: "selectedListingId",
//       transform: (input: string, data: any) => {
//         if (input === "0") return "0";
//         const ids = (data.browseListingIds as string)?.split(",") ?? [];
//         return ids[parseInt(input) - 1] ?? "";
//       },
//       next: (input: string) => (input === "0" ? "menu" : "enterOrderQuantity"),
//     },

//     enterOrderQuantity: {
//       prompt: "CON Enter quantity to order (kg)",
//       validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
//       error: "CON Enter a valid quantity e.g. 20",
//       action: "PLACE_ORDER",
//     },

//     // ── My Orders ────────────────────────────────────────────────
//     myOrders: { action: "MY_ORDERS" },

//     orderStatusAction: {
//       prompt: "CON Invalid selection. Select order number or 0 to go back",
//       validate: (input: string) => /^[0-3]$/.test(input),
//       error: "CON Invalid selection. Select order number or 0 to go back",
//       saveAs: "selectedBuyerOrderId",
//       transform: (input: string, data: any) => {
//         if (input === "0") return "0";
//         const ids = (data.buyerOrderIds as string)?.split(",") ?? [];
//         return ids[parseInt(input) - 1] ?? "";
//       },
//       next: (input: string) => (input === "0" ? "menu" : "buyerOrderSubmenu"),
//     },
//     buyerOrderSubmenu: {
//       prompt: "CON 1. View Status\n2. Cancel Order\n0. Back",
//       validate: (input: string) => ["1", "2", "0"].includes(input),
//       error: "CON Invalid option. Choose 1, 2, or 0:",
//       next: (input: string) =>
//         input === "1"
//           ? "viewOrderStatus"
//           : input === "2"
//             ? "confirmCancelMyOrder"
//             : "menu",
//     },
//     viewOrderStatus: { action: "VIEW_ORDER_STATUS" },
//     confirmCancelMyOrder: {
//       prompt: "CON Cancel this order?\n1. Yes\n2. No",
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: "CON Enter 1 for Yes or 2 for No:",
//       next: (input: string) => (input === "1" ? "doCancelMyOrder" : "menu"),
//     },
//     doCancelMyOrder: { action: "CANCEL_MY_ORDER" },

//     // ── Price Prediction (simple, unchanged) ────────────────────
//     pricePredictCrop: {
//       prompt: "CON Enter crop name for prediction",
//       validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
//       error: "CON Letters only e.g. Maize",
//       action: "PREDICT_PRICE",
//     },
//   },
// };

// // ─── Agent Flow ──────────────────────────────────────────────────────────────

// export const agentFlow = {
//   start: "menu",
//   steps: {
//     menu: {
//       prompt: `CON Agent Dashboard
// 1. My Farmers
// 2. Facilitate Transaction
// 3. Price Prediction
// 4. Reports`,
//       validate: (input: string) => ["1", "2", "3", "4"].includes(input),
//       error: `CON Invalid option
// 1. My Farmers
// 2. Facilitate Transaction
// 3. Price Prediction
// 4. Reports`,
//       next: (input: string) => {
//         const map: Record<string, string> = {
//           "1": "myFarmers",
//           "2": "facilitatePhone",
//           "3": "pricePredictCrop",
//           "4": "reports",
//         };
//         return map[input];
//       },
//     },

//     myFarmers: {
//       prompt: `CON My Farmers
// 1. View Farmers
// 2. Add Farmer`,
//       validate: (input: string) => ["1", "2"].includes(input),
//       error: `CON Invalid option
// 1. View Farmers
// 2. Add Farmer`,
//       next: (input: string) => (input === "1" ? "viewFarmers" : "addFarmerPhone"),
//     },
//     viewFarmers: { action: "VIEW_FARMERS" },
//     addFarmerPhone: {
//       prompt: "CON Enter farmer's phone number",
//       validate: (input: string) => /^\d{10,13}$/.test(input),
//       error: "CON Enter a valid phone number",
//       action: "ADD_FARMER",
//     },

//     // ── Facilitate Transaction (unchanged, already working) ──────
//     facilitatePhone: {
//       prompt: "CON Enter farmer's phone number",
//       validate: (input: string) => /^\d{10,13}$/.test(input),
//       error: "CON Enter a valid phone number",
//       next: "facilitateBuyerPhone",
//     },
//     facilitateBuyerPhone: {
//       prompt: "CON Enter buyer's phone number",
//       validate: (input: string) => /^\d{10,13}$/.test(input),
//       error: "CON Enter a valid phone number",
//       next: "facilitateAmount",
//     },
//     facilitateAmount: {
//       prompt: "CON Enter transaction amount (NGN)",
//       validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
//       error: "CON Enter a valid amount e.g. 5000",
//       next: "facilitatePin",
//     },
//     facilitatePin: {
//       prompt: "CON Enter your PIN to confirm",
//       validate: (input: string) => /^\d{4}$/.test(input),
//       error: "CON PIN must be 4 digits",
//       action: "FACILITATE_TRANSACTION",
//     },

//     pricePredictCrop: {
//       prompt: "CON Enter crop name for prediction",
//       validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
//       error: "CON Letters only e.g. Maize",
//       action: "PREDICT_PRICE",
//     },

//     reports: { action: "AGENT_REPORTS" },
//   },
// };

// // ─── Role router ─────────────────────────────────────────────────────────────

// export const dashboardFlowFor = (role: Role) => {
//   const map = {
//     [Role.FARMER]: farmerFlow,
//     [Role.BUYER]: buyerFlow,
//     [Role.AGENT]: agentFlow,
//   } as any;
//   return map[role];
// };
