import React, { useState } from 'react';
import RoomModal from '../components/RoomModal';
import { roomCategories } from '../data/hotelData';
import { Check } from 'lucide-react';

const RoomsPage = () => {
  const [rooms] = useState(roomCategories);
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div style={{ paddingTop: '2rem' }}>
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(10,14,23,0.9) 0%, rgba(18,25,38,1) 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">18 AC ROOMS • HOTEL KEDAR HILL</span>
          <h1 className="section-title">Rooms & Suites</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            All 18 rooms at Hotel Kedar Hill feature air conditioning, 100% power backup, butler services, 24/7 room service, and high-speed Wi-Fi.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {rooms.map((room, index) => (
              <div
                key={room.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
                  gap: '2.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  padding: '2rem',
                  alignItems: 'center',
                }}
              >
                <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                  <img
                    src={room.image}
                    alt={room.title}
                    style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-border)' }}
                  />
                </div>

                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    📐 {room.size} • 🛏️ {room.bedType}
                  </span>
                  <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{room.title}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                    {room.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    {room.amenities.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                        <Check size={16} style={{ color: 'var(--gold-primary)' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                        Starting ₹{room.originalPrice.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--gold-primary)', fontFamily: 'var(--font-heading)' }}>
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / night</span>
                    </div>

                    <button onClick={() => setSelectedRoom(room)} className="btn btn-gold">
                      Book AC Suite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
};

export default RoomsPage;
