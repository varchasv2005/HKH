import React, { useState } from 'react';
import { Calendar, Users, BedDouble, Search } from 'lucide-react';
import { format, addDays } from 'date-fns';

const BookingBar = ({ onSearchAvailability }) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(new Date(), 2), 'yyyy-MM-dd');

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guests, setGuests] = useState('2');
  const [roomId, setRoomId] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchAvailability({
      checkIn,
      checkOut,
      guests: parseInt(guests, 10),
      roomId: roomId === 'all' ? null : roomId,
    });
  };

  return (
    <div className="booking-bar-wrapper">
      <div className="container">
        <div className="booking-bar-container">
          <form className="booking-bar-form" onSubmit={handleSubmit}>
            {/* Check-In Date */}
            <div className="input-group">
              <label className="input-label">
                <Calendar size={14} /> Check-In
              </label>
              <input
                type="date"
                className="input-field"
                value={checkIn}
                min={todayStr}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            {/* Check-Out Date */}
            <div className="input-group">
              <label className="input-label">
                <Calendar size={14} /> Check-Out
              </label>
              <input
                type="date"
                className="input-field"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            {/* Guests */}
            <div className="input-group">
              <label className="input-label">
                <Users size={14} /> Guests
              </label>
              <select
                className="input-field"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4 Guests (Family)</option>
              </select>
            </div>

            {/* Room Type */}
            <div className="input-group">
              <label className="input-label">
                <BedDouble size={14} /> Room Category
              </label>
              <select
                className="input-field"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                <option value="all">All AC Room Categories</option>
                <option value="deluxe-room-ac">Deluxe Room - AC (₹1,630)</option>
                <option value="premium-room-ac">Premium Room - AC (₹2,445)</option>
                <option value="family-club-room-ac">Family Club Room - AC (₹3,105)</option>
                <option value="presidential-suite-ac">Presidential Suite with Bathtub - AC (₹3,260)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-gold" style={{ width: '100%', height: '44px' }}>
              <Search size={18} />
              <span>Check Rates</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingBar;
