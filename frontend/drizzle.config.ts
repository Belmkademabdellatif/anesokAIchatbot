import { env } from "@anesok/env/server.mjs";
import type { Config } from "drizzle-kit";

console.log(env)
export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver:'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  }
} satisfies Config;