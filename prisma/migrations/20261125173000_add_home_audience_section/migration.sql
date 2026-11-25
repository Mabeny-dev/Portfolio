ALTER TABLE "HomeContent"
ADD COLUMN IF NOT EXISTS "audienceEyebrow" TEXT NOT NULL DEFAULT 'Who I serve',
ADD COLUMN IF NOT EXISTS "audienceTitle" TEXT NOT NULL DEFAULT 'Who I Build For',
ADD COLUMN IF NOT EXISTS "audienceIntro" TEXT NOT NULL DEFAULT 'I build practical, dependable technology for organizations that want to improve their operations, manage information clearly, and serve people more effectively.',
ADD COLUMN IF NOT EXISTS "audienceItems" JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "audienceCtaTitle" TEXT NOT NULL DEFAULT 'Don’t see your organization listed?',
ADD COLUMN IF NOT EXISTS "audienceCtaBody" TEXT NOT NULL DEFAULT 'If you have an operational problem that technology could simplify, let’s discuss it.',
ADD COLUMN IF NOT EXISTS "audienceCtaLabel" TEXT NOT NULL DEFAULT 'Discuss your needs';
