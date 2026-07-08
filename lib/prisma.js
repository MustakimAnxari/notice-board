import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma Client instances in dev (hot reload) per Prisma's
// recommended Next.js pattern.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
