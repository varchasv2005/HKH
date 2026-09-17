import React, { useState } from 'react';
import { X, Utensils, CheckCircle } from 'lucide-react';

const DiningModal = ({ outlet, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2,
    specialNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!outlet) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/dining/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          outletId: outlet.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Error reserving table');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!success ? (
          <div>
            <span className="section-subtitle">Table Reservation</span>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{outlet.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {outlet.type} • {outlet.timing}
            </p>

            {error && (
              <div style={{ background: 'rgba(230, 57, 70, 0.15)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="input-field"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Time Slot</label>
                  <input
                    type="time"
                    name="time"
                    className="input-field"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Guests</label>
                  <select
                    name="guests"
                    className="input-field"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8">8+ Party</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Special Dietary & Seating Preferences</label>
                <textarea
                  name="specialNotes"
                  className="input-field"
                  rows="2"
                  placeholder="Cabana seating, birthday decoration, vegetarian requirements..."
                  value={formData.specialNotes}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Reserving...' : 'Reserve Table Now'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={56} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <span className="section-subtitle">Reservation Received</span>
            <h3 style={{ marginBottom: '0.5rem' }}>Table Reserved at {outlet.name}!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              We look forward to welcoming you on <strong style={{ color: '#fff' }}>{formData.date} at {formData.time}</strong>.
            </p>
            <button onClick={onClose} className="btn btn-gold">Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiningModal;
