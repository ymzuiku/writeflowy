/*
  Warnings:

  - You are about to alter the column `address` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3000)`.
  - Added the required column `subscribId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "subscribId" TEXT NOT NULL,
ALTER COLUMN "address" SET DATA TYPE VARCHAR(3000);
