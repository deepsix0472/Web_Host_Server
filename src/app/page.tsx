import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">TP</div>
            <span>TeamPlatform</span>
          </Link>

          <ul className="nav-links">
            <li><Link href="#features" className="nav-link">Features</Link></li>
            <li><Link href="#pricing" className="nav-link">Pricing</Link></li>
            <li><Link href="#about" className="nav-link">About</Link></li>
            <li><Link href="#contact" className="nav-link">Contact</Link></li>
          </ul>

          <div className="nav-actions">
            <Link href="/login" className="btn btn-ghost">Log In</Link>
            <Link href="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Trusted by 500+ sports teams</span>
            </div>

            <h1 className="hero-title">
              Manage Your<br />
              <span>Sports Team</span><br />
              Like a Pro
            </h1>

            <p className="hero-description">
              The all-in-one platform for sports organizations. Create stunning team websites,
              manage events, track athletes, process registrations, and communicate with
              your entire community—all in one place.
            </p>

            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="#demo" className="btn btn-secondary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Demo
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-glow"></div>
            <div className="hero-card">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Everything Your Team Needs</h2>
            <p className="features-subtitle">
              Powerful tools designed specifically for sports organizations,
              from youth leagues to competitive clubs.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon="🌐"
              title="Team Websites"
              description="Create beautiful, customizable websites for your team with news, calendars, photo galleries, and more."
            />
            <FeatureCard
              icon="📅"
              title="Event Management"
              description="Schedule meets, practices, and events. Manage entries, create heat sheets, and publish results instantly."
            />
            <FeatureCard
              icon="👥"
              title="Roster Management"
              description="Track athletes, groups, and families. Manage registrations, documents, and member communications."
            />
            <FeatureCard
              icon="⏱️"
              title="Timing Integration"
              description="Import results from major timing systems. Track personal bests, season records, and progression."
            />
            <FeatureCard
              icon="💳"
              title="Online Payments"
              description="Collect dues, registration fees, and fundraising with integrated payment processing."
            />
            <FeatureCard
              icon="📧"
              title="Communication Hub"
              description="Send announcements, emails, and notifications. Keep your entire team community connected."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">25K+</div>
            <div className="stat-label">Athletes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1M+</div>
            <div className="stat-label">Times Recorded</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>
            Ready to Transform Your Team?
          </h2>
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
            Join thousands of teams already using TeamPlatform to manage their organizations more effectively.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary btn-lg">Start Your Free Trial</Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="nav-logo-icon">TP</div>
                <span>TeamPlatform</span>
              </div>
              <p className="footer-tagline">
                The all-in-one platform for sports team management.
                Build your team, track performance, grow your community.
              </p>
            </div>

            <div className="footer-column">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="#integrations">Integrations</Link></li>
                <li><Link href="#updates">Updates</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><Link href="#docs">Documentation</Link></li>
                <li><Link href="#guides">Guides</Link></li>
                <li><Link href="#support">Support</Link></li>
                <li><Link href="#api">API</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link href="#about">About</Link></li>
                <li><Link href="#blog">Blog</Link></li>
                <li><Link href="#careers">Careers</Link></li>
                <li><Link href="#contact">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 TeamPlatform. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
              <Link href="#privacy">Privacy Policy</Link>
              <Link href="#terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

// Dashboard Preview Component
function DashboardPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>Team Dashboard</div>
        <div style={{
          background: 'var(--success-50)',
          color: 'var(--success-600)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500
        }}>
          ● Active
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <StatCard value="124" label="Athletes" color="var(--primary-500)" />
        <StatCard value="8" label="Upcoming Events" color="var(--accent-500)" />
        <StatCard value="32" label="New Times" color="var(--success-500)" />
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginTop: 'var(--space-2)'
      }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
          Recent Activity
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <ActivityItem icon="🏊" text="New time recorded: 50 Free - 24.56" time="2m ago" />
          <ActivityItem icon="📝" text="Registration: Sarah Johnson" time="15m ago" />
          <ActivityItem icon="📅" text="Event updated: Winter Championships" time="1h ago" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-3)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{label}</div>
    </div>
  );
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span style={{ fontSize: 'var(--text-lg)' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{text}</div>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{time}</div>
    </div>
  );
}
