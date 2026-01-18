'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../dashboard.module.css";
import rosterStyles from "../roster.module.css";

interface Roster {
    id: string;
    name: string;
    description: string | null;
    sport: string | null;
    _count: { swimmers: number };
}

export default function RosterGroupsPage() {
    const [rosters, setRosters] = useState<Roster[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRosters();
    }, []);

    async function fetchRosters() {
        try {
            const res = await fetch('/api/rosters');
            const data = await res.json();
            setRosters(data);
        } catch {
            setRosters([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/rosters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create roster');
            }

            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchRosters();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.dashboardContent}>
            <div className={rosterStyles.header}>
                <div>
                    <h1 className={rosterStyles.title}>Manage Rosters</h1>
                    <p className={rosterStyles.subtitle}>
                        Create and manage roster groups for your swimmers
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Roster
                </button>
            </div>

            {isLoading ? (
                <div className={rosterStyles.emptyState}>Loading...</div>
            ) : rosters.length === 0 ? (
                <div className={rosterStyles.tableContainer}>
                    <div className={rosterStyles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        <h3>No rosters yet</h3>
                        <p>Create your first roster to organize swimmers</p>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary">
                            Create Roster
                        </button>
                    </div>
                </div>
            ) : (
                <div className={rosterStyles.stats}>
                    {rosters.map((roster) => (
                        <Link
                            key={roster.id}
                            href={`/dashboard/roster?group=${roster.id}`}
                            className={rosterStyles.statCard}
                            style={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                            <div className={rosterStyles.statValue}>{roster._count?.swimmers || 0}</div>
                            <div className={rosterStyles.statLabel}>{roster.name}</div>
                            {roster.description && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    {roster.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Roster</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {error && <div className={rosterStyles.errorMessage || 'error'}>{error}</div>}
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Roster Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., 10 & Under, Senior Group"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    className="form-input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description for this roster"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Roster'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
