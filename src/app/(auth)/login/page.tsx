'use client';

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <Link href="/" className="nav-logo">
              <div className="nav-logo-icon">TP</div>
              <span>TeamPlatform</span>
            </Link>

            <h1 className="auth-branding-title">
              Welcome back to your team headquarters
            </h1>

            <p className="auth-branding-text">
              Manage your team, track performance, and stay connected with your
              entire sports community in one powerful platform.
            </p>

            <div className="auth-testimonial">
              <p>"TeamPlatform has transformed how we manage our swim club.
                Registration, communications, results tracking—it's all seamless."</p>
              <div className="auth-testimonial-author">
                <div className="auth-testimonial-avatar">SC</div>
                <div>
                  <div className="auth-testimonial-name">Sarah Chen</div>
                  <div className="auth-testimonial-role">Head Coach, Aquatic Stars</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Sign in to your account</h2>
              <p>Enter your credentials to access your dashboard</p>
            </div>

            <form className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="password">Password</label>
                  <Link href="/forgot-password" className="form-link">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-checkbox-group">
                <input type="checkbox" id="remember" className="form-checkbox" />
                <label htmlFor="remember" className="form-checkbox-label">Remember me for 30 days</label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Sign in
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <button className="btn btn-secondary auth-social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button className="btn btn-secondary auth-social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="auth-form-footer">
              Don't have an account? <Link href="/register" className="form-link">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        .auth-branding {
          background: var(--gradient-hero);
          padding: var(--space-12);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .auth-branding::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-mesh);
          opacity: 0.3;
        }

        .auth-branding-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
        }

        .auth-branding .nav-logo {
          color: white;
          margin-bottom: var(--space-12);
        }

        .auth-branding-title {
          font-size: var(--text-4xl);
          font-weight: 700;
          color: white;
          margin-bottom: var(--space-6);
          line-height: 1.2;
        }

        .auth-branding-text {
          font-size: var(--text-lg);
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: var(--space-12);
          line-height: var(--leading-relaxed);
        }

        .auth-testimonial {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .auth-testimonial p {
          font-size: var(--text-base);
          color: white;
          font-style: italic;
          margin-bottom: var(--space-4);
          line-height: var(--leading-relaxed);
        }

        .auth-testimonial-author {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .auth-testimonial-avatar {
          width: 44px;
          height: 44px;
          background: var(--accent-500);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }

        .auth-testimonial-name {
          font-weight: 600;
          color: white;
        }

        .auth-testimonial-role {
          font-size: var(--text-sm);
          color: rgba(255, 255, 255, 0.7);
        }

        .auth-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
        }

        .auth-form-container {
          width: 100%;
          max-width: 400px;
        }

        .auth-form-header {
          margin-bottom: var(--space-8);
        }

        .auth-form-header h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-2);
        }

        .auth-form-header p {
          color: var(--text-secondary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-link {
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 500;
        }

        .form-link:hover {
          color: var(--primary-700);
        }

        .form-checkbox-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-600);
        }

        .form-checkbox-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin: var(--space-6) 0;
          color: var(--text-tertiary);
          font-size: var(--text-sm);
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }

        .auth-social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .auth-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .auth-form-footer {
          text-align: center;
          margin-top: var(--space-8);
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }

          .auth-branding {
            display: none;
          }

          .auth-form-section {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}
