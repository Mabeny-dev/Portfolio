-- AlterTable
ALTER TABLE "ContactMessage"
ADD COLUMN "senderCountry" TEXT,
ADD COLUMN "senderCity" TEXT,
ADD COLUMN "senderCountryCode" TEXT;

-- CreateIndex
CREATE INDEX "ContactMessage_senderCountryCode_idx" ON "ContactMessage"("senderCountryCode");

-- CreateIndex
CREATE INDEX "Visitor_ipAddress_idx" ON "Visitor"("ipAddress");

-- CreateIndex
CREATE INDEX "Visitor_countryCode_idx" ON "Visitor"("countryCode");

-- CreateIndex
CREATE INDEX "SiteVisit_visitorId_idx" ON "SiteVisit"("visitorId");

-- CreateIndex
CREATE INDEX "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt" DESC);
