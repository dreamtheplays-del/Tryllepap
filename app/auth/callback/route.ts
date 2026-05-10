import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    return NextResponse.redirect(
      new URL(`/auth/confirm?code=${code}`, requestUrl.origin)
    )
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
