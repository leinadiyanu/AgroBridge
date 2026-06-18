export const predictionFlow = {
  start: "choosePrediction",

  steps: {
    choosePrediction: {
      prompt:
        "CON Price Intelligence\n" +
        "1. Predict crop price\n" +
        "2. Best time to sell\n" +
        "0. Back",
      validate: (input: string) => ["1", "2", "0"].includes(input),
      error: "CON Invalid option. Choose 1, 2, or 0:",
      next: (input: string) => {
        if (input === "1") return "enterCropForPredict";
        if (input === "2") return "enterCropForBestTime";
        return "back";
      },
    },

    // ── Predict price branch ──────────────────────────────────────
    enterCropForPredict: {
      prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)",
      validate: (input: string) => input.trim().length > 0,
      error: "CON Please enter a crop name:",
      next: "enterStateForPredict",
    },

    enterStateForPredict: {
      prompt: "CON Enter your state:\n(e.g. Lagos, Kano, Kaduna)",
      validate: (input: string) => input.trim().length > 0,
      error: "CON Please enter a state:",
      transform: (input: string, data: any) =>
        `${data.enterCropForPredict}|${input}`, // bundle crop|state together
      action: "PREDICT_PRICE",
    },

    // ── Best time branch ──────────────────────────────────────────
    enterCropForBestTime: {
      prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)",
      validate: (input: string) => input.trim().length > 0,
      error: "CON Please enter a crop name:",
      action: "BEST_TIME",
    },

    back: {
      prompt: (role: string, name: string) =>
        `CON Welcome ${name}\n` +
        "1. Post Produce\n" +
        "2. My Listings\n" +
        "3. Incoming Orders\n" +
        "4. Price Prediction\n" +
        "5. Earnings",
      isTerminal: false,
      validate: () => true,
      error: "",
      next: "back",
    },
  },
};