import Link from "next/link";
import styles from "./dashboard.module.css";
import { requireAuthRedirect } from "@/lib/auth-utils";
import UserMenu from "@/components/user-menu/user-menu";

export default async function DashboardPage() {
  // Require authentication - redirects to /login if not authenticated
  const user = await requireAuthRedirect();
  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <div className="nav-logo-icon">TP</div>
            <span>TeamPlatform</span>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Main</div>
            <ul className={styles.sidebarMenu}>
              <li>
                <Link href="/dashboard" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
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
                <Link href="/dashboard/website" className={styles.sidebarLink}>
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

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Manage</div>
            <ul className={styles.sidebarMenu}>
              <li>
                <Link href="/dashboard/events" className={styles.sidebarLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Events
                  <span className={styles.sidebarBadge}>3</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/roster" className={styles.sidebarLink}>
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
                <Link href="/dashboard/results" className={styles.sidebarLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Results &amp; Times
                </Link>
              </li>
              <li>
                <Link href="/dashboard/registration" className={styles.sidebarLink}>
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

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Communication</div>
            <ul className={styles.sidebarMenu}>
              <li>
                <Link href="/dashboard/announcements" className={styles.sidebarLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                  </svg>
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/dashboard/messages" className={styles.sidebarLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Messages
                  <span className={`${styles.sidebarBadge} ${styles.sidebarBadgeAccent}`}>5</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard/settings" className={styles.sidebarLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Welcome back! Here&apos;s what&apos;s happening with your team.</p>
          </div>
          <div className={styles.topbarRight}>
            <button className={`btn btn-ghost ${styles.iconBtn}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
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
          <div className={styles.contentGrid}>
            {/* Upcoming Events */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardHeaderTitle}>Upcoming Events</h3>
                <Link href="/dashboard/events" className={styles.cardAction}>View all</Link>
              </div>
              <div className={styles.eventList}>
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
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardHeaderTitle}>Recent Activity</h3>
                <Link href="/dashboard/activity" className={styles.cardAction}>View all</Link>
              </div>
              <div className={styles.activityList}>
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
          <div className={styles.quickActions}>
            <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
            <div className={styles.quickActionsGrid}>
              <Link href="/dashboard/events/new" className={styles.quickActionCard}>
                <div className={styles.quickActionIcon}>📅</div>
                <span>Create Event</span>
              </Link>
              <Link href="/dashboard/roster/add" className={styles.quickActionCard}>
                <div className={styles.quickActionIcon}>👤</div>
                <span>Add Athlete</span>
              </Link>
              <Link href="/dashboard/announcements/new" className={styles.quickActionCard}>
                <div className={styles.quickActionIcon}>📢</div>
                <span>Send Announcement</span>
              </Link>
              <Link href="/dashboard/results/import" className={styles.quickActionCard}>
                <div className={styles.quickActionIcon}>⬆️</div>
                <span>Import Results</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  readonly title: string;
  readonly value: string;
  readonly change: string;
  readonly changeType: 'positive' | 'negative' | 'neutral';
  readonly icon: string;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeClassMap: Record<StatCardProps['changeType'], string> = {
    positive: styles.statCardChangePositive,
    negative: styles.statCardChangeNegative,
    neutral: styles.statCardChangeNeutral,
  };
  const changeClass = changeClassMap[changeType];

  return (
    <div className={styles.statCard}>
      <div className={styles.statCardHeader}>
        <span className={styles.statCardIcon}>{icon}</span>
        <span className={`${styles.statCardChange} ${changeClass}`}>{change}</span>
      </div>
      <div className={styles.statCardValue}>{value}</div>
      <div className={styles.statCardTitle}>{title}</div>
    </div>
  );
}

// Event Item Component
interface EventItemProps {
  readonly title: string;
  readonly date: string;
  readonly location: string;
  readonly type: 'meet' | 'practice' | 'meeting';
}

function EventItem({ title, date, location, type }: EventItemProps) {
  const typeColors: Record<string, { bg: string; color: string }> = {
    meet: { bg: 'var(--primary-50)', color: 'var(--primary-600)' },
    practice: { bg: 'var(--success-50)', color: 'var(--success-600)' },
    meeting: { bg: 'var(--accent-50)', color: 'var(--accent-600)' }
  };

  return (
    <div className={styles.eventItem}>
      <div
        className={styles.eventTypeBadge}
        style={{ background: typeColors[type].bg, color: typeColors[type].color }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div>
        <div className={styles.eventTitle}>{title}</div>
        <div className={styles.eventMeta}>
          <span>{date}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly time: string;
}

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>{icon}</div>
      <div className={styles.activityContent}>
        <div className={styles.activityTitle}>{title}</div>
        <div className={styles.activityDescription}>{description}</div>
      </div>
      <div className={styles.activityTime}>{time}</div>
    </div>
  );
}
