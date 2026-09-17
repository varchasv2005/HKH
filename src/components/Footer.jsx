import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Linkedin, ShieldCheck, Zap, ConciergeBell, Airplay, Coffee } from 'lucide-react';
import { hotelDetails } from '../data/hotelData';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-column">
            <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid var(--gold-primary)',
                  background: 'radial-gradient(circle, #1e293b 0%, #0b0f19 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                }}
              >
                <Mountain size={20} />
              </div>
              <div>
                <span className="brand-name">HOTEL KEDAR HILL</span>
                <span className="brand-tag">LUXURY WITH COMFORT • SINCE 2025</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Dhanbad's premier hospitality destination offering 18 luxurious AC rooms, Zenith fine dining & rooftop sky bar, and Shagun Banquet Hall for 150+ guest events.
            </p>

            {/* Popular Amenities Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <span className="amenity-chip">🤵 Butler Services</span>
              <span className="amenity-chip">🛎️ Room Service</span>
              <span className="amenity-chip">🛋️ Lounge</span>
              <span className="amenity-chip">🚬 Smoking Rooms</span>
              <span className="amenity-chip">❄️ Air Conditioning</span>
              <span className="amenity-chip">⚡ Power Backup</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={hotelDetails.instagram || "https://www.instagram.com/kedarhill.hotel?stkn=aWs0aG1oYzFzYXg3"}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Instagram @kedarhill.hotel"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4>Quick Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/rooms">18 AC Rooms &amp; Suites</Link></li>
              <li><Link to="/dining">Zenith Restaurant & Rooftop Bar</Link></li>
              <li><Link to="/banquets">Shagun Banquet Hall (150+)</Link></li>
              <li><Link to="/admin">Staff & Management Console</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="footer-column">
            <h4>Contact Hotel Kedar Hill</h4>
            <ul className="footer-links" style={{ gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>Kedar Hill Road, Near Ozone Galleria, Dhanbad, Jharkhand 828127</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Phone size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>{hotelDetails.phone}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Mail size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>kedarhill.reception@gmail.com</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Clock size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>24/7 Front Desk, Butler & Room Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Hotel Kedar Hill (HKH) • Established 2025. All Rights Reserved. Luxury With Comfort.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
