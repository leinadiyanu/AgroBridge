export const predictionSteps = {
  choosePrediction: {
    prompt: "CON Price Intelligence\n1. Predict crop price\n2. Best time to sell\n0. Back",
    validate: (input: string) => ["1", "2", "0"].includes(input),
    error: "CON Invalid option. Choose 1, 2, or 0:",
    next: (input: string) => (input === "1" ? "enterCropForPredict" : input === "2" ? "enterCropForBestTime" : "menu"),
  },
  enterCropForPredict: { prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)", validate: (input: string) => input.trim().length > 0, error: "CON Please enter a crop name:", next: "enterStateForPredict" },
  enterStateForPredict: { prompt: "CON Enter your state:\n(e.g. Lagos, Kano, Kaduna)", validate: (input: string) => input.trim().length > 0, error: "CON Please enter a state:", transform: (input: string, data: any) => `${data.enterCropForPredict}|${input}`, action: "PREDICT_PRICE" },
  enterCropForBestTime: { prompt: "CON Enter crop name:\n(e.g. Tomatoes, Maize, Yam)", validate: (input: string) => input.trim().length > 0, error: "CON Please enter a crop name:", action: "BEST_TIME" },
};