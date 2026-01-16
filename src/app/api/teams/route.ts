import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

// GET teams for authenticated user
export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get teams where user is a member
        const teams = await prisma.team.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                members: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        events: true,
                        members: true
                    }
                }
            }
        })
        return NextResponse.json(teams)
    } catch (error) {
        console.error('Error fetching teams:', error)
        return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
    }
}

// POST - Create new team (requires authentication)
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, sport } = body

        if (!name) {
            return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
        }

        // Create team with authenticated user as owner
        const team = await prisma.team.create({
            data: {
                name,
                description,
                sport,
                members: {
                    create: {
                        userId: user.id,
                        role: 'OWNER'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(team, { status: 201 })
    } catch (error) {
        console.error('Error creating team:', error)
        return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
    }
}
