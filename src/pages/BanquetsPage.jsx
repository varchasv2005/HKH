import React, { useState } from 'react';
import EventModal from '../components/EventModal';
import { eventSpaces } from '../data/hotelData';

const BanquetsPage = () => {
  const [events] = useState(eventSpaces);
  const [selectedSpace, setSelectedSpace] = useState(null);

  return (
    <div style={{ paddingTop: '2rem' }}>
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(10,14,23,0.9) 0%, rgba(18,25,38,1) 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">CELEBRATIONS & GALAS • HOTEL KEDAR HILL</span>
          <h1 className="section-title">Shagun Banquet Hall</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Host your dream wedding, sangeet, reception, or corporate gala at Shagun Banquet Hall. Fully air-conditioned with 100% power backup and luxury catering for 150+ guests.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {events.map((space) => (
            <div
              key={space.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '2.5rem',
                padding: '2.5rem',
                alignItems: 'center',
              }}
            >
              <div>
                <img src={space.image} alt={space.name} style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-border)' }} />
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {space.type}
                </span>
                <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>{space.name}</h2>
                
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  <span>👥 Capacity: <strong>{space.capacity}</strong></span>
                  <span>📐 Area: <strong>{space.area}</strong></span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {space.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                  {space.highlights.map((h, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#e2e8f0' }}>
                      ★ {h}
                    </div>
                  ))}
                </div>

                <button onClick={() => setSelectedSpace(space)} className="btn btn-gold" style={{ width: '100%' }}>
                  INQUIRE SHAGUN HALL BOOKING
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedSpace && (
        <EventModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />
      )}
    </div>
  );
};

export default BanquetsPage;
