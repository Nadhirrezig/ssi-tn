import 'server-only'

import type { MailMessage } from '@/lib/mail'
import { renderEmail } from '@/lib/emails/layout'
import { SITE_URL } from '@/lib/site'

type Recipient = { name: string; email: string }

/** Sent on sign-up, and again when an unverified client tries to log in. */
export function verifyEmailMessage(user: Recipient, url: string): MailMessage {
  return {
    to: user.email,
    subject: 'Confirmez votre adresse e-mail — SSI',
    ...renderEmail({
      preheader: 'Un clic pour activer votre espace client SSI.',
      heading: `Bonjour ${user.name},`,
      paragraphs: [
        'Merci d’avoir créé votre espace client SSI. Confirmez votre adresse e-mail pour l’activer. Si vous avez rédigé un ticket, il nous sera transmis dès cette confirmation.',
      ],
      action: { label: 'Confirmer mon adresse', url },
      footnote:
        'Ce lien est valable 24 heures. Si vous n’êtes pas à l’origine de cette inscription, ignorez simplement ce message.',
    }),
  }
}

export function resetPasswordMessage(user: Recipient, url: string): MailMessage {
  return {
    to: user.email,
    subject: 'Réinitialisation de votre mot de passe — SSI',
    ...renderEmail({
      preheader: 'Choisissez un nouveau mot de passe pour votre espace client.',
      heading: `Bonjour ${user.name},`,
      paragraphs: [
        'Nous avons reçu une demande de réinitialisation du mot de passe de votre espace client SSI.',
      ],
      action: { label: 'Choisir un nouveau mot de passe', url },
      footnote:
        'Ce lien est valable 1 heure. Si vous n’avez rien demandé, ignorez ce message : votre mot de passe reste inchangé.',
    }),
  }
}

/**
 * Sent when someone signs up with an address that already has an account.
 * The sign-up form itself answers as if it succeeded (so it cannot be used to
 * find out who is a client); the real owner learns about it here instead.
 */
export function accountExistsMessage(user: Recipient): MailMessage {
  return {
    to: user.email,
    subject: 'Vous avez déjà un espace client SSI',
    ...renderEmail({
      preheader: 'Une inscription a été tentée avec votre adresse e-mail.',
      heading: `Bonjour ${user.name},`,
      paragraphs: [
        'Quelqu’un — sans doute vous — vient d’essayer de créer un espace client SSI avec cette adresse e-mail. Un compte existe déjà : connectez-vous simplement.',
      ],
      action: { label: 'Me connecter', url: `${SITE_URL}/connexion` },
      footnote:
        'Mot de passe oublié ? Utilisez « Mot de passe oublié » sur la page de connexion. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.',
    }),
  }
}
