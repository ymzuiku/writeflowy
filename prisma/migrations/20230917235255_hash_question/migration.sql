-- DropIndex
DROP INDEX "Analyze_question_idx";

-- AlterTable
ALTER TABLE "Analyze" ADD COLUMN     "hashQuestion" TEXT;

-- CreateIndex
CREATE INDEX "Analyze_hashQuestion_idx" ON "Analyze"("hashQuestion");
