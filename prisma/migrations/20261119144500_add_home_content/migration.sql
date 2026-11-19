CREATE TABLE "HomeContent" (
    "id" TEXT NOT NULL,
    "uniqueKey" TEXT NOT NULL DEFAULT 'home',
    "missionEyebrow" TEXT NOT NULL,
    "missionTitle" TEXT NOT NULL,
    "missionParagraphOne" TEXT NOT NULL,
    "missionParagraphTwo" TEXT NOT NULL,
    "officeraUrl" TEXT NOT NULL,
    "junubyUrl" TEXT NOT NULL,
    "proofEyebrow" TEXT NOT NULL,
    "proofTitle" TEXT NOT NULL,
    "proofItems" JSONB NOT NULL,

    CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HomeContent_uniqueKey_key" ON "HomeContent"("uniqueKey");
