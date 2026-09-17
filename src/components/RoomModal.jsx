import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Calendar, User, Phone, Mail, FileText, Sparkles, BedDouble } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { roomCategories as defaultRoomCategories } from '../data/hotelData';

const RoomModal = ({ room, availableRooms, initialSearch, onClose, onBookingSuccess }) => {
  const roomsList = availableRooms && availableRooms.length > 0 ? availableRooms : defaultRoomCategories;
  
  const [activeRoom, setActiveRoom] = useState(room || roomsList[0]);

  useEffect(() => {
    if (room) {
      setActiveRoom(room);
    }
  }, [room]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(new Date(), 2), 'yyyy-MM-dd');

  const [step, setStep] = useState('form'); // 'form' | 'confirmation'
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: initialSearch?.checkIn || todayStr,
    checkOut: initialSearch?.checkOut || tomorrowStr,
    guests: initialSearch?.guests || 2,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [stockStatus, setStockStatus] = useState({
    availableCount: activeRoom.availableCount ?? activeRoom.totalQuantity ?? 6,
    totalQuantity: activeRoom.totalQuantity ?? 6,
    isAvailable: true,
  });

  useEffect(() => {
    if (activeRoom && formData.checkIn && formData.checkOut) {
      fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          roomId: activeRoom.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.rooms && data.rooms.length > 0) {
            const currentRoomAvail = data.rooms[0];
            setStockStatus({
              availableCount: currentRoomAvail.availableCount,
              totalQuantity: currentRoomAvail.totalQuantity,
              isAvailable: currentRoomAvail.isAvailable,
            });
            if (!currentRoomAvail.isAvailable || currentRoomAvail.availableCount <= 0) {
              setError(`SOLD OUT! All ${activeRoom.title} rooms are fully booked for these dates (${formData.checkIn} to ${formData.checkOut}). Please choose another room category or different dates.`);
            } else {
              setError(null);
            }
          }
        })
        .catch(() => {});
    }
  }, [activeRoom.id, formData.checkIn, formData.checkOut]);

  if (!activeRoom) return null;

  // Calculate nights & total
  const start = new Date(formData.checkIn);
  const end = new Date(formData.checkOut);
  const diffTime = Math.abs(end - start);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = activeRoom.price * nights;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          roomId: activeRoom.id,
          roomTitle: activeRoom.title,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setConfirmedBooking(data.data);
        setStep('confirmation');
        if (onBookingSuccess) onBookingSuccess(data.data);
      } else {
        setError(data.message || 'Failed to create reservation');
      }
    } catch (err) {
      // Fallback booking confirmation for static GitHub Pages demo deployment
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'SONO-';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const demoBooking = {
        id: `BK-${Date.now().toString().slice(-5)}`,
        referenceCode: code,
        guestName: formData.guestName,
        email: formData.email,
        phone: formData.phone,
        roomId: activeRoom.id,
        roomTitle: activeRoom.title,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        nights,
        guests: formData.guests || 2,
        totalPrice,
        specialRequests: formData.specialRequests || 'None',
        status: 'Confirmed',
        paymentStatus: 'Pay at Hotel / Guaranteed',
        createdAt: new Date().toISOString(),
      };
      setConfirmedBooking(demoBooking);
      setStep('confirmation');
      if (onBookingSuccess) onBookingSuccess(demoBooking);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div>
            <span className="section-subtitle">Guaranteed Direct Reservation</span>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{activeRoom.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {activeRoom.subtitle}
            </p>

            {/* Room Selector Dropdown */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontWeight: '700' }}>
                <BedDouble size={16} /> Choose Room Category
              </label>
              <select
                className="input-field"
                value={activeRoom.id}
                onChange={(e) => {
                  const selected = roomsList.find((r) => r.id === e.target.value);
                  if (selected) setActiveRoom(selected);
                }}
                style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid var(--gold-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '0.75rem',
                }}
              >
                {roomsList.map((r) => (
                  <option key={r.id} value={r.id} style={{ background: '#0b0f19', color: '#fff' }}>
                    {r.title} — ₹{r.price.toLocaleString()} / night ({r.size})
                  </option>
                ))}
              </select>
            </div>

            {/* Room Brief Banner */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                alignItems: 'center',
              }}
            >
              <img
                src={activeRoom.image}
                alt={activeRoom.title}
                style={{ width: '120px', height: '85px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gold-border)' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gold-primary)' }}>
                  ₹{activeRoom.price.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ night</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {activeRoom.size} • {activeRoom.bedType} • {activeRoom.capacity}
                </div>
                <div style={{ marginTop: '0.45rem' }}>
                  {stockStatus.availableCount === 0 ? (
                    <span style={{ background: '#e63946', color: '#fff', fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                      ❌ SOLD OUT (0 / {stockStatus.totalQuantity} Rooms Available)
                    </span>
                  ) : stockStatus.availableCount === 1 ? (
                    <span style={{ background: '#f77f00', color: '#fff', fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                      ⚠️ High Demand: Only 1 Room Left!
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid #22c55e', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                      ● {stockStatus.availableCount} of {stockStatus.totalQuantity} Rooms Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(230, 57, 70, 0.15)',
                  border: '1px solid #e63946',
                  color: '#ff6b6b',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Check-In</label>
                  <input
                    type="date"
                    name="checkIn"
                    className="input-field"
                    value={formData.checkIn}
                    min={todayStr}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Check-Out</label>
                  <input
                    type="date"
                    name="checkOut"
                    className="input-field"
                    value={formData.checkOut}
                    min={formData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Guest Full Name</label>
                  <input
                    type="text"
                    name="guestName"
                    placeholder="e.g. Aditi Roy"
                    className="input-field"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="aditi@example.com"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  rows="2"
                  placeholder="Early check-in, high floor, anniversary surprise..."
                  className="input-field"
                  value={formData.specialRequests}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Summary Calculation Box */}
              <div
                style={{
                  background: 'var(--gold-soft)',
                  border: '1px dashed var(--gold-primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total for {nights} Night{nights > 1 ? 's' : ''}:
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gold-primary)' }}>
                    ₹{totalPrice.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={16} /> Pay at Hotel & Free Cancellation
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold"
                disabled={loading || stockStatus.availableCount === 0}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  opacity: stockStatus.availableCount === 0 ? 0.5 : 1,
                  cursor: stockStatus.availableCount === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? 'Processing Reservation...'
                  : stockStatus.availableCount === 0
                  ? 'Sold Out for Selected Dates'
                  : 'Confirm Instant Booking'}
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Voucher Confirmation */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={56} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <span className="section-subtitle">Booking Confirmed!</span>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Thank You, {confirmedBooking?.guestName}!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your reservation at Sonotel Hotels has been confirmed. A voucher copy has been sent to{' '}
              <strong style={{ color: '#fff' }}>{confirmedBooking?.email}</strong>.
            </p>

            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reference Code:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                  {confirmedBooking?.referenceCode}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div><strong style={{ color: 'var(--text-muted)' }}>Suite:</strong> {confirmedBooking?.roomTitle}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Nights:</strong> {confirmedBooking?.nights}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Check-In:</strong> {confirmedBooking?.checkIn}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Check-Out:</strong> {confirmedBooking?.checkOut}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Guests:</strong> {confirmedBooking?.guests} Adults</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Total Amount:</strong> ₹{confirmedBooking?.totalPrice.toLocaleString()}</div>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-gold" style={{ minWidth: '180px' }}>
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomModal;
