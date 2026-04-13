import { PrismaClient } from "@prisma/client";
import logger from "../logger/winston.logger.js";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    transactionOptions: {
      timeout: 15000,
      maxWait: 6000,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  // ✅ Skip reconnection if already connected (Vercel warm instances)
  if (globalForPrisma._dbConnected) {
    logger.info("♻️ Reusing existing DB connection");
    return;
  }

  try {
    await prisma.$connect();
    logger.info("✅ Database connected (Prisma)");
  } catch (err) {
    logger.error("❌ Database connection failed:", err);
    throw err;
  }
};

export default prisma;
