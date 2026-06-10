import { Role } from "@prisma/client";

// ─── Farmer Flow ─────────────────────────────────────────────────────────────

export const farmerFlow = {
  start: "menu",
  steps: {
    menu: {
      prompt: `CON Farmer Dashboard
1. Post Produce
2. My Listings
3. Incoming Orders
4. Price Prediction
5. Earnings`,
      validate: (input: string) => ["1", "2", "3", "4", "5"].includes(input),
      error: `CON Invalid option
1. Post Produce
2. My Listings
3. Incoming Orders
4. Price Prediction
5. Earnings`,
      next: (input: string) => {
        const map: Record<string, string> = {
          "1": "postCrop",
          "2": "myListings",
          "3": "incomingOrders",
          "4": "pricePredictCrop",
          "5": "earnings",
        };
        return map[input];
      },
    },

    // ── Post Produce ────────────────────────────────────────────
    postCrop: {
      prompt: "CON Enter crop name",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Invalid crop name. Letters only",
      next: "postQuantity",
    },

    postQuantity: {
      prompt: "CON Enter quantity (kg)",
      validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
      error: "CON Enter a valid quantity e.g. 50",
      next: "postPrice",
    },

    postPrice: {
      prompt: "CON Enter your asking price (NGN per kg)",
      validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
      error: "CON Enter a valid price e.g. 500",
      next: "postLocation",
    },

    postLocation: {
      prompt: "CON Enter pickup location\n0. Use profile location",
      validate: (input: string) => input.length >= 1,
      error: "CON Enter a valid location",
      next: "postDate",
    },

    postDate: {
      prompt: "CON Available from (DD/MM/YYYY)",
      validate: (input: string) =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(input),
      error: "CON Use format DD/MM/YYYY e.g. 20/06/2025",
      action: "POST_PRODUCE",
    },

    // ── Price Prediction ────────────────────────────────────────
    pricePredictCrop: {
      prompt: "CON Enter crop name for prediction",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Letters only e.g. Maize",
      action: "PREDICT_PRICE",
    },

    // ── Terminal stubs (populated from DB later) ────────────────
    myListings: {
      prompt: "END Your listings feature coming soon.",
      isTerminal: true,
    },

    incomingOrders: {
      prompt: "END Your orders feature coming soon.",
      isTerminal: true,
    },

    earnings: {
      prompt: "END Your earnings feature coming soon.",
      isTerminal: true,
    },
  },
};

// ─── Buyer Flow ──────────────────────────────────────────────────────────────

export const buyerFlow = {
  start: "menu",
  steps: {
    menu: {
      prompt: `CON Buyer Dashboard
1. Browse Produce
2. My Orders
3. Price Prediction`,
      validate: (input: string) => ["1", "2", "3"].includes(input),
      error: `CON Invalid option
1. Browse Produce
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

    // ── Price Prediction ────────────────────────────────────────
    pricePredictCrop: {
      prompt: "CON Enter crop name for prediction",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Letters only e.g. Maize",
      action: "PREDICT_PRICE",
    },

    // ── Terminal stubs ──────────────────────────────────────────
    myOrders: {
      prompt: "END Your orders feature coming soon.",
      isTerminal: true,
    },
  },
};

// ─── Agent Flow ──────────────────────────────────────────────────────────────

export const agentFlow = {
  start: "menu",
  steps: {
    menu: {
      prompt: `CON Agent Dashboard
1. My Farmers
2. Facilitate Transaction
3. Price Prediction
4. Reports`,
      validate: (input: string) => ["1", "2", "3", "4"].includes(input),
      error: `CON Invalid option
1. My Farmers
2. Facilitate Transaction
3. Price Prediction
4. Reports`,
      next: (input: string) => {
        const map: Record<string, string> = {
          "1": "myFarmers",
          "2": "facilitatePhone",
          "3": "pricePredictCrop",
          "4": "reports",
        };
        return map[input];
      },
    },

    // ── Manage Farmers ──────────────────────────────────────────
    myFarmers: {
      prompt: `CON My Farmers
1. View Farmers
2. Add Farmer`,
      validate: (input: string) => ["1", "2"].includes(input),
      error: `CON Invalid option
1. View Farmers
2. Add Farmer`,
      next: (input: string) =>
        input === "1" ? "viewFarmers" : "addFarmerPhone",
    },

    addFarmerPhone: {
      prompt: "CON Enter farmer's phone number",
      validate: (input: string) => /^\d{10,13}$/.test(input),
      error: "CON Enter a valid phone number",
      action: "ADD_FARMER",
    },

    // ── Facilitate Transaction ──────────────────────────────────
    facilitatePhone: {
      prompt: "CON Enter farmer's phone number",
      validate: (input: string) => /^\d{10,13}$/.test(input),
      error: "CON Enter a valid phone number",
      next: "facilitateBuyerPhone",
    },

    facilitateBuyerPhone: {
      prompt: "CON Enter buyer's phone number",
      validate: (input: string) => /^\d{10,13}$/.test(input),
      error: "CON Enter a valid phone number",
      next: "facilitateAmount",
    },

    facilitateAmount: {
      prompt: "CON Enter transaction amount (NGN)",
      validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0,
      error: "CON Enter a valid amount e.g. 5000",
      next: "facilitatePin",
    },

    facilitatePin: {
      prompt: "CON Enter your PIN to confirm",
      validate: (input: string) => /^\d{4}$/.test(input),
      error: "CON PIN must be 4 digits",
      action: "FACILITATE_TRANSACTION",
    },

    // ── Price Prediction ────────────────────────────────────────
    pricePredictCrop: {
      prompt: "CON Enter crop name for prediction",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Letters only e.g. Maize",
      action: "PREDICT_PRICE",
    },

    // ── Terminal stubs ──────────────────────────────────────────
    viewFarmers: {
      prompt: "END Farmer list coming soon.",
      isTerminal: true,
    },

    reports: {
      prompt: "END Reports coming soon.",
      isTerminal: true,
    },
  },
};

// ─── Role router ─────────────────────────────────────────────────────────────

export const dashboardFlowFor = (role: Role) => {
  const map = {
    [Role.FARMER]: farmerFlow,
    [Role.BUYER]:  buyerFlow,
    [Role.AGENT]:  agentFlow,
  } as any;
  return map[role];
};