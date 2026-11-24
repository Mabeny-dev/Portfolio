ALTER TABLE "Project"
ADD COLUMN "role" TEXT,
ADD COLUMN "challenge" TEXT,
ADD COLUMN "solution" TEXT,
ADD COLUMN "outcome" TEXT;

UPDATE "Project"
SET "status" = 'DRAFT', "isVisible" = false
WHERE "title" IN (
  'E-Commerce Platform',
  'Task Management App',
  'Blog CMS',
  'Analytics Dashboard'
);
