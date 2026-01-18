import { requireAuthRedirect } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../dashboard.module.css";
import rosterStyles from "./roster.module.css";

export default async function RosterPage() {
    await requireAuthRedirect();

    // Fetch swimmers from the first team (for now)
    const swimmers = await prisma.swimmer.findMany({
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
            team: { select: { name: true } }
        }
    });

    // Group swimmers by age group
    const swimmersByAgeGroup = swimmers.reduce((acc, swimmer) => {
        if (!acc[swimmer.ageGroup]) {
            acc[swimmer.ageGroup] = [];
        }
        acc[swimmer.ageGroup].push(swimmer);
        return acc;
    }, {} as Record<string, typeof swimmers>);

    const ageGroups = Object.keys(swimmersByAgeGroup).sort();

    return (
        <div className={styles.dashboardContent}>
            {/* Header */}
            <div className={rosterStyles.header}>
                <div>
                    <h1 className={rosterStyles.title}>Roster Management</h1>
                    <p className={rosterStyles.subtitle}>
                        {swimmers.length} swimmers registered
                    </p>
                </div>
                <Link href="/dashboard/roster/add" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Swimmer
                </Link>
            </div>

            {/* Stats */}
            <div className={rosterStyles.stats}>
                <div className={rosterStyles.statCard}>
                    <div className={rosterStyles.statValue}>{swimmers.length}</div>
                    <div className={rosterStyles.statLabel}>Total Swimmers</div>
                </div>
                <div className={rosterStyles.statCard}>
                    <div className={rosterStyles.statValue}>
                        {swimmers.filter(s => s.status === 'ACTIVE').length}
                    </div>
                    <div className={rosterStyles.statLabel}>Active</div>
                </div>
                <div className={rosterStyles.statCard}>
                    <div className={rosterStyles.statValue}>{ageGroups.length}</div>
                    <div className={rosterStyles.statLabel}>Age Groups</div>
                </div>
            </div>

            {/* Roster Table */}
            <div className={rosterStyles.tableContainer}>
                {swimmers.length === 0 ? (
                    <div className={rosterStyles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <h3>No swimmers yet</h3>
                        <p>Add your first swimmer to get started</p>
                        <Link href="/dashboard/roster/add" className="btn btn-primary">
                            Add Swimmer
                        </Link>
                    </div>
                ) : (
                    <table className={rosterStyles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age Group</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {swimmers.map((swimmer) => (
                                <tr key={swimmer.id}>
                                    <td>
                                        <div className={rosterStyles.swimmerName}>
                                            <div className={rosterStyles.avatar}>
                                                {swimmer.firstName[0]}{swimmer.lastName[0]}
                                            </div>
                                            <div>
                                                <div className={rosterStyles.name}>
                                                    {swimmer.firstName} {swimmer.lastName}
                                                </div>
                                                <div className={rosterStyles.team}>
                                                    {swimmer.team?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={rosterStyles.ageGroupBadge}>
                                            {swimmer.ageGroup}
                                        </span>
                                    </td>
                                    <td>{swimmer.email || '—'}</td>
                                    <td>{swimmer.phone || '—'}</td>
                                    <td>
                                        <span className={`${rosterStyles.status} ${rosterStyles[`status${swimmer.status}`]}`}>
                                            {swimmer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={rosterStyles.actions}>
                                            <Link
                                                href={`/dashboard/roster/${swimmer.id}`}
                                                className={rosterStyles.actionBtn}
                                                title="View Details"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={`/dashboard/roster/${swimmer.id}/edit`}
                                                className={rosterStyles.actionBtn}
                                                title="Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
