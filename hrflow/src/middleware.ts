
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const protectedRoutes = ['/dashboard', '/profile', '/attendance', '/leave', '/payroll']
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) || request.nextUrl.pathname === "/"
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

    let user = null
    if (session) {
        user = await decrypt(session)
    }

    // Redirect to login if accessing protected route without session
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if accessing auth routes with session
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
