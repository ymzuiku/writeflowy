-- CreateTable
CREATE TABLE "LikeAnalyze" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "analyzeId" INTEGER NOT NULL,

    CONSTRAINT "LikeAnalyze_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikeAnalyze_analyzeId_userId_key" ON "LikeAnalyze"("analyzeId", "userId");
