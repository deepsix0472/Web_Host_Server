/*
  Warnings:

  - The values [GAME] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "SwimmerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('PRACTICE', 'MEET', 'MEETING', 'OTHER');
ALTER TABLE "public"."Event" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
ALTER TABLE "Event" ALTER COLUMN "type" SET DEFAULT 'PRACTICE';
COMMIT;

-- CreateTable
CREATE TABLE "Swimmer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "medicalNotes" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "teamId" TEXT NOT NULL,
    "parentId" TEXT,
    "status" "SwimmerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Swimmer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Swimmer" ADD CONSTRAINT "Swimmer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swimmer" ADD CONSTRAINT "Swimmer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
