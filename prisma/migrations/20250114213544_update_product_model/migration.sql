/*
  Warnings:

  - Added the required column `image` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "reactions" TEXT[];
