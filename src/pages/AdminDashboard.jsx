import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, BedDouble, Utensils, CalendarDays, RefreshCw, LogOut, CheckCircle2, Phone, Mail } from 'lucide-react';

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState(null);

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'tables' | 'events'
  const [data, setData] = useState({
    bookings: [],
    tableReservations: [],
    eventInquiries: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.warn('Backend unavailable (static demo mode). Loading mock data:', err);
      setData({
        bookings: [
          {
            id: 'BK-DEMO-01',
            referenceCode: 'HKH-89412',
            guestName: 'Rajesh Sharma',
            email: 'rajesh.sharma@example.com',
            phone: '+91 98765 43210',
            roomTitle: 'Presidential Suite',
            checkIn: '2026-10-10',
            checkOut: '2026-10-12',
            guests: 2,
            nights: 2,
            totalPrice: 24000,
            status: 'Confirmed',
            paymentStatus: 'Guaranteed / Pay at Hotel',
            createdAt: new Date().toISOString(),
          }
        ],
        tableReservations: [
          {
            id: 'TR-DEMO-01',
            guestName: 'Ananya Verma',
            phone: '+91 98111 22334',
            guests: 4,
            date: '2026-10-11',
            time: '20:00',
            specialRequests: 'Window seat preference',
            status: 'Confirmed',
            createdAt: new Date().toISOString(),
          }
        ],
        eventInquiries: [
          {
            id: 'EV-DEMO-01',
            contactName: 'Vikram Malhotra',
            phone: '+91 99223 34455',
            eventType: 'Wedding Reception',
            hallName: 'Grand Imperial Ballroom',
            eventDate: '2026-11-20',
            expectedGuests: 250,
            status: 'Under Review',
            createdAt: new Date().toISOString(),
          }
        ],
        roomInventoryOverview: [
          { id: 'deluxe', title: 'Deluxe Room', totalQuantity: 10, bookedCount: 2, availableCount: 8 },
          { id: 'executive', title: 'Executive Suite', totalQuantity: 6, bookedCount: 1, availableCount: 5 },
          { id: 'presidential', title: 'Presidential Suite', totalQuantity: 2, bookedCount: 1, availableCount: 1 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();
      if (result.success) {
        setAuthenticated(true);
        fetchOverview();
      } else {
        setLoginError(result.message);
      }
    } catch (err) {
      // Fallback for static hosting demo (e.g. GitHub Pages)
      if (username === 'admin' && password === 'admin123') {
        setAuthenticated(true);
        fetchOverview();
      } else {
        setLoginError('Invalid username or password. Demo credentials: admin / admin123');
      }
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            maxWidth: '420px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Lock size={42} style={{ color: 'var(--gold-primary)', marginBottom: '0.75rem' }} />
            <h2 style={{ fontSize: '1.75rem' }}>Staff Portal Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Access Sonotel Hotel Management Console
            </p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(230, 57, 70, 0.15)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              * Demo credentials: username <strong>admin</strong> / password <strong>admin123</strong>
            </p>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In To Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-subtitle">MANAGEMENT CONSOLE</span>
          <h1 style={{ fontSize: '2.2rem' }}>Hotel Reservations & Operations</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchOverview} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <RefreshCw size={16} /> Refresh Data
          </button>
          <button onClick={() => setAuthenticated(false)} className="btn btn-outline-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <BedDouble className="stat-icon" />
          <div className="stat-number">{data.bookings.length}</div>
          <div className="stat-label">Room Bookings</div>
        </div>
        <div className="stat-card">
          <Utensils className="stat-icon" />
          <div className="stat-number">{data.tableReservations.length}</div>
          <div className="stat-label">Table Reservations</div>
        </div>
        <div className="stat-card">
          <CalendarDays className="stat-icon" />
          <div className="stat-number">{data.eventInquiries.length}</div>
          <div className="stat-label">Banquet Event Inquiries</div>
        </div>
      </div>

      {/* Dynamic Room Inventory Status Panel */}
      {data.roomInventoryOverview && data.roomInventoryOverview.length > 0 && (
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BedDouble size={20} /> Live Database Room Inventory (18 Total AC Rooms)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-updates on check-in &amp; checkout history</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {data.roomInventoryOverview.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Rooms: <strong>{item.totalQuantity}</strong></span>
                  <span>Active: <strong>{item.bookedCount}</strong></span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  {item.availableCount === 0 ? (
                    <span style={{ background: '#e63946', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
                      ❌ 0 Available (SOLD OUT)
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                      ● {item.availableCount} Free &amp; Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`btn ${activeTab === 'bookings' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          Room Bookings ({data.bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`btn ${activeTab === 'tables' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          Table Reservations ({data.tableReservations.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          Event Proposals ({data.eventInquiries.length})
        </button>
      </div>

      {/* Tab 1: Room Bookings Table */}
      {activeTab === 'bookings' && (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlignment: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gold-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Ref Code</th>
                <th style={{ padding: '1rem' }}>Guest Name</th>
                <th style={{ padding: '1rem' }}>Suite</th>
                <th style={{ padding: '1rem' }}>Dates</th>
                <th style={{ padding: '1rem' }}>Nights</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No room bookings recorded yet.</td></tr>
              ) : (
                data.bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '700', color: 'var(--gold-primary)' }}>{b.referenceCode}</td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{b.guestName}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.phone} • {b.email}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{b.roomTitle}</td>
                    <td style={{ padding: '1rem' }}>{b.checkIn} → {b.checkOut}</td>
                    <td style={{ padding: '1rem' }}>{b.nights}</td>
                    <td style={{ padding: '1rem', fontWeight: '700' }}>₹{b.totalPrice.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Table Reservations */}
      {activeTab === 'tables' && (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gold-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Guest Name</th>
                <th style={{ padding: '1rem' }}>Outlet</th>
                <th style={{ padding: '1rem' }}>Date & Time</th>
                <th style={{ padding: '1rem' }}>Guests</th>
                <th style={{ padding: '1rem' }}>Notes</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.tableReservations.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No table reservations recorded yet.</td></tr>
              ) : (
                data.tableReservations.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{t.name}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.phone}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{t.outletName}</td>
                    <td style={{ padding: '1rem' }}>{t.date} at {t.time}</td>
                    <td style={{ padding: '1rem' }}>{t.guests} People</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.specialNotes}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Event Inquiries */}
      {activeTab === 'events' && (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gold-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Contact Name</th>
                <th style={{ padding: '1rem' }}>Event Type</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Guests</th>
                <th style={{ padding: '1rem' }}>Message</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.eventInquiries.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No banquet event inquiries submitted yet.</td></tr>
              ) : (
                data.eventInquiries.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{e.name}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.phone} • {e.email}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{e.eventType}</td>
                    <td style={{ padding: '1rem' }}>{e.date}</td>
                    <td style={{ padding: '1rem' }}>{e.guestCount}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{e.message}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-primary)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
