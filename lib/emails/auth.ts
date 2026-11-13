import 'server-only'

import type { MailMessage } from '@/lib/mail'
import { renderEmail } from '@/lib/emails/layout'
import { SITE_URL } from '@/lib/site'

type Recipient = { name: string; email: string }

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name

/** Sent on sign-up, and again when an unverified client tries to log in. */
export function verifyEmailMessage(user: Recipient, url: string): MailMessage {
  return {
    to: user.email,
    subject: 'Bienvenue chez SSI — confirmez votre adresse',
    ...renderEmail({
      preheader: 'Votre espace client est prêt : un clic pour l’activer.',
      tone: 'success',
      heading: 'Bienvenue chez SSI !',
      greeting: `Bonjour ${firstName(user.name)},`,
      paragraphs: [
        'Votre espace client est prêt. Il ne reste qu’une étape : confirmer votre adresse e-mail.',
        'Vous pourrez ensuite suivre chacune de vos demandes et échanger avec notre équipe. Si vous avez déjà rédigé une demande, elle lui sera transmise dès la confirmation.',
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
      tone: 'security',
      heading: 'Choisissez un nouveau mot de passe',
      greeting: `Bonjour ${firstName(user.name)},`,
      paragraphs: [
        'Nous avons reçu une demande de réinitialisation du mot de passe de votre espace client SSI.',
        'Par sécurité, vos autres appareils seront déconnectés une fois le nouveau mot de passe enregistré.',
      ],
      action: { label: 'Choisir un mot de passe', url },
      footnote:
        'Ce lien est valable 1 heure. Si vous n’avez rien demandé, ignorez ce message : votre mot de passe reste inchangé.',
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
      tone: 'info',
      heading: 'Vous avez déjà un espace client',
      greeting: `Bonjour ${firstName(user.name)},`,
      paragraphs: [
        'Quelqu’un — sans doute vous — vient d’essayer de créer un espace client SSI avec cette adresse. Bonne nouvelle : il existe déjà. Connectez-vous simplement pour retrouver vos demandes.',
      ],
      action: { label: 'Me connecter', url: `${SITE_URL}/connexion` },
      footnote:
        'Mot de passe oublié ? Utilisez « Mot de passe oublié » sur la page de connexion. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.',
    }),
  }
}
