import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Next.js loads .env.local on its own; the Prisma CLI does not. Mirror Next's
// precedence so `prisma migrate` talks to the same database the app uses.
config({ path: ['.env.local', '.env'], quiet: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Migrations need a direct (unpooled) Neon connection: PgBouncer in
    // transaction mode cannot hold the advisory lock `migrate` takes. Read with
    // process.env rather than env() so `prisma generate` — which runs on every
    // install, including CI without database access — does not require it.
    url: process.env.DIRECT_URL,
  },
})
