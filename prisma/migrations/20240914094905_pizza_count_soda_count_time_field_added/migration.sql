/*
  Warnings:

  - Added the required column `pizzaCount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sodaCount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedCompletionTime" TIMESTAMP(3),
ADD COLUMN     "pizzaCount" INTEGER NOT NULL,
ADD COLUMN     "sodaCount" INTEGER NOT NULL;
