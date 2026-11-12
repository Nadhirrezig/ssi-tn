import 'server-only'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { after } from 'next/server'
import { db } from '@/lib/db'
import { sendMail } from '@/lib/mail'
import {
  accountExistsMessage,
  resetPasswordMessage,
  verifyEmailMessage,
} from '@/lib/emails/auth'
import { notifyAdminNewTicket } from '@/lib/notifications'
import { normalizeMessage, SIGN_UP_TICKET_FIELD, validateMessage } from '@/lib/ticket-status'
import { createDraftTicket, submitDraftTickets } from '@/lib/tickets'

/**
 * Better Auth — email/password accounts for the client ticket area.
 *
 * Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
 *
 * The forms call these endpoints through the auth client (/api/auth/*) rather
 * than `auth.api` from Server Actions: Better Auth applies its rate limiting
 * and origin checks to HTTP requests only, and sign-in is what needs them most.
 */
export const auth = betterAuth({
  appName: 'SSI',
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    // No session until the address is confirmed — this is what "validates"
    // a ticket written before sign-up.
    requireEmailVerification: true,
    minPasswordLength: 8,
    // A reset is often a "someone may know my password" moment: sign out
    // every other device as well.
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail(resetPasswordMessage(user, url))
    },
    onExistingUserSignUp: async ({ user }) => {
      await sendMail(accountExistsMessage(user))
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    // An unverified client who tries to log in gets a fresh link, so a lost
    // or expired first email is never a dead end.
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail(verifyEmailMessage(user, url))
    },
    // Confirming the address is what "validates" a ticket written before
    // sign-up: its drafts are submitted and the team is told.
    afterEmailVerification: async (user) => {
      const submitted = await submitDraftTickets(user.id)
      for (const ticket of submitted) {
        after(() => notifyAdminNewTicket(ticket, user))
      }
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Runs once the new user row is committed — and only for a genuinely
        // new account: signing up with an existing address creates no user,
        // so no draft can be attached to someone else's account.
        after: async (user, ctx) => {
          if (ctx?.path !== '/sign-up/email') return
          const raw: unknown = ctx.body?.[SIGN_UP_TICKET_FIELD]
          if (typeof raw !== 'string') return

          const message = normalizeMessage(raw)
          if (validateMessage(message)) return // the form validates first; ignore junk

          try {
            await createDraftTicket(user.id, message)
          } catch (error) {
            // The account itself is fine; only the draft is lost. Log it.
            console.error(`[tickets] could not save the sign-up draft for user ${user.id}:`, error)
          }
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ['CLIENT', 'ADMIN'],
        required: false,
        defaultValue: 'CLIENT',
        // Never settable from sign-up or profile updates; admins are created
        // by the seed script.
        input: false,
      },
    },
  },

  rateLimit: {
    // In memory, each Vercel instance would keep its own count; the database
    // gives one shared counter. (Enabled in production only, by default.)
    storage: 'database',
  },

  advanced: {
    // Emails are sent after the response: the form answers immediately, and a
    // slow SMTP server cannot be timed to tell real accounts from unknown ones.
    backgroundTasks: { handler: (task) => after(task) },
  },

  // Must stay last: lets auth calls made during a Server Action set cookies.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
