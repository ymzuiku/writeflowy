/*
  Warnings:

  - You are about to drop the column `title` on the `Analyze` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Sentence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[text,userId,learn]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text,learn,local]` on the table `Sentence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enTitle` to the `Analyze` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Analyze_title_idx";

-- DropIndex
DROP INDEX "Analyze_zhTitle_idx";

-- DropIndex
DROP INDEX "Memory_text_userId_type_key";

-- DropIndex
DROP INDEX "Sentence_text_idx";

-- DropIndex
DROP INDEX "Sentence_text_key";

-- AlterTable
ALTER TABLE "Analyze" DROP COLUMN "title",
ADD COLUMN     "enTitle" VARCHAR(1000) NOT NULL,
ADD COLUMN     "esTitle" VARCHAR(1000),
ADD COLUMN     "frTitle" VARCHAR(1000),
ADD COLUMN     "jpTitle" VARCHAR(1000),
ADD COLUMN     "learn" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "type",
ADD COLUMN     "learn" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Sentence" DROP COLUMN "type",
ADD COLUMN     "learn" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "local" TEXT NOT NULL DEFAULT 'zh';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "local" TEXT NOT NULL DEFAULT 'zh',
ALTER COLUMN "learn" SET DEFAULT 'en';

-- CreateIndex
CREATE INDEX "Analyze_enTitle_idx" ON "Analyze"("enTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Memory_text_userId_learn_key" ON "Memory"("text", "userId", "learn");

-- CreateIndex
CREATE UNIQUE INDEX "Sentence_text_learn_local_key" ON "Sentence"("text", "learn", "local");
