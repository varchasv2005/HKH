import React, { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

const EventModal = ({ space, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding Reception',
    date: '',
    guestCount: '200-300',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/events/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          spaceId: space?.id || 'general',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Error submitting event inquiry');
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
            <span className="section-subtitle">Banquet & Event Inquiry</span>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
              {space ? space.name : 'Grand Event Planning'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {space ? `${space.capacity} • ${space.area}` : 'Weddings, Conferences & Social Celebrations'}
            </p>

            {error && (
              <div style={{ background: 'rgba(230, 57, 70, 0.15)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Your Name"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Event Type</label>
                  <select
                    name="eventType"
                    className="input-field"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="Wedding Reception">Wedding / Sangeet</option>
                    <option value="Corporate Summit">Corporate Seminar / Summit</option>
                    <option value="Birthday Party">Birthday / Anniversary</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Exhibition">Exhibition / Gala</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Tentative Date</label>
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
                  <label className="input-label">Estimated Guests</label>
                  <select
                    name="guestCount"
                    className="input-field"
                    value={formData.guestCount}
                    onChange={handleChange}
                  >
                    <option value="50-100">50 - 100 Guests</option>
                    <option value="100-250">100 - 250 Guests</option>
                    <option value="250-500">250 - 500 Guests</option>
                    <option value="500+">500+ Grand Gala</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Event Requirements & Details</label>
                <textarea
                  name="message"
                  className="input-field"
                  rows="3"
                  placeholder="Stage requirements, catering preferences, audio/visual setup..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Submitting...' : 'Request Banquet Proposal'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={56} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <span className="section-subtitle">Inquiry Received</span>
            <h3 style={{ marginBottom: '0.5rem' }}>Banquet Proposal Request Sent!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Thank you {formData.name}. Our event management specialist will contact you shortly on <strong style={{ color: '#fff' }}>{formData.phone}</strong>.
            </p>
            <button onClick={onClose} className="btn btn-gold">Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
