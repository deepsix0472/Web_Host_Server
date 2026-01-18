import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

// GET swimmers for authenticated user's team
export async function GET(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const teamId = searchParams.get('teamId')
        const status = searchParams.get('status')
        const ageGroup = searchParams.get('ageGroup')
        const search = searchParams.get('search')

        // Build where clause
        const where: Record<string, unknown> = {}

        if (teamId) {
            where.teamId = teamId
        }

        if (status) {
            where.status = status
        }

        if (ageGroup) {
            where.ageGroup = ageGroup
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }

        const swimmers = await prisma.swimmer.findMany({
            where,
            include: {
                team: {
                    select: { id: true, name: true }
                },
                parent: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: [
                { lastName: 'asc' },
                { firstName: 'asc' }
            ]
        })

        return NextResponse.json(swimmers)
    } catch (error) {
        console.error('Error fetching swimmers:', error)
        return NextResponse.json({ error: 'Failed to fetch swimmers' }, { status: 500 })
    }
}

// POST - Create new swimmer
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            ageGroup,
            medicalNotes,
            emergencyContact,
            emergencyPhone,
            teamId,
            parentId
        } = body

        if (!firstName || !lastName || !birthDate || !ageGroup || !teamId) {
            return NextResponse.json(
                { error: 'Missing required fields: firstName, lastName, birthDate, ageGroup, teamId' },
                { status: 400 }
            )
        }

        const swimmer = await prisma.swimmer.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                birthDate: new Date(birthDate),
                ageGroup,
                medicalNotes,
                emergencyContact,
                emergencyPhone,
                teamId,
                parentId,
            },
            include: {
                team: {
                    select: { id: true, name: true }
                },
                parent: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json(swimmer, { status: 201 })
    } catch (error) {
        console.error('Error creating swimmer:', error)
        return NextResponse.json({ error: 'Failed to create swimmer' }, { status: 500 })
    }
}
