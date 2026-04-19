-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('planted', 'growing', 'ready', 'harvested');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('active', 'atRisk', 'completed');

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "currentStage" "Stage" NOT NULL,
    "status" "FieldStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_updates" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "stage" "Stage" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_updates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_updates" ADD CONSTRAINT "field_updates_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_updates" ADD CONSTRAINT "field_updates_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
