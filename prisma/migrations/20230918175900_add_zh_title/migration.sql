-- AlterTable
ALTER TABLE "Analyze" ADD COLUMN     "zhTitle" VARCHAR(1000);

-- CreateIndex
CREATE INDEX "Analyze_zhTitle_idx" ON "Analyze"("zhTitle");
