-- The production database contains these legacy fields from the original
-- homepage proof/statistics section, while some fresh databases do not.
-- Keep them compatible without reintroducing that section in the UI.
ALTER TABLE "HomeContent"
ADD COLUMN IF NOT EXISTS "proofEyebrow" TEXT NOT NULL DEFAULT 'Selected work',
ADD COLUMN IF NOT EXISTS "proofTitle" TEXT NOT NULL DEFAULT 'Products built for real needs.',
ADD COLUMN IF NOT EXISTS "proofItems" JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Existing production columns were created without defaults. Adding defaults
-- makes future inserts safe outside Prisma as well.
ALTER TABLE "HomeContent"
ALTER COLUMN "proofEyebrow" SET DEFAULT 'Selected work',
ALTER COLUMN "proofTitle" SET DEFAULT 'Products built for real needs.',
ALTER COLUMN "proofItems" SET DEFAULT '[]'::jsonb;
