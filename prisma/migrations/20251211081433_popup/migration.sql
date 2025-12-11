-- CreateTable
CREATE TABLE "PromotionalPopup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "linkUrl" TEXT DEFAULT '/contact',
    "title" TEXT DEFAULT 'Plan Your Next Yatra?',
    "description" TEXT DEFAULT 'Get exclusive discounts on Chardham bookings this month!',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalPopup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromotionalPopup_key_key" ON "PromotionalPopup"("key");
