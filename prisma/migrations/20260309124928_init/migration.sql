-- CreateTable
CREATE TABLE "visitorIp" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "visitorIp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "totalCount" (
    "id" SERIAL NOT NULL,
    "totalVisitors" INTEGER NOT NULL,

    CONSTRAINT "totalCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitorIp_ip_key" ON "visitorIp"("ip");
