import { defineConfig } from "prisma/config"
import { config } from "dotenv"
import path from "node:path"

// Prisma CLI does not auto-load .env files — load explicitly so that
// db:migrate, db:push and db:seed work without manual env var setup.
config({ path: path.resolve(process.cwd(), ".env") })
config({ path: path.resolve(process.cwd(), ".env.local"), override: true })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
})
