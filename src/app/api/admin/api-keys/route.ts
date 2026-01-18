import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'
import { createApiKey } from '@/lib/api-auth'
import { logAudit } from '@/lib/audit'

// GET - List all API keys (ADMIN only)
export async function GET() {
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
        return authResult.response
    }

    try {
        const apiKeys = await prisma.apiKey.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                permissions: true,
                lastUsedAt: true,
                usageCount: true,
                expiresAt: true,
                isActive: true,
                createdAt: true,
                // Never return the actual key
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(apiKeys)
    } catch (error) {
        console.error('Error fetching API keys:', error)
        return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
    }
}

// POST - Create new API key (ADMIN only)
export async function POST(request: Request) {
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
        return authResult.response
    }

    try {
        const body = await request.json()
        const { name, description, permissions, expiresInDays } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return NextResponse.json({ error: 'At least one permission is required' }, { status: 400 })
        }

        // Calculate expiration
        let expiresAt: Date | undefined
        if (expiresInDays) {
            expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + expiresInDays)
        }

        const { id, key } = await createApiKey({
            name,
            description,
            permissions,
            expiresAt,
            createdBy: authResult.user.id,
        })

        // Audit log
        await logAudit({
            action: 'apikey.create',
            resource: 'ApiKey',
            resourceId: id,
            details: { name, permissions },
        })

        // Return the unhashed key ONCE - it cannot be retrieved again
        return NextResponse.json({
            id,
            key, // This is the only time the key is visible
            name,
            permissions,
            expiresAt,
            message: 'Save this API key securely - it will not be shown again',
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating API key:', error)
        return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
    }
}

// DELETE - Revoke an API key (ADMIN only)
export async function DELETE(request: Request) {
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
        return authResult.response
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'API key ID required' }, { status: 400 })
        }

        const apiKey = await prisma.apiKey.update({
            where: { id },
            data: { isActive: false },
        })

        // Audit log
        await logAudit({
            action: 'apikey.revoke',
            resource: 'ApiKey',
            resourceId: id,
            details: { name: apiKey.name },
        })

        return NextResponse.json({ message: 'API key revoked successfully' })
    } catch (error) {
        console.error('Error revoking API key:', error)
        return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 })
    }
}
