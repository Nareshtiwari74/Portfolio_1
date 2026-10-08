/*
  Warnings:

  - Added the required column `LastUpdate` to the `totalCount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `visitorIp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "totalCount" ADD COLUMN     "LastUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "visitorIp" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
