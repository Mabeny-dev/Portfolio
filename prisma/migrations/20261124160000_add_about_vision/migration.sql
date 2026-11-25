ALTER TABLE "AboutContent"
ADD COLUMN "visionTitle" TEXT,
ADD COLUMN "visionBody" TEXT;

UPDATE "AboutContent"
SET
  "visionTitle" = COALESCE("visionTitle", 'Building practical software through Banjo Systems'),
  "visionBody" = COALESCE("visionBody", 'Banjo Systems LLC is the company through which I am building software for NGOs, businesses, churches, schools, and public-sector organizations. Products such as Officera and Junuby are the beginning of a broader portfolio designed around real operational needs across Africa.');
