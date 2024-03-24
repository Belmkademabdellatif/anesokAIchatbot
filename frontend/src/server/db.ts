import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@anesok/schema"

const connectionString = process.env.DATABASE_URL!
console.log(connectionString)
const sql = postgres(connectionString, { max: 1 })
export const db = drizzle(sql,{schema});


// import { PrismaClient } from "@prisma/client";

// import { env } from "../env/server.mjs";

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log:
//       env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
