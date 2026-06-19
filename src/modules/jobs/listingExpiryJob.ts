import cron from "node-cron";
import {prisma} from "../../config/db.js";
import { NotificationService } from "../../modules/notifications/service.js";

const notificationService = new NotificationService();

const STALE_THRESHOLDS_DAYS: Record<string, number> = {
  PRODUCE: 7,
  LIVESTOCK: 21,
  INPUT: 60,
};

// Runs daily at 7am
cron.schedule("0 7 * * *", async () => {
  console.log("Running listing staleness check...");

  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, crop: true, category: true, createdAt: true, farmerId: true },
  });

  const now = Date.now();

  for (const listing of listings) {
    const thresholdDays = STALE_THRESHOLDS_DAYS[listing.category] ?? 14;
    const ageDays = Math.floor(
      (now - listing.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Notify once, right when it crosses the threshold (not every day after)
    if (ageDays === thresholdDays) {
      try {
        await notificationService.notify({
          type: "listing.expiring",
          listingId: listing.id,
          daysLeft: 0, // already at threshold, framed as "time to act"
        });
      } catch {
        console.error(`Failed staleness notice for listing ${listing.id}`);
      }
    }
  }
});