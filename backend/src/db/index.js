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
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected (Prisma)");
  } catch (err) {
    logger.error("❌ Database connection failed:", err);
    throw err;
  }
};

export default prisma;
