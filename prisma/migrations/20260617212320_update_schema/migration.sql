/*
  Warnings:

  - A unique constraint covering the columns `[paystackRef]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('PRODUCE', 'LIVESTOCK', 'INPUT');

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_agentId_fkey";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "category" "ListingCategory" NOT NULL DEFAULT 'PRODUCE',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'kg',
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "price_records" ADD COLUMN     "submittedBy" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "escrowRef" TEXT,
ADD COLUMN     "escrowStatus" TEXT,
ADD COLUMN     "paystackRef" TEXT,
ALTER COLUMN "agentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "coverageArea" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "farmSize" TEXT;

-- CreateIndex
CREATE INDEX "listings_category_idx" ON "listings"("category");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_paystackRef_key" ON "transactions"("paystackRef");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
