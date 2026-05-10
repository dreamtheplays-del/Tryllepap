import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  // Pass code to confirm page — the browser client will exchange it
  // using the PKCE verifier it stored in localStorage during OAuth initiation
  return NextResponse.redirect(
    new URL(`/auth/confirm?code=${code}`, requestUrl.origin)
  )
}
