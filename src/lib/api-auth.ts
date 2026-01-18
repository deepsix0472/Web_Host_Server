import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
    return `tp_${crypto.randomBytes(32).toString('hex')}`
}

/**
 * Hash an API key for storage
 */
export function hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Validate an API key from request headers
 */
export async function validateApiKey(request: Request): Promise<{
    valid: true
    apiKey: {
        id: string
        name: string
        permissions: string[]
    }
} | {
    valid: false
    response: NextResponse
}> {
    const authHeader = request.headers.get('x-api-key') || request.headers.get('authorization')

    if (!authHeader) {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'API key required' },
                { status: 401 }
            )
        }
    }

    // Support both X-API-Key and Bearer token formats
    const key = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader

    try {
        const hashedKey = hashApiKey(key)

        const apiKey = await prisma.apiKey.findUnique({
            where: { key: hashedKey },
            select: {
                id: true,
                name: true,
                permissions: true,
                isActive: true,
                expiresAt: true,
            }
        })

        if (!apiKey) {
            return {
                valid: false,
                response: NextResponse.json(
                    { error: 'Invalid API key' },
                    { status: 401 }
                )
            }
        }

        if (!apiKey.isActive) {
            return {
                valid: false,
                response: NextResponse.json(
                    { error: 'API key is inactive' },
                    { status: 403 }
                )
            }
        }

        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
            return {
                valid: false,
                response: NextResponse.json(
                    { error: 'API key has expired' },
                    { status: 403 }
                )
            }
        }

        // Update usage stats (fire and forget)
        prisma.apiKey.update({
            where: { id: apiKey.id },
            data: {
                lastUsedAt: new Date(),
                usageCount: { increment: 1 }
            }
        }).catch(() => { }) // Ignore errors

        return {
            valid: true,
            apiKey: {
                id: apiKey.id,
                name: apiKey.name,
                permissions: apiKey.permissions,
            }
        }
    } catch {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'Failed to validate API key' },
                { status: 500 }
            )
        }
    }
}

/**
 * Check if API key has required permission
 */
export function hasPermission(permissions: string[], required: string): boolean {
    // Check for exact match or wildcard
    return permissions.includes(required) ||
        permissions.includes('*') ||
        permissions.some(p => {
            const [resource, action] = p.split(':')
            const [reqResource, reqAction] = required.split(':')
            return (resource === reqResource && action === '*') ||
                (resource === '*' && action === reqAction)
        })
}

/**
 * Create a new API key (returns unhashed key once)
 */
export async function createApiKey(data: {
    name: string
    description?: string
    permissions: string[]
    expiresAt?: Date
    createdBy?: string
}): Promise<{ id: string; key: string }> {
    const plainKey = generateApiKey()
    const hashedKey = hashApiKey(plainKey)

    const apiKey = await prisma.apiKey.create({
        data: {
            key: hashedKey,
            name: data.name,
            description: data.description,
            permissions: data.permissions,
            expiresAt: data.expiresAt,
            createdBy: data.createdBy,
        }
    })

    return {
        id: apiKey.id,
        key: plainKey, // Return unhashed key only once
    }
}
