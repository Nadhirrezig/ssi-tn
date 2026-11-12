/**
 * Creates — or updates — an SSI team account.
 *
 *   ADMIN_NAME="Prénom Nom" ADMIN_EMAIL=admin@ssi-tn.com ADMIN_PASSWORD='…' pnpm admin:create
 *
 * The variables can also sit in .env.local, but passing them inline keeps the
 * password out of any file. Against production, set DATABASE_URL (or have it
 * in .env.local) to the production database.
 *
 * Idempotent: for an existing address the account is promoted to ADMIN,
 * marked verified, and its password replaced. The site itself never lets
 * anyone become an admin — this script is the only way in.
 */
import { config } from 'dotenv'
import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { PrismaClient } from '../lib/generated/prisma/client'
import { createDriverAdapter } from '../lib/db-adapter'

config({ path: ['.env.local', '.env'], quiet: true })

function fail(message: string): never {
  console.error(`✗ ${message}`)
  process.exit(1)
}

async function main() {
  const name = process.env.ADMIN_NAME?.trim()
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD ?? ''

  if (!name || !email) fail('ADMIN_NAME and ADMIN_EMAIL are required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(`"${email}" is not a valid email address.`)
  if (password.length < 12) fail('ADMIN_PASSWORD must be at least 12 characters for a team account.')
  if (!process.env.DATABASE_URL) fail('DATABASE_URL is not set.')

  const db = new PrismaClient({ adapter: createDriverAdapter(process.env.DATABASE_URL) })
  try {
    // Same scrypt hash Better Auth uses for sign-up and sign-in.
    const hash = await hashPassword(password)
    const existing = await db.user.findUnique({ where: { email } })

    if (existing) {
      await db.$transaction([
        db.user.update({
          where: { id: existing.id },
          data: { name, role: 'ADMIN', emailVerified: true },
        }),
        db.account.deleteMany({ where: { userId: existing.id, providerId: 'credential' } }),
        db.account.create({
          data: {
            id: randomUUID(),
            userId: existing.id,
            accountId: existing.id,
            providerId: 'credential',
            password: hash,
          },
        }),
        // A new password should not leave old sessions signed in.
        db.session.deleteMany({ where: { userId: existing.id } }),
      ])
      console.log(`✓ ${email} is now an admin (password replaced, sessions signed out).`)
    } else {
      const id = randomUUID()
      await db.user.create({
        data: {
          id,
          name,
          email,
          role: 'ADMIN',
          emailVerified: true,
          accounts: {
            create: { id: randomUUID(), accountId: id, providerId: 'credential', password: hash },
          },
        },
      })
      console.log(`✓ Admin account created for ${email}.`)
    }
  } finally {
    await db.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
