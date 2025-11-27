-- AlterTable
ALTER TABLE "pickup_option" ALTER COLUMN "priceDoubleSharing" DROP NOT NULL,
ALTER COLUMN "priceTripleSharing" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "yearNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "yearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tripAlbumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Year_yearNumber_key" ON "Year"("yearNumber");

-- CreateIndex
CREATE INDEX "TripAlbum_yearId_idx" ON "TripAlbum"("yearId");

-- CreateIndex
CREATE INDEX "Image_tripAlbumId_idx" ON "Image"("tripAlbumId");

-- AddForeignKey
ALTER TABLE "TripAlbum" ADD CONSTRAINT "TripAlbum_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_tripAlbumId_fkey" FOREIGN KEY ("tripAlbumId") REFERENCES "TripAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
