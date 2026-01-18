import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

// GET all rosters (teams)
export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const rosters = await prisma.team.findMany({
            include: {
                _count: {
                    select: { members: true, swimmers: true }
                }
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(rosters)
    } catch (error) {
        console.error('Error fetching rosters:', error)
        return NextResponse.json({ error: 'Failed to fetch rosters' }, { status: 500 })
    }
}

// POST - Create new roster
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description } = body

        if (!name) {
            return NextResponse.json({ error: 'Roster name is required' }, { status: 400 })
        }

        const roster = await prisma.team.create({
            data: {
                name,
                description,
                sport: 'Swimming',
            }
        })

        return NextResponse.json(roster, { status: 201 })
    } catch (error) {
        console.error('Error creating roster:', error)
        return NextResponse.json({ error: 'Failed to create roster' }, { status: 500 })
    }
}
