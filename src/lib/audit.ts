import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { headers } from 'next/headers'

type AuditAction =
    | 'swimmer.create' | 'swimmer.update' | 'swimmer.delete' | 'swimmer.view'
    | 'roster.create' | 'roster.update' | 'roster.delete'
    | 'team.create' | 'team.update' | 'team.delete'
    | 'event.create' | 'event.update' | 'event.delete'
    | 'user.create' | 'user.update' | 'user.delete' | 'user.login' | 'user.logout'
    | 'apikey.create' | 'apikey.revoke'
    | 'export.swimmers' | 'export.results' | 'import.results'

type AuditResource = 'Swimmer' | 'Roster' | 'Team' | 'Event' | 'User' | 'ApiKey' | 'Export' | 'Import'

interface AuditLogData {
    action: AuditAction
    resource: AuditResource
    resourceId?: string
    details?: Record<string, unknown>
    status?: 'success' | 'failure' | 'error'
}

/**
 * Log an audit event
 */
export async function logAudit(data: AuditLogData): Promise<void> {
    try {
        const user = await getCurrentUser()
        const headersList = await headers()

        const ipAddress = headersList.get('cf-connecting-ip') ||
            headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown'
        const userAgent = headersList.get('user-agent') || undefined

        await prisma.auditLog.create({
            data: {
                action: data.action,
                resource: data.resource,
                resourceId: data.resourceId,
                userId: user?.id,
                userEmail: user?.email,
                userRole: user?.role,
                ipAddress,
                userAgent,
                details: data.details as object | undefined,
                status: data.status || 'success',
            }
        })
    } catch (error) {
        // Don't let audit logging errors break the main flow
        console.error('Failed to create audit log:', error)
    }
}

/**
 * Log a failed action
 */
export async function logAuditFailure(
    data: Omit<AuditLogData, 'status'> & { error?: string }
): Promise<void> {
    return logAudit({
        ...data,
        status: 'failure',
        details: {
            ...data.details,
            error: data.error,
        }
    })
}

/**
 * Helper to log swimmer actions
 */
export const swimmerAudit = {
    create: (swimmerId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'swimmer.create', resource: 'Swimmer', resourceId: swimmerId, details }),

    update: (swimmerId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'swimmer.update', resource: 'Swimmer', resourceId: swimmerId, details }),

    delete: (swimmerId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'swimmer.delete', resource: 'Swimmer', resourceId: swimmerId, details }),

    view: (swimmerId: string) =>
        logAudit({ action: 'swimmer.view', resource: 'Swimmer', resourceId: swimmerId }),
}

/**
 * Helper to log roster/team actions
 */
export const rosterAudit = {
    create: (rosterId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'roster.create', resource: 'Roster', resourceId: rosterId, details }),

    update: (rosterId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'roster.update', resource: 'Roster', resourceId: rosterId, details }),

    delete: (rosterId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'roster.delete', resource: 'Roster', resourceId: rosterId, details }),
}

/**
 * Helper to log user actions
 */
export const userAudit = {
    login: (userId: string) =>
        logAudit({ action: 'user.login', resource: 'User', resourceId: userId }),

    logout: (userId: string) =>
        logAudit({ action: 'user.logout', resource: 'User', resourceId: userId }),

    create: (userId: string, details?: Record<string, unknown>) =>
        logAudit({ action: 'user.create', resource: 'User', resourceId: userId, details }),
}

/**
 * Query audit logs with filters
 */
export async function getAuditLogs(filters: {
    action?: string
    resource?: string
    userId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
}) {
    const where: Record<string, unknown> = {}

    if (filters.action) where.action = filters.action
    if (filters.resource) where.resource = filters.resource
    if (filters.userId) where.userId = filters.userId

    if (filters.startDate || filters.endDate) {
        where.createdAt = {}
        if (filters.startDate) (where.createdAt as Record<string, Date>).gte = filters.startDate
        if (filters.endDate) (where.createdAt as Record<string, Date>).lte = filters.endDate
    }

    return prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
    })
}
