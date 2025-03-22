-- CreateEnum
CREATE TYPE "provider" AS ENUM ('SUPABASE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "loginProviderId" TEXT NOT NULL,
    "loginProvider" "provider" NOT NULL DEFAULT 'SUPABASE',
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail_post" (
    "id" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "picture" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "trail_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail_ranking" (
    "id" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sequential" INTEGER NOT NULL,

    CONSTRAINT "trail_ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_loginProviderId_key" ON "user"("loginProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "trail" ADD CONSTRAINT "trail_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_post" ADD CONSTRAINT "trail_post_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_post" ADD CONSTRAINT "trail_post_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_ranking" ADD CONSTRAINT "trail_ranking_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_ranking" ADD CONSTRAINT "trail_ranking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
