-- AlterTable
ALTER TABLE "Project"
ADD COLUMN "highlights" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
