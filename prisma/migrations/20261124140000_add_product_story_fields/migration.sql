ALTER TABLE "Product"
ADD COLUMN "stage" TEXT NOT NULL DEFAULT 'LIVE',
ADD COLUMN "owner" TEXT DEFAULT 'Banjo Systems LLC',
ADD COLUMN "audience" TEXT,
ADD COLUMN "role" TEXT,
ADD COLUMN "capabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "challenge" TEXT,
ADD COLUMN "outcome" TEXT;

UPDATE "Product"
SET
  "image" = COALESCE("image", 'https://www.officera.app/og-image.svg'),
  "tagline" = CASE WHEN "tagline" = 'Administrative software for growing organizations.' THEN 'Collect offline. Report instantly.' ELSE "tagline" END,
  "description" = CASE WHEN "description" LIKE 'An administrative software platform for NGOs,%' THEN 'A field-data platform for humanitarian teams. Officera helps NGOs collect without internet, bring submissions from every district into one place, and generate donor-ready reports in seconds.' ELSE "description" END,
  "audience" = COALESCE("audience", 'Humanitarian teams working across health, WASH, education, protection, food security, and shelter'),
  "role" = COALESCE("role", 'Founder, product designer, and full-stack engineer'),
  "capabilities" = CASE
    WHEN cardinality("capabilities") = 0 THEN ARRAY['Offline collection through ODK', 'KoboToolbox and web-app workflows', 'Centralized submissions and GPS records', 'PDF, Excel, and CSV reporting', 'Five built-in user roles']::TEXT[]
    ELSE "capabilities"
  END,
  "challenge" = COALESCE("challenge", 'Field teams often collect on paper or in disconnected spreadsheets, leaving headquarters to reconcile inconsistent data before every donor or government report.'),
  "outcome" = COALESCE("outcome", 'Officera creates one accountable path from field collection to searchable submissions and export-ready reports, even when field connectivity is unreliable.')
WHERE LOWER("name") = 'officera';

INSERT INTO "Product" (
  "id", "image", "name", "tagline", "description", "year", "status", "isVisible", "tags", "liveUrl",
  "stage", "owner", "audience", "role", "capabilities", "challenge", "outcome", "createdAt", "updatedAt"
)
SELECT
  '7bbd5c60-2bb2-4d0e-a4ac-80cf41fb72ac',
  'https://www.junuby.com/images/junuby-social-preview.jpg',
  'Junuby',
  'Property, cars, and local goods in Juba.',
  'A local marketplace that helps people in Juba discover houses, apartments, plots, cars, and everyday goods. Junuby combines self-service listings with office support and clearly recorded verification levels.',
  2026,
  'PUBLISHED'::"PublishStatus",
  true,
  ARRAY['Marketplace', 'Listings', 'Verification', 'Local commerce']::TEXT[],
  'https://www.junuby.com',
  'LIVE',
  'Banjo Systems LLC',
  'Buyers, renters, property owners, vehicle sellers, and local merchants in Juba',
  'Founder, product designer, and full-stack engineer',
  ARRAY['Property and vehicle listings', 'Junuby Shop for local goods', 'Staff-recorded verification badges', 'Office-assisted search', 'Direct listing enquiries']::TEXT[],
  'Finding property, vehicles, and trustworthy local sellers in Juba is often fragmented across informal channels, with limited information and unclear verification.',
  'Junuby gives the city one focused place to browse, post, enquire, and understand what checks staff recorded for a listing.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Product" WHERE LOWER("name") = 'junuby');
