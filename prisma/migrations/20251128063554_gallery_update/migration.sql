/*
  Warnings:

  - You are about to drop the column `tripAlbumId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `TripAlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Year` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `albumId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlbumCategory" AS ENUM ('TOURS', 'PILGRIMAGE', 'EVENTS', 'CATERING');

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_tripAlbumId_fkey";

-- DropForeignKey
ALTER TABLE "TripAlbum" DROP CONSTRAINT "TripAlbum_yearId_fkey";

-- DropIndex
DROP INDEX "Image_tripAlbumId_idx";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "tripAlbumId",
ADD COLUMN     "albumId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TripAlbum";

-- DropTable
DROP TABLE "Year";

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "category" "AlbumCategory" NOT NULL DEFAULT 'TOURS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Album_category_idx" ON "Album"("category");

-- CreateIndex
CREATE INDEX "Image_albumId_idx" ON "Image"("albumId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
