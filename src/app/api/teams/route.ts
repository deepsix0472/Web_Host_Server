import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all teams
export async function GET() {
    try {
        const teams = await prisma.team.findMany({
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

// POST - Create new team
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description, sport, ownerId } = body

        if (!name) {
            return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
        }

        const team = await prisma.team.create({
            data: {
                name,
                description,
                sport,
                // If ownerId provided, add owner as first member
                ...(ownerId && {
                    members: {
                        create: {
                            userId: ownerId,
                            role: 'OWNER'
                        }
                    }
                })
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
