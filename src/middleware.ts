import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limit store (consider Redis for production scaling)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMITS = {
    default: { requests: 100, windowMs: 60000 }, // 100 req/min
    auth: { requests: 10, windowMs: 60000 },     // 10 req/min for auth
    api: { requests: 60, windowMs: 60000 },      // 60 req/min for API
}

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfIp = request.headers.get('cf-connecting-ip')

    if (cfIp) return cfIp
    if (realIp) return realIp
    if (forwarded) return forwarded.split(',')[0].trim()

    return 'unknown'
}

function getRateLimitConfig(pathname: string) {
    if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
        return RATE_LIMITS.auth
    }
    if (pathname.startsWith('/api/')) {
        return RATE_LIMITS.api
    }
    return RATE_LIMITS.default
}

function checkRateLimit(key: string, config: { requests: number; windowMs: number }): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now()
    const entry = rateLimitStore.get(key)

    // Clean up expired entries periodically
    if (rateLimitStore.size > 10000) {
        for (const [k, v] of rateLimitStore.entries()) {
            if (v.resetTime < now) {
                rateLimitStore.delete(k)
            }
        }
    }

    if (!entry || entry.resetTime < now) {
        // New window
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
        return { allowed: true, remaining: config.requests - 1, resetIn: config.windowMs }
    }

    if (entry.count >= config.requests) {
        // Rate limited
        return { allowed: false, remaining: 0, resetIn: entry.resetTime - now }
    }

    // Increment counter
    entry.count++
    return { allowed: true, remaining: config.requests - entry.count, resetIn: entry.resetTime - now }
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Skip rate limiting for static assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // files with extensions
    ) {
        return NextResponse.next()
    }

    const ip = getClientIp(request)
    const config = getRateLimitConfig(pathname)
    const key = `${ip}:${pathname.startsWith('/api/auth') ? 'auth' : pathname.startsWith('/api/') ? 'api' : 'default'}`

    const { allowed, remaining, resetIn } = checkRateLimit(key, config)

    if (!allowed) {
        return new NextResponse(
            JSON.stringify({
                error: 'Too many requests',
                retryAfter: Math.ceil(resetIn / 1000)
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil(resetIn / 1000)),
                    'X-RateLimit-Limit': String(config.requests),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000)),
                },
            }
        )
    }

    // Add rate limit headers to response
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', String(config.requests))
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetIn / 1000)))

    return response
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
