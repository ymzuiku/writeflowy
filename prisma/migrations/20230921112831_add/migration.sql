/*
  Warnings:

  - A unique constraint covering the columns `[userId,text,learn,local]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Memory_text_userId_learn_key";

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "local" TEXT NOT NULL DEFAULT 'zh';

-- CreateIndex
CREATE UNIQUE INDEX "Memory_userId_text_learn_local_key" ON "Memory"("userId", "text", "learn", "local");
