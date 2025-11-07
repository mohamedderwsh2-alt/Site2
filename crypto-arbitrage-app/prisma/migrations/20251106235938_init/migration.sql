-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "walletBalance" DECIMAL NOT NULL DEFAULT 0,
    "botPrincipal" DECIMAL NOT NULL DEFAULT 0,
    "totalDeposited" DECIMAL NOT NULL DEFAULT 0,
    "totalWithdrawn" DECIMAL NOT NULL DEFAULT 0,
    "totalEarnings" DECIMAL NOT NULL DEFAULT 0,
    "totalReferralEarnings" DECIMAL NOT NULL DEFAULT 0,
    "botActive" BOOLEAN NOT NULL DEFAULT false,
    "botPurchasedAt" DATETIME,
    "lastProfitDistribution" DATETIME,
    "telegramHandle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL NOT NULL,
    "txHash" TEXT,
    "targetAddress" TEXT,
    "processedBy" TEXT,
    "processedAt" DATETIME,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BotPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "activatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "deactivatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BotPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BotTrade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profitAmount" DECIMAL NOT NULL,
    "tradeWindowStart" DATETIME NOT NULL,
    "tradeWindowEnd" DATETIME NOT NULL,
    "baseBalance" DECIMAL NOT NULL,
    "executionLatency" INTEGER,
    "strategySnapshot" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BotTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "sourceTransactionId" TEXT,
    "sourceTradeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralReward_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralReward_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralReward_sourceTransactionId_fkey" FOREIGN KEY ("sourceTransactionId") REFERENCES "WalletTransaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ReferralReward_sourceTradeId_fkey" FOREIGN KEY ("sourceTradeId") REFERENCES "BotTrade" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
