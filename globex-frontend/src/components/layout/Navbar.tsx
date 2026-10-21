import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

interface NavbarProps {
  variant?: 'transparent' | 'solid' | 'dark';
}

export default function Navbar({ variant = 'solid' }: NavbarProps) {
  const { state: authState, logout } = useAuth();
  const location = useLocation();
  const isAuthenticated = authState.status === 'authenticated';
  const user = authState.status === 'authenticated' ? authState.user : null;

  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (variant !== 'transparent' && variant !== 'dark') return;
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isDark   = variant === 'dark' || variant === 'transparent';
  const navClass = [
    'gx-nav',
    variant === 'solid' ? 'gx-nav--solid' : '',
    isDark ? 'gx-nav--dark' : '',
    isDark && scrolled ? 'gx-nav--scrolled' : '',
  ].filter(Boolean).join(' ');

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/',       label: 'Explore' },
    { to: '/search', label: 'Flights & Stays' },
    ...(isAuthenticated
      ? [
          { to: '/trips',     label: 'My Trips' },
          { to: '/dashboard', label: 'Dashboard' },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  const linkColor = isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-slate)';
  const linkHoverColor = isDark ? '#fff' : 'var(--color-navy)';

  return (
    <>
      <nav className={navClass}>
        <div className="gx-nav__inner">
          {/* Brand */}
          <Link to="/" className="gx-nav__brand">
            <div className="gx-nav__logo">GX</div>
            <span className="gx-nav__wordmark">
              GlobeX <span>AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="gx-nav__links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`gx-nav__link ${isActive(link.to) ? 'gx-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="gx-nav__actions">
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: '0.8125rem', color: linkColor, display: 'none' }}>
                  {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: linkColor,
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: linkColor,
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'none',        // shown via CSS on md+
                  }}
                  className="gx-nav__link"
                >
                  Sign in
                </Link>
                <Link to="/register" className="gx-nav__cta">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              className="gx-nav__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`gx-mobile-menu ${isDark ? 'gx-mobile-menu--dark' : ''}`}
          style={{ zIndex: 99 }}
        >
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="gx-mobile-menu__link"
              onClick={() => setMobileOpen(false)}
              style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'var(--color-navy)' }}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="gx-mobile-menu__link" onClick={() => setMobileOpen(false)}
                style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'var(--color-navy)' }}>
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: 'none', textAlign: 'left',
                cursor: 'pointer', width: '100%',
                color: 'var(--color-danger)',
                fontSize: '1.125rem', fontWeight: 500,
                padding: '0.875rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </>
  );
}
