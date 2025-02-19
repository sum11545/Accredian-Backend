-- CreateTable
CREATE TABLE "Refferal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "refferCode" INTEGER NOT NULL,
    "refferName" TEXT NOT NULL,

    CONSTRAINT "Refferal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Refferal_email_key" ON "Refferal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Refferal_phone_key" ON "Refferal"("phone");
