/*
  Warnings:

  - You are about to drop the `Pilgrimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Pilgrimage";

-- CreateTable
CREATE TABLE "pilgrimage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pilgrimage_pkey" PRIMARY KEY ("id")
);
