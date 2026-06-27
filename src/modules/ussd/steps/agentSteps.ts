export const agentSteps = {
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

  myFarmers: {
    prompt: `CON My Farmers
1. View Farmers
2. Add Farmer`,
    validate: (input: string) => ["1", "2"].includes(input),
    error: `CON Invalid option
1. View Farmers
2. Add Farmer`,
    next: (input: string) => (input === "1" ? "viewFarmers" : "addFarmerPhone"),
  },
  viewFarmers: { action: "VIEW_FARMERS" },
  addFarmerPhone: {
    prompt: "CON Enter farmer's phone number",
    validate: (input: string) => /^\d{10,13}$/.test(input),
    error: "CON Enter a valid phone number",
    action: "ADD_FARMER",
  },

  // ── Facilitate Transaction (unchanged, already working) ──────
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

  pricePredictCrop: {
    prompt: "CON Enter crop name for prediction",
    validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
    error: "CON Letters only e.g. Maize",
    action: "PREDICT_PRICE",
  },

  reports: { action: "AGENT_REPORTS" },
};
