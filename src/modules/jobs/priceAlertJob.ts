// src/jobs/priceAlert.job.ts
import cron from "node-cron";
import { prisma } from "../../config/db.js";
import { PredictionService } from "../../modules/predictions/service.js";
import { NotificationService } from "../../modules/notifications/service.js";

const predictionService = new PredictionService();
const notificationService = new NotificationService();

// Runs every Monday at 8am
cron.schedule("0 8 * * 1", async () => {
  console.log("Running price alert job...");

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      priceAlertEnabled: true,
    },
    include: {
      farmer: {
        select: { name: true, phoneNumber: true, email: true, location: true },
      },
    },
  });

  for (const listing of listings) {
    try {
      const result = await predictionService.predict({
        commodity: listing.crop,
        state: listing.farmer.location,
      });

      await notificationService.notify({
        type: "price.alert",
        userId: listing.farmerId,
        farmer: listing.farmer,
        crop: listing.crop,
        direction: result.direction,
        advice: result.advice,
      });
    } catch {
      console.error(`Price alert failed for listing ${listing.id}`);
    }
  }
});
