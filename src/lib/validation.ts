import { z } from 'zod'

// ============ SWIMMER SCHEMAS ============
export const swimmerCreateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    birthDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    ageGroup: z.string().min(1, 'Age group is required'),
    medicalNotes: z.string().max(2000).optional().nullable(),
    emergencyContact: z.string().max(100).optional().nullable(),
    emergencyPhone: z.string().max(20).optional().nullable(),
    teamId: z.string().min(1, 'Team/Roster is required'),
    parentId: z.string().optional().nullable(),
})

export const swimmerUpdateSchema = swimmerCreateSchema.partial()

// ============ ROSTER SCHEMAS ============
export const rosterCreateSchema = z.object({
    name: z.string().min(1, 'Roster name is required').max(100),
    description: z.string().max(500).optional().nullable(),
    sport: z.string().default('Swimming'),
})

export const rosterUpdateSchema = rosterCreateSchema.partial()

// ============ USER SCHEMAS ============
export const userCreateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1).max(100).optional(),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
})

// ============ EVENT SCHEMAS ============
export const eventCreateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(2000).optional().nullable(),
    date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    endDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    type: z.enum(['PRACTICE', 'MEET', 'MEETING', 'OTHER']).default('PRACTICE'),
    teamId: z.string().min(1, 'Team is required'),
})

// ============ VALIDATION HELPER ============
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true; data: T
} | {
    success: false; errors: { field: string; message: string }[]
} {
    const result = schema.safeParse(data)

    if (result.success) {
        return { success: true, data: result.data }
    }

    const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }))

    return { success: false, errors }
}

// ============ SANITIZATION ============
export function sanitizeString(str: string): string {
    return str
        .trim()
        .replaceAll(/[<>]/g, '') // Remove HTML tags
        .slice(0, 10000) // Limit length
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj }

    for (const key in sanitized) {
        const value = sanitized[key]
        if (typeof value === 'string') {
            (sanitized as Record<string, unknown>)[key] = sanitizeString(value)
        }
    }

    return sanitized
}
