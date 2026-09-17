import React, { useState } from 'react';
import DiningModal from '../components/DiningModal';
import { diningOutlets } from '../data/hotelData';

const DiningPage = () => {
  const [dining] = useState(diningOutlets);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  return (
    <div style={{ paddingTop: '2rem' }}>
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(10,14,23,0.9) 0%, rgba(18,25,38,1) 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">CULINARY EXCELLENCE • HOTEL KEDAR HILL</span>
          <h1 className="section-title">Zenith Dining & Bar</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Enjoy two distinct dining atmospheres under the Zenith banner: Zenith (Closed Dining Experience) and Zenith (Rooftop Experience).
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {dining.map((outlet) => (
              <div
                key={outlet.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '2rem',
                  padding: '2rem',
                }}
              >
                <div>
                  <img
                    src={outlet.image}
                    alt={outlet.name}
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-border)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    {outlet.type}
                  </span>
                  <h2 style={{ fontSize: '2rem', margin: '0.4rem 0' }}>{outlet.name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    {outlet.description}
                  </p>

                  <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <strong>Cuisine:</strong> {outlet.cuisine}<br />
                    <strong>Timings:</strong> {outlet.timing}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {outlet.highlights.map((h, i) => (
                      <span key={i} className="amenity-chip" style={{ color: 'var(--gold-primary)', borderColor: 'var(--gold-border)' }}>
                        ★ {h}
                      </span>
                    ))}
                  </div>

                  <button onClick={() => setSelectedOutlet(outlet)} className="btn btn-gold" style={{ alignSelf: 'flex-start' }}>
                    RESERVE TABLE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedOutlet && (
        <DiningModal outlet={selectedOutlet} onClose={() => setSelectedOutlet(null)} />
      )}
    </div>
  );
};

export default DiningPage;
