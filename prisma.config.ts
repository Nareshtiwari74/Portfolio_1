import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Match the private local file used by Next.js while keeping supplied shell
// and hosting environment variables authoritative.
dotenv.config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
