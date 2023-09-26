-- CreateTable
CREATE TABLE "Base" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "token" VARCHAR(256),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(128),
    "occupation" VARCHAR(128),
    "years_of_experience" INTEGER,
    "education" VARCHAR(128),
    "address" VARCHAR(256),
    "target_position" VARCHAR(128),
    "current_company" VARCHAR(128),
    "desired_company" VARCHAR(128),
    "skills" VARCHAR(3000),
    "personal_intro" VARCHAR(3000),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sentenceId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "times" INTEGER NOT NULL,
    "memorability" DOUBLE PRECISION NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" VARCHAR(6000) NOT NULL,
    "difficulty" DOUBLE PRECISION,
    "memorization" DOUBLE PRECISION,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentence" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "text" VARCHAR(6000) NOT NULL,
    "explain" VARCHAR(300000) NOT NULL,
    "difficulty" DOUBLE PRECISION,
    "memorization" DOUBLE PRECISION,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analyze" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(1000) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'scene',
    "image" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "star" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Analyze_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Base_created_idx" ON "Base"("created");

-- CreateIndex
CREATE INDEX "Base_updated_idx" ON "Base"("updated");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_created_idx" ON "User"("created");

-- CreateIndex
CREATE INDEX "User_updated_idx" ON "User"("updated");

-- CreateIndex
CREATE INDEX "Memory_created_idx" ON "Memory"("created");

-- CreateIndex
CREATE INDEX "Memory_updated_idx" ON "Memory"("updated");

-- CreateIndex
CREATE INDEX "Memory_memorability_idx" ON "Memory"("memorability");

-- CreateIndex
CREATE UNIQUE INDEX "Memory_text_userId_type_key" ON "Memory"("text", "userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Sentence_text_key" ON "Sentence"("text");

-- CreateIndex
CREATE INDEX "Sentence_text_idx" ON "Sentence"("text");

-- CreateIndex
CREATE INDEX "Sentence_created_idx" ON "Sentence"("created");

-- CreateIndex
CREATE INDEX "Sentence_updated_idx" ON "Sentence"("updated");

-- CreateIndex
CREATE INDEX "Analyze_title_idx" ON "Analyze"("title");

-- CreateIndex
CREATE INDEX "Analyze_question_idx" ON "Analyze"("question");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
