'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/session'
import { sendMail } from '@/lib/mail'
import { accountCreatedMessage } from '@/lib/emails/auth'
import {
  ClientExistsError,
  createClientAccount,
  parseNewClient,
  type NewClientErrors,
} from '@/lib/admin-clients'

export type NewClientState = { errors?: NewClientErrors; error?: string } | undefined

/**
 * The team creates a client account, then the client is emailed their login
 * and password. The email is sent before answering (not with after()): if it
 * fails, the admin has to know, so they can pass the details on themselves.
 */
export async function createClientAction(_prev: NewClientState, formData: FormData): Promise<NewClientState> {
  await requireAdmin()

  const { client, errors } = parseNewClient(formData)
  if (Object.keys(errors).length > 0) return { errors }

  let created: { id: string; name: string; email: string }
  try {
    created = await createClientAccount(client)
  } catch (error) {
    if (error instanceof ClientExistsError) {
      return { errors: { email: 'Un compte existe déjà avec cette adresse.' } }
    }
    console.error('[admin] createClientAccount failed:', error)
    return { error: 'Le compte n’a pas pu être créé. Réessayez dans un instant.' }
  }

  let mailed = true
  try {
    await sendMail(accountCreatedMessage(created, client.password))
  } catch {
    mailed = false // sendMail has logged the cause.
  }

  redirect(`/admin/clients?nouveau=${created.id}${mailed ? '' : '&email=echec'}`)
}
