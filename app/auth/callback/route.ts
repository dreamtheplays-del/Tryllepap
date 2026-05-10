import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  // With implicit flow, tokens are in the URL hash (handled client-side automatically)
  // Just redirect to the confirm page which will detect the session
  return NextResponse.redirect(new URL('/auth/confirm', requestUrl.origin))
}
