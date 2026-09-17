import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Instagram } from 'lucide-react';
import { hotelDetails } from '../data/hotelData';

const Header = ({ onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-sticky">
      <div className="container">
        <div className="nav-container" style={{ gap: '1.5rem' }}>
          {/* Brand Logo - Hotel Kedar Hill Image Emblem */}
          <Link to="/" className="brand-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <img
              src={hotelDetails.logoImage}
              alt="Hotel Kedar Hill Logo"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: '1.1' }}>
                <span className="brand-name" style={{ fontSize: '1.3rem', letterSpacing: '0.04em', fontWeight: '700' }}>
                  HOTEL KEDAR HILL
                </span>
                <span
                  style={{
                    background: 'var(--gold-primary)',
                    color: '#0b0f19',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '3px',
                  }}
                >
                  HKH
                </span>
              </div>
              <span className="brand-tag" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', marginTop: '0.15rem' }}>
                LUXURY WITH COMFORT • SINCE 2025
              </span>
            </div>
          </Link>

          {/* Navigation Links - Fixed Single Line Layout (no line breaks) */}
          <nav style={{ flexShrink: 0 }}>
            <ul className={`nav-links ${mobileOpen ? 'open' : ''}`} style={{ whiteSpace: 'nowrap', gap: '1.75rem' }}>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link
                  to="/dining"
                  className={`nav-link ${isActive('/dining') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Zenith Dining & Bar
                </Link>
              </li>
              <li>
                <Link
                  to="/banquets"
                  className={`nav-link ${isActive('/banquets') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Shagun Banquet
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Staff Portal
                </Link>
              </li>
            </ul>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
            <a
              href={hotelDetails.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-gold"
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Follow @kedarhill.hotel on Instagram"
            >
              <Instagram size={18} />
            </a>

            <a
              href="tel:+918235758333"
              className="btn btn-outline-gold"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              title="Call +91 82357 58333"
            >
              <Phone size={16} />
              <span>Contact Now</span>
            </a>

            <button onClick={onOpenBooking} className="btn btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <Calendar size={18} />
              <span>Book Room</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
