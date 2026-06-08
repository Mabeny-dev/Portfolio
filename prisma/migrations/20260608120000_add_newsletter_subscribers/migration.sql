-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorId" TEXT,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key"
ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_createdAt_idx"
ON "NewsletterSubscriber"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_countryCode_idx"
ON "NewsletterSubscriber"("countryCode");

-- AddForeignKey
ALTER TABLE "NewsletterSubscriber"
ADD CONSTRAINT "NewsletterSubscriber_visitorId_fkey"
FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
