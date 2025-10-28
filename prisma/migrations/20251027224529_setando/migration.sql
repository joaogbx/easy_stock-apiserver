-- DropForeignKey
ALTER TABLE "public"."companyes" DROP CONSTRAINT "companyes_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_companye_id_fkey";

-- AlterTable
ALTER TABLE "companyes" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "companye_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companye_id_fkey" FOREIGN KEY ("companye_id") REFERENCES "companyes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyes" ADD CONSTRAINT "companyes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
