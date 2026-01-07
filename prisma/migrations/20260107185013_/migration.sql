/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `companys` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "companys_owner_id_key" ON "companys"("owner_id");
