/*
  Warnings:

  - You are about to drop the `Refferal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Refferal";

-- CreateTable
CREATE TABLE "refferal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "refferCode" TEXT NOT NULL,
    "refferName" TEXT NOT NULL,

    CONSTRAINT "refferal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refferal_email_key" ON "refferal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refferal_phone_key" ON "refferal"("phone");
