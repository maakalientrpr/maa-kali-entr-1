/*
  Warnings:

  - You are about to drop the column `pickupPoints` on the `tour_package` table. All the data in the column will be lost.
  - You are about to drop the column `priceDoubleSharing` on the `tour_package` table. All the data in the column will be lost.
  - You are about to drop the column `priceTripleSharing` on the `tour_package` table. All the data in the column will be lost.
  - Added the required column `pickupOptionId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TourCategory" AS ENUM ('DOMESTIC', 'INTERNATIONAL', 'WEEKEND');

-- CreateEnum
CREATE TYPE "SharingType" AS ENUM ('SINGLE', 'DOUBLE', 'TRIPLE');

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "pickupOptionId" TEXT NOT NULL,
ADD COLUMN     "sharingType" "SharingType" NOT NULL DEFAULT 'DOUBLE';

-- AlterTable
ALTER TABLE "tour_package" DROP COLUMN "pickupPoints",
DROP COLUMN "priceDoubleSharing",
DROP COLUMN "priceTripleSharing",
ADD COLUMN     "category" "TourCategory" NOT NULL DEFAULT 'DOMESTIC';

-- CreateTable
CREATE TABLE "pickup_option" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceSingleSharing" DOUBLE PRECISION NOT NULL,
    "priceDoubleSharing" DOUBLE PRECISION NOT NULL,
    "priceTripleSharing" DOUBLE PRECISION NOT NULL,
    "tourPackageId" TEXT NOT NULL,

    CONSTRAINT "pickup_option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pickup_option" ADD CONSTRAINT "pickup_option_tourPackageId_fkey" FOREIGN KEY ("tourPackageId") REFERENCES "tour_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_pickupOptionId_fkey" FOREIGN KEY ("pickupOptionId") REFERENCES "pickup_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
