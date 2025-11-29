-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'CLOSED', 'PLANNED');

-- CreateTable
CREATE TABLE "proposed_tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" "PollStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposed_tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proposedTourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tour_vote_userId_proposedTourId_key" ON "tour_vote"("userId", "proposedTourId");

-- AddForeignKey
ALTER TABLE "tour_vote" ADD CONSTRAINT "tour_vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_vote" ADD CONSTRAINT "tour_vote_proposedTourId_fkey" FOREIGN KEY ("proposedTourId") REFERENCES "proposed_tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
