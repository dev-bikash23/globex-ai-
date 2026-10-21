import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="gx-footer">
      <div className="gx-container">
        <div className="gx-footer__grid">
          {/* Brand Column */}
          <div className="gx-footer__brand-col">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: 'linear-gradient(135deg, #245B83, #3C9389)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '0.9rem'
                }}
              >
                GX
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>
                GlobeX <span style={{ color: '#4DB3A7' }}>AI</span>
              </span>
            </Link>
            <p className="gx-footer__brand-desc">
              Discover extraordinary destinations, plan thoughtful journeys, and explore the world with
              an interactive 3D globe experience.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="gx-footer__col-title">Explore</h4>
            <Link to="/" className="gx-footer__link">Destinations</Link>
            <Link to="/search" className="gx-footer__link">Flights</Link>
            <Link to="/search" className="gx-footer__link">Hotels</Link>
            <Link to="/search" className="gx-footer__link">Activities</Link>
          </div>

          {/* Company */}
          <div>
            <h4 className="gx-footer__col-title">Company</h4>
            <Link to="/" className="gx-footer__link">About</Link>
            <Link to="/" className="gx-footer__link">Contact</Link>
            <Link to="/" className="gx-footer__link">Privacy</Link>
            <Link to="/" className="gx-footer__link">Terms</Link>
          </div>

          {/* Account */}
          <div>
            <h4 className="gx-footer__col-title">Account</h4>
            <Link to="/login" className="gx-footer__link">Sign In</Link>
            <Link to="/register" className="gx-footer__link">Create Account</Link>
            <Link to="/dashboard" className="gx-footer__link">Dashboard</Link>
            <Link to="/trips" className="gx-footer__link">My Trips</Link>
          </div>
        </div>

        <div className="gx-footer__divider">
          <p className="gx-footer__copy">© {year} GlobeX AI. All rights reserved.</p>
          <div className="gx-footer__attributions">
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Weather by Open-Meteo</a>
            <a href="https://frankfurter.app" target="_blank" rel="noopener noreferrer">Rates by ECB</a>
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
            <a href="https://unsplash.com?utm_source=globex_ai&utm_medium=referral" target="_blank" rel="noopener noreferrer">Photos by Unsplash</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
