/*
  Warnings:

  - You are about to drop the column `companye_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `companye_id` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `companye_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `companyes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."companyes" DROP CONSTRAINT "companyes_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_companye_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_movements" DROP CONSTRAINT "stock_movements_companye_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_companye_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "companye_id",
ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "companye_id",
ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "companye_id",
ADD COLUMN     "company_id" INTEGER;

-- DropTable
DROP TABLE "public"."companyes";

-- CreateTable
CREATE TABLE "companys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "owner_id" INTEGER,

    CONSTRAINT "companys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companys_owner_id_key" ON "companys"("owner_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companys" ADD CONSTRAINT "companys_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
