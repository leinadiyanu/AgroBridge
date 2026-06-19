/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `price_records` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('SELF_PICKUP', 'FARMER_DELIVERY', 'AGROBRIDGE_DELIVERY');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryDistance" DOUBLE PRECISION,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'SELF_PICKUP';

-- AlterTable
ALTER TABLE "price_records" DROP COLUMN "submittedBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "farmerPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
