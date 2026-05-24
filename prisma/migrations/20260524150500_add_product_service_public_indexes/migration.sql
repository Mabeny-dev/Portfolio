CREATE INDEX IF NOT EXISTS "Product_status_isVisible_createdAt_idx"
ON "Product"("status", "isVisible", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "Service_status_isVisible_createdAt_idx"
ON "Service"("status", "isVisible", "createdAt" DESC);
