export const farmerMenuSteps = {
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
    next: (input: string) => ({ "1": "postCrop", "2": "showListings", "3": "showOrders", "4": "choosePrediction", "5": "earnings" })[input],
  },
  postCrop: { prompt: "CON Enter crop name", validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input), error: "CON Invalid crop name. Letters only", next: "postQuantity" },
  postQuantity: { prompt: "CON Enter quantity (kg)", validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0, error: "CON Enter a valid quantity e.g. 50", next: "postPrice" },
  postPrice: { prompt: "CON Enter your asking price (NGN per kg)", validate: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0, error: "CON Enter a valid price e.g. 500", next: "postLocation" },
  postLocation: { prompt: "CON Enter pickup location\n0. Use profile location", validate: (input: string) => input.length >= 1, error: "CON Enter a valid location", next: "postDate" },
  postDate: { prompt: "CON Available from (DD/MM/YYYY)", validate: (input: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(input), error: "CON Use format DD/MM/YYYY e.g. 20/06/2025", action: "POST_PRODUCE" },
  earnings: { action: "EARNINGS" },
};