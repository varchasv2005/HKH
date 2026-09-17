import React, { useState, useEffect } from 'react';
import BookingBar from '../components/BookingBar';
import RoomModal from '../components/RoomModal';
import DiningModal from '../components/DiningModal';
import EventModal from '../components/EventModal';
import { roomCategories as defaultRooms, diningOutlets as defaultDining, eventSpaces as defaultEvents, guestReviews as defaultReviews } from '../data/hotelData';
import { BedDouble, UtensilsCrossed, CalendarDays, Star, Award, Sparkles, ShieldCheck, Zap, ConciergeBell, Airplay, Coffee, Cigarette } from 'lucide-react';

const HomePage = ({ onOpenBooking }) => {
  const [rooms, setRooms] = useState(defaultRooms);
  const [dining, setDining] = useState(defaultDining);
  const [events, setEvents] = useState(defaultEvents);
  const [reviews, setReviews] = useState(defaultReviews);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDining, setSelectedDining] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => data.success && data.data.length > 0 && setRooms(data.data))
      .catch(() => {});

    fetch('/api/dining')
      .then((res) => res.json())
      .then((data) => data.success && data.data.length > 0 && setDining(data.data))
      .catch(() => {});

    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => data.success && data.data.length > 0 && setEvents(data.data))
      .catch(() => {});

    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => data.success && data.data.length > 0 && setReviews(data.data))
      .catch(() => {});
  }, []);

  const handleSearchAvailability = (params) => {
    setSearchParams(params);
    const roomToSelect = params.roomId
      ? rooms.find((r) => r.id === params.roomId) || rooms[0]
      : rooms[0];
    setSelectedRoom(roomToSelect);
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="section-subtitle">HOTEL KEDAR HILL • SINCE 2025</span>
          <h1 className="hero-title">
            Experience <span className="gold-gradient-text">Luxury With Comfort</span>
          </h1>
          <p className="hero-description">
            Welcome to Hotel Kedar Hill (HKH). Offering 18 premium AC rooms & suites, Zenith multi-cuisine closed & rooftop dining, and Shagun Banquet Hall for 150+ guests.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setSelectedRoom(rooms[0])} className="btn btn-gold">
              EXPLORE THE ROOMS
            </button>
            <button onClick={() => setSelectedDining(dining[0])} className="btn btn-secondary">
              ZENITH DINING & BAR
            </button>
          </div>
        </div>
      </section>

      {/* 2. Floating Booking Bar */}
      <BookingBar onSearchAvailability={handleSearchAvailability} />

      {/* 3. Popular Amenities Section (From User Screenshot) */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">HOTEL HIGHLIGHTS</span>
            <h2 className="section-title">Popular Amenities & Services</h2>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <ConciergeBell className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Butler Services</div>
              <div className="stat-label">Personalized Care</div>
            </div>

            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <Coffee className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Room Service</div>
              <div className="stat-label">24/7 In-Room Dining</div>
            </div>

            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <Sparkles className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Lounge</div>
              <div className="stat-label">Comfort Seating</div>
            </div>

            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <Cigarette className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Smoking Rooms</div>
              <div className="stat-label">Designated Spaces</div>
            </div>

            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <Airplay className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Air Conditioning</div>
              <div className="stat-label">Individual AC in All Rooms</div>
            </div>

            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <Zap className="stat-icon" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>Power Backup</div>
              <div className="stat-label">100% Uninterrupted Power</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Rooms & Suites Showcase (Fixed HKH 4 AC Room Categories & Rates) */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle">ACCOMMODATIONS</span>
            <h2 className="section-title">Palatial Rooms & Premier AC Suites</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Featuring 18 luxury AC rooms from 130 sq.ft. Deluxe Rooms to 200 sq.ft. Presidential Suites with Jacuzzi Bathtub.
            </p>
          </div>

          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-image-wrapper">
                  <img src={room.image} alt={room.title} className="room-image" />
                  {room.popular && <span className="popular-badge">Top Choice</span>}
                </div>
                <div className="room-content">
                  <h3 className="room-title">{room.title}</h3>
                  <p className="room-subtitle">{room.subtitle}</p>
                  
                  <div className="room-meta">
                    <span>📐 {room.size}</span> • <span>🛏️ {room.bedType}</span>
                  </div>

                  <div className="amenities-list">
                    {room.amenities.slice(0, 4).map((item, idx) => (
                      <span key={idx} className="amenity-chip">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="room-price-row">
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                        ₹{room.originalPrice.toLocaleString()}
                      </span>
                      <span className="price-amount">₹{room.price.toLocaleString()}</span>
                      <span className="price-unit"> / night</span>
                    </div>
                    <button onClick={() => setSelectedRoom(room)} className="btn btn-gold" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                      Book Suite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Food & Beverage Outlets - Exactly 2 Zenith Experiences (Closed & Rooftop) */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle">ZENITH CULINARY EXPERIENCE</span>
            <h2 className="section-title">Rooftop & Closed Dining Outlets</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Two distinct dining atmospheres under the Zenith banner: Closed AC indoor multi-cuisine dining and open-air rooftop sky lounge.
            </p>
          </div>

          <div className="outlets-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
            {dining.map((outlet) => (
              <div key={outlet.id} className="outlet-card">
                <img src={outlet.image} alt={outlet.name} className="outlet-image" />
                <div className="outlet-body">
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                    {outlet.type}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', margin: '0.4rem 0 0.6rem 0' }}>{outlet.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    {outlet.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🕒 {outlet.timing}</span>
                    <button onClick={() => setSelectedDining(outlet)} className="btn btn-gold" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>
                      RESERVE TABLE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Shagun Banquet Hall */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-subtitle">WEDDINGS & CELEBRATIONS</span>
              <h2 className="section-title">Shagun Banquet Hall (150+ Guests)</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                Shagun Banquet Hall is Hotel Kedar Hill's premier venue for grand wedding receptions, sangeet, corporate seminars, and private galas.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>👥 150+ Guests Capacity</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Spacious 3,200 sq. ft. venue</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>⚡ 100% Power Backup</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full AC & acoustic audio</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>👰 Bridal Suite</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dedicated dressing suite</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>🍲 Gourmet Catering</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Custom multi-cuisine menus</p>
                </div>
              </div>

              <button onClick={() => setSelectedEvent(events[0])} className="btn btn-gold">
                INQUIRE SHAGUN HALL BOOKING
              </button>
            </div>

            <div>
              <img
                src="/assets/banquet_hall.jpg"
                alt="Shagun Banquet Hall"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gold-border)', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Guest Reviews Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle">GUEST REVIEWS</span>
            <h2 className="section-title">What Guests Say About Hotel Kedar Hill</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="var(--gold-primary)" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: '#e2e8f0', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  "{rev.comment}"
                </p>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{rev.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.role} • {rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          initialSearch={searchParams}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {selectedDining && (
        <DiningModal
          outlet={selectedDining}
          onClose={() => setSelectedDining(null)}
        />
      )}

      {selectedEvent && (
        <EventModal
          space={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
