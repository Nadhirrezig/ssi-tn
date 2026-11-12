import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * Optimistic guard for the private areas: no session cookie, straight to the
 * login page, with the requested path kept in ?next= so the client lands
 * where they were going.
 *
 * This only checks that a cookie exists — it does not prove the session is
 * valid or that the user may see the page. That real check runs on the server
 * in every page and Server Action (lib/session.ts).
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const login = new URL('/connexion', request.url)
  login.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/espace-client/:path*', '/admin/:path*'],
}
