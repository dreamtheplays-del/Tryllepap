import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Pass code to client-side confirm page to exchange for session
    return NextResponse.redirect(
      new URL(`/auth/confirm?code=${code}`, requestUrl.origin)
    )
  }

  // No code means something went wrong
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
