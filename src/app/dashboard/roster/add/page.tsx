'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../dashboard.module.css";
import formStyles from "./add.module.css";

interface Team {
    id: string;
    name: string;
}

export default function AddSwimmerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        // Fetch rosters for the dropdown
        fetch('/api/rosters')
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setTeams(data) : setTeams([]))
            .catch(() => setTeams([]));
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/swimmers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email') || null,
                    phone: formData.get('phone') || null,
                    birthDate: formData.get('birthDate'),
                    ageGroup: formData.get('ageGroup'),
                    medicalNotes: formData.get('medicalNotes') || null,
                    emergencyContact: formData.get('emergencyContact') || null,
                    emergencyPhone: formData.get('emergencyPhone') || null,
                    teamId: formData.get('teamId'),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add swimmer');
            }

            router.push('/dashboard/roster');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.dashboardContent}>
            <div className={formStyles.header}>
                <Link href="/dashboard/roster" className={formStyles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Roster
                </Link>
                <h1 className={formStyles.title}>Add New Swimmer</h1>
            </div>

            {error && (
                <div className={formStyles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className={formStyles.form}>
                <div className={formStyles.section}>
                    <h2 className={formStyles.sectionTitle}>Basic Information</h2>

                    <div className={formStyles.row}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="form-input"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="form-input"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className={formStyles.row}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="birthDate">Birth Date *</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                className="form-input"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="ageGroup">Age Group *</label>
                            <select
                                id="ageGroup"
                                name="ageGroup"
                                className="form-input"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select Age Group</option>
                                <option value="6 & Under">6 & Under</option>
                                <option value="7-8">7-8</option>
                                <option value="9-10">9-10</option>
                                <option value="11-12">11-12</option>
                                <option value="13-14">13-14</option>
                                <option value="15-18">15-18</option>
                                <option value="Senior">Senior</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="teamId">Roster *</label>
                        <select
                            id="teamId"
                            name="teamId"
                            className="form-input"
                            required
                            disabled={isLoading || teams.length === 0}
                        >
                            <option value="">Select Roster</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={formStyles.section}>
                    <h2 className={formStyles.sectionTitle}>Contact Information</h2>

                    <div className={formStyles.row}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className={formStyles.section}>
                    <h2 className={formStyles.sectionTitle}>Emergency Contact</h2>

                    <div className={formStyles.row}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="emergencyContact">Contact Name</label>
                            <input
                                type="text"
                                id="emergencyContact"
                                name="emergencyContact"
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="emergencyPhone">Contact Phone</label>
                            <input
                                type="tel"
                                id="emergencyPhone"
                                name="emergencyPhone"
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className={formStyles.section}>
                    <h2 className={formStyles.sectionTitle}>Additional Information</h2>

                    <div className="form-group">
                        <label className="form-label" htmlFor="medicalNotes">Medical Notes</label>
                        <textarea
                            id="medicalNotes"
                            name="medicalNotes"
                            className="form-input"
                            rows={3}
                            placeholder="Any allergies, conditions, or medications..."
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className={formStyles.actions}>
                    <Link href="/dashboard/roster" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Swimmer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
