/*
  Warnings:

  - You are about to drop the column `calculatorType` on the `SavedCalculation` table. All the data in the column will be lost.
  - Added the required column `slug` to the `SavedCalculation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedCalculation" DROP COLUMN "calculatorType",
ADD COLUMN     "slug" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CalculatorType";

-- CreateTable
CREATE TABLE "CalculatorOverride" (
    "slug" TEXT NOT NULL,
    "titleEn" TEXT,
    "titleAr" TEXT,
    "shortEn" TEXT,
    "shortAr" TEXT,
    "descEn" TEXT,
    "descAr" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalculatorOverride_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageEvent_slug_createdAt_idx" ON "UsageEvent"("slug", "createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_handled_createdAt_idx" ON "ContactMessage"("handled", "createdAt" DESC);
