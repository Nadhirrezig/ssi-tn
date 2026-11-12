# Client tickets — architecture

> Status: Phases 0–2 implemented (Next 16; database, auth, mailer; client portal and public form). Phase 3 (admin) next.

## 1. Scope

- Clients submit **tickets** from the website and track them in their own dashboard.
- A ticket is only accepted once its author has a **verified account**.
- The SSI team uses an **admin dashboard** to read tickets, reply, and change their status.
- The client and the admin talk in a **back-and-forth thread** on each ticket.
- The client is **emailed** when the admin replies or changes the status.
- The ticket form is a **single free-text field** for now. A select field with fixed values (category) will come later, and the schema already leaves room for it.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Hosting | Vercel |
| Database | Neon Postgres (pooled URL at runtime, direct URL for migrations) |
| ORM | Prisma |
| Auth | Better Auth: email/password, email verification, password reset, `role` field |
| Email | Nodemailer → cPanel SMTP |
| Package manager | pnpm |

```
                      ┌─────────────── Vercel · Next 16 ───────────────┐
Visitor ─► /ticket (public form) ─► /inscription (sign-up + draft)      │
Client  ─► /espace-client ─────────┐                                    │
Admin   ─► /admin/tickets ─────────┤  Server Actions                    │
                                   │  (session + role + owner checks)   │
              Better Auth ◄────────┤                                    │
              /api/auth/[...all]   ├─► Prisma ─────────────────────────────► Neon Postgres
                                   └─► lib/mail.ts (Nodemailer) ──SMTP─────► cPanel mail ─► inboxes
                      └──────────────────────────────────────────────────┘
```

## 3. Flows

### New visitor

```
writes ticket on /ticket
  → /inscription (name, email, password)
  → account + ticket saved, ticket NOT submitted yet (submittedAt = null)
  → verification email
  → click link → email verified → ticket submitted (status PENDING, submittedAt = now)
  → admin notified by email
```

The draft is stored **in the database**, not in the browser, so it survives the client opening the verification link on another device.

How: the `/ticket` form sends the text as an extra `ticketMessage` field on Better Auth's sign-up request (Better Auth ignores unknown fields). The `databaseHooks.user.create.after` hook in `lib/auth.ts` saves it — it only fires for a genuinely new user, after the user row is committed, so a sign-up attempt with someone else's address can never attach a draft to their account. `emailVerification.afterEmailVerification` then submits the drafts and notifies the team.

### Existing client

- Logs in at `/connexion` and creates tickets from `/espace-client/tickets/nouveau`.
- On `/ticket`, the "Déjà client" tab logs them in inline and lands on `/espace-client/tickets/nouveau` with the text prefilled.
- The text being written is kept in `localStorage` (`lib/ticket-draft.ts`): 24 h expiry, cleared on send, on sign-out and on the post-verification welcome page.

### Thread

- Client and admin both post `TicketMessage`s on the ticket.
- Client posts → admin is emailed.
- Admin posts → client is emailed.
- No new messages on a ticket in a final state (`DONE`, `REJECTED`).

## 4. Ticket lifecycle

```
PENDING ─► CONFIRMED ─► IN_PROGRESS ─► DONE
   └──────────┴─────────────┴────────► REJECTED
```

| Code | French UI label |
|---|---|
| `PENDING` | En attente |
| `CONFIRMED` | Confirmé |
| `IN_PROGRESS` | En cours |
| `DONE` | Terminé |
| `REJECTED` | Annulé |

Rules:

- Statuses only move forward along the main line.
- `REJECTED` can be set from any open state (`PENDING`, `CONFIRMED`, `IN_PROGRESS`).
- `DONE` and `REJECTED` are final.
- Only admins change status. Every change writes a `TicketEvent` and emails the client.

## 5. Data model (Prisma)

| Model | Fields |
|---|---|
| `User` *(Better Auth)* | Better Auth fields + `role: CLIENT \| ADMIN` (default `CLIENT`) |
| `Session`, `Account`, `Verification`, `RateLimit` | Better Auth's own tables |
| `Ticket` | `id`, `number` (autoincrement, unique), `userId`, `message`, `status`, `category?` *(future select)*, `submittedAt?`, `createdAt`, `updatedAt` |
| `TicketMessage` | `id`, `ticketId`, `authorId`, `body`, `createdAt` |
| `TicketEvent` | `id`, `ticketId`, `fromStatus`, `toStatus`, `actorId`, `createdAt` |

- Public reference: `SSI-{year of createdAt}-{number padded to 4}`, e.g. `SSI-2026-0007`. URLs use this reference, never the internal id.
- The admin inbox only lists tickets with `submittedAt` set.

## 6. Routes

| Area | Route | Purpose |
|---|---|---|
| Public | `/ticket` | Ticket form for visitors |
| Public | `/inscription` | Sign-up, carries the draft ticket |
| Public | `/connexion` | Login |
| Public | `/mot-de-passe-oublie`, `/reinitialiser` | Password reset |
| Client | `/espace-client` | List of own tickets + statuses |
| Client | `/espace-client/tickets/nouveau` | New ticket |
| Client | `/espace-client/tickets/[ref]` | Thread + reply |
| Admin | `/admin/tickets` | All submitted tickets, filter by status |
| Admin | `/admin/tickets/[ref]` | Thread, reply, change status |
| API | `/api/auth/[...all]` | Better Auth handler |

Access control:

- `proxy.ts` (Next 16's replacement for `middleware.ts`) does an **optimistic** redirect when there is no session cookie on `/espace-client/**` and `/admin/**`.
- The **real** check runs on the server in every page, layout and Server Action: valid session, right role, and (for clients) ownership of the ticket. These go through `lib/session.ts` (`getSession`, `requireUser`, `requireAdmin`).
- Login, sign-up and password-reset forms call Better Auth **from the browser** (`lib/auth-client.ts` → `/api/auth/*`), not through `auth.api` in Server Actions: Better Auth only applies rate limiting and origin checks to HTTP requests.

### Client portal UI (Phase 2)

Patterns taken from established service portals (Jira Service Management, Freshdesk, Gorgias, HubSpot), in the site's own theme:

- **Mes demandes**: inbox-style rows (reference, title, status, last update, "Réponse de SSI" marker), filter tabs *Toutes · En cours · Clôturées* with counts.
- **Ticket page**: heading with reference + status, a segmented progress bar with one sentence answering "what happens now?", the conversation as a single timeline (request, replies, status changes inline), a details panel and an urgent-phone card.
- **Status badges**: one meaning, one colour, everywhere; navy text on a light tint from the existing palette (AA contrast).
- Files: `components/tickets/*`, `app/espace-client/*`, `app/ticket/page.tsx`.

## 7. Server Actions

| Action | Who | Effect |
|---|---|---|
| `createTicketAction` | Client (verified) | Creates ticket, submitted immediately → email admin |
| *(Better Auth sign-up + hooks)* | Visitor | Creates account + unsubmitted ticket → verification email; submitted on verification |
| `replyToTicketAction` | Client (owner) | Adds `TicketMessage` → email admin *(admin side in Phase 3)* |
| `changeTicketStatus` | Admin | Validates the transition, writes `TicketEvent` → email client *(Phase 3)* |

Client actions live in `app/espace-client/actions.ts`; ownership, closed-ticket and per-hour limits are enforced in `lib/tickets.ts` (10 new tickets, 40 replies per user per hour).

## 8. Emails

| Trigger | Recipient | Source |
|---|---|---|
| Sign-up verification | Client | Better Auth `sendVerificationEmail` |
| Password reset | Client | Better Auth `sendResetPassword` |
| Ticket submitted / client replied | Admin (`ADMIN_NOTIFY_EMAIL`) | Server Action |
| Admin replied | Client | Server Action |
| Status changed | Client | Server Action |

- Sent from `lib/mail.ts` (one Nodemailer transport) with French HTML templates in `lib/emails/`.
- Sent after the response with Next's `after()`, so a slow SMTP server never blocks the page. Failures are logged.
- All user text is HTML-escaped before it goes into a template.
- Prerequisites on the `ssi-tn.com` domain: **SPF, DKIM and DMARC**, otherwise mail lands in spam. Check the cPanel **hourly send limit**.

## 9. Security

- No public admin sign-up: admin accounts are created by a seed script (`prisma/seed.ts`).
- Clients can only read and reply to their own tickets, enforced in every query.
- Message length capped (5,000 characters).
- Better Auth's built-in rate limiting on auth endpoints, stored in the database (`rate_limit` table) so every Vercel instance shares one counter.
- Sign-up never reveals whether an address already has an account: the form answers the same way, and the real owner receives an "account already exists" email.
- A password reset signs the user out of every other device.
- Only one ticket per sign-up is accepted as a draft.

## 10. Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string (migrations) |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `BETTER_AUTH_URL` | Public site URL |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | cPanel SMTP |
| `MAIL_FROM` | Sender, e.g. `SSI <support@ssi-tn.com>` |
| `ADMIN_NOTIFY_EMAIL` | Where admin notifications go |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (already used for SEO), printed in email footers |

`.env.example` lists them all with where to find each value.

### Local setup

```bash
cp .env.example .env.local   # then fill in the values
pnpm install                 # also generates the Prisma client (lib/generated/, git-ignored)
pnpm db:deploy               # applies prisma/migrations to the Neon database
pnpm dev
```

Changing `prisma/schema.prisma` later: `pnpm db:migrate --name <change>` creates and applies a new migration.

On Vercel: set the variables, and run `pnpm db:deploy` against production before (or as part of) the first deploy.

## 11. Build phases

| # | Phase | Output |
|---|---|---|
| 0 | Upgrade to Next 16 + React 19, remove duplicate configs and the npm lockfile | Clean base |
| 1 | Foundation: Prisma + Neon schema, Better Auth, `lib/mail.ts`, auth pages, `/espace-client` placeholder | Sign-up / login / verification / reset working |
| 2 | Client side: `/ticket`, sign-up with draft, dashboard, thread, `proxy.ts`, team notification emails, header link | Clients submit and track tickets |
| 3 | Admin side: inbox, reply, status change | Full loop |
| 4 | Email wiring, admin seed, polish | Feature complete |

Each phase is tested by the project owner before the next one starts.
