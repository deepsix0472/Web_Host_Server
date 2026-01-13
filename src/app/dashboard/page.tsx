'use client';

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <div className="nav-logo-icon">TP</div>
            <span>TeamPlatform</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            <ul className="sidebar-menu">
              <li>
                <Link href="/dashboard" className="sidebar-link active">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/website" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Team Website
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Manage</div>
            <ul className="sidebar-menu">
              <li>
                <Link href="/dashboard/events" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Events
                  <span className="sidebar-badge">3</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/roster" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Roster
                </Link>
              </li>
              <li>
                <Link href="/dashboard/results" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Results & Times
                </Link>
              </li>
              <li>
                <Link href="/dashboard/registration" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  Registration
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Communication</div>
            <ul className="sidebar-menu">
              <li>
                <Link href="/dashboard/announcements" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                  </svg>
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/dashboard/messages" className="sidebar-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Messages
                  <span className="sidebar-badge accent">5</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link href="/dashboard/settings" className="sidebar-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's what's happening with your team.</p>
          </div>
          <div className="topbar-right">
            <button className="btn btn-ghost icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="user-menu">
              <div className="user-avatar">JD</div>
              <div className="user-info">
                <div className="user-name">John Doe</div>
                <div className="user-role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard
              title="Total Athletes"
              value="124"
              change="+12%"
              changeType="positive"
              icon="👥"
            />
            <StatCard
              title="Active Registrations"
              value="87"
              change="+23%"
              changeType="positive"
              icon="📝"
            />
            <StatCard
              title="Upcoming Events"
              value="8"
              change="3 this week"
              changeType="neutral"
              icon="📅"
            />
            <StatCard
              title="New Times This Month"
              value="156"
              change="+8%"
              changeType="positive"
              icon="⏱️"
            />
          </div>

          {/* Main Grid */}
          <div className="content-grid">
            {/* Upcoming Events */}
            <div className="card">
              <div className="card-header">
                <h3>Upcoming Events</h3>
                <Link href="/dashboard/events" className="card-action">View all</Link>
              </div>
              <div className="event-list">
                <EventItem
                  title="Winter Championship Meet"
                  date="Jan 20, 2026"
                  location="Aquatic Center"
                  type="meet"
                />
                <EventItem
                  title="Team Practice"
                  date="Jan 14, 2026"
                  location="Main Pool"
                  type="practice"
                />
                <EventItem
                  title="Parent Meeting"
                  date="Jan 15, 2026"
                  location="Conference Room"
                  type="meeting"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <Link href="/dashboard/activity" className="card-action">View all</Link>
              </div>
              <div className="activity-list">
                <ActivityItem
                  icon="🏊"
                  title="New PR: Emma Wilson"
                  description="100m Freestyle - 58.34"
                  time="10 min ago"
                />
                <ActivityItem
                  icon="📝"
                  title="New Registration"
                  description="Michael Chen joined the team"
                  time="1 hour ago"
                />
                <ActivityItem
                  icon="💳"
                  title="Payment Received"
                  description="Spring Season Registration - $250"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon="📅"
                  title="Event Updated"
                  description="Winter Championship details changed"
                  time="3 hours ago"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <Link href="/dashboard/events/new" className="quick-action-card">
                <div className="quick-action-icon">📅</div>
                <span>Create Event</span>
              </Link>
              <Link href="/dashboard/roster/add" className="quick-action-card">
                <div className="quick-action-icon">👤</div>
                <span>Add Athlete</span>
              </Link>
              <Link href="/dashboard/announcements/new" className="quick-action-card">
                <div className="quick-action-icon">📢</div>
                <span>Send Announcement</span>
              </Link>
              <Link href="/dashboard/results/import" className="quick-action-card">
                <div className="quick-action-icon">⬆️</div>
                <span>Import Results</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: var(--z-sticky);
        }

        .sidebar-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4) 0;
        }

        .sidebar-section {
          padding: 0 var(--space-4);
          margin-bottom: var(--space-6);
        }

        .sidebar-section-title {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          padding: var(--space-2) var(--space-3);
        }

        .sidebar-menu {
          list-style: none;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .sidebar-link.active {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .sidebar-badge {
          margin-left: auto;
          background: var(--neutral-200);
          color: var(--text-secondary);
          font-size: var(--text-xs);
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .sidebar-badge.accent {
          background: var(--accent-500);
          color: white;
        }

        .sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid var(--border-light);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 260px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-6) var(--space-8);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .page-title {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          padding: 0;
          border-radius: var(--radius-lg);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .user-menu:hover {
          background: var(--bg-secondary);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .user-name {
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .user-role {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        /* Dashboard Content */
        .dashboard-content {
          padding: var(--space-8);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          padding: var(--space-6);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-5);
        }

        .card-header h3 {
          font-size: var(--text-lg);
          font-weight: 600;
        }

        .card-action {
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 500;
        }

        .event-list, .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Quick Actions */
        .quick-actions h3 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }

        .quick-action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          transition: all var(--transition-base);
          font-weight: 500;
          color: var(--text-primary);
        }

        .quick-action-card:hover {
          border-color: var(--primary-200);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .quick-action-icon {
          font-size: var(--text-3xl);
        }

        @media (max-width: 1280px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .stats-grid,
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className={`stat-card-change ${changeType}`}>{change}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-title">{title}</div>

      <style jsx>{`
        .stat-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          padding: var(--space-5);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .stat-card-icon {
          font-size: var(--text-2xl);
        }

        .stat-card-change {
          font-size: var(--text-xs);
          font-weight: 500;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .stat-card-change.positive {
          background: var(--success-50);
          color: var(--success-600);
        }

        .stat-card-change.negative {
          background: var(--error-50);
          color: var(--error-600);
        }

        .stat-card-change.neutral {
          background: var(--neutral-100);
          color: var(--text-secondary);
        }

        .stat-card-value {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .stat-card-title {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

// Event Item Component
function EventItem({
  title,
  date,
  location,
  type
}: {
  title: string;
  date: string;
  location: string;
  type: 'meet' | 'practice' | 'meeting';
}) {
  const typeColors = {
    meet: { bg: 'var(--primary-50)', color: 'var(--primary-600)' },
    practice: { bg: 'var(--success-50)', color: 'var(--success-600)' },
    meeting: { bg: 'var(--accent-50)', color: 'var(--accent-600)' }
  };

  return (
    <div className="event-item">
      <div className="event-type-badge" style={{ background: typeColors[type].bg, color: typeColors[type].color }}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div className="event-details">
        <div className="event-title">{title}</div>
        <div className="event-meta">
          <span>{date}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </div>

      <style jsx>{`
        .event-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          transition: background var(--transition-fast);
        }

        .event-item:hover {
          background: var(--bg-secondary);
        }

        .event-type-badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          white-space: nowrap;
        }

        .event-title {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  icon,
  title,
  description,
  time
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="activity-item">
      <div className="activity-icon">{icon}</div>
      <div className="activity-content">
        <div className="activity-title">{title}</div>
        <div className="activity-description">{description}</div>
      </div>
      <div className="activity-time">{time}</div>

      <style jsx>{`
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          transition: background var(--transition-fast);
        }

        .activity-item:hover {
          background: var(--bg-secondary);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-lg);
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .activity-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .activity-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
