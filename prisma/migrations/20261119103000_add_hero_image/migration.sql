-- Give the homepage portrait the same CMS control as the rest of the hero.
ALTER TABLE "HeroContent"
ADD COLUMN "image" TEXT,
ADD COLUMN "imageAlt" TEXT NOT NULL DEFAULT 'John Mabeny';
