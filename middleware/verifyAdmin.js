// middleware.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAuth } from './lib/auth'

export async function middleware(request) {
    if (
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/api/admin')
    ) {
        const token = request.cookies.get('admin-token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const verified = await verifyAuth(token)
            if (!verified) {
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}
