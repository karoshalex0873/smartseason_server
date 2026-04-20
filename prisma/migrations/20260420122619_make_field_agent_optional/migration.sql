-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_agentId_fkey";

-- AlterTable
ALTER TABLE "fields" ALTER COLUMN "agentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
