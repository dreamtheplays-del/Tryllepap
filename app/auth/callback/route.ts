import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // With implicit flow, tokens are in the URL hash (#access_token=...)
  // The hash is not sent to the server, so redirect to client page to handle it
  return NextResponse.redirect(new URL('/auth/confirm', request.url.split('?')[0]))
}
