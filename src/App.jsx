import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import DiningPage from './pages/DiningPage';
import BanquetsPage from './pages/BanquetsPage';
import AdminDashboard from './pages/AdminDashboard';
import RoomModal from './components/RoomModal';
import { roomCategories } from './data/hotelData';
import './styles/main.css';

function App() {
  const [globalBookingOpen, setGlobalBookingOpen] = useState(false);
  const [defaultRoom, setDefaultRoom] = useState(roomCategories[0]);

  const handleOpenGlobalBooking = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setDefaultRoom(data.data[0]);
      } else {
        setDefaultRoom(roomCategories[0]);
      }
    } catch (err) {
      setDefaultRoom(roomCategories[0]);
    }
    setGlobalBookingOpen(true);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onOpenBooking={handleOpenGlobalBooking} />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage onOpenBooking={handleOpenGlobalBooking} />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/banquets" element={<BanquetsPage />} />
            <Route path="/banquet" element={<BanquetsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Booking Modal */}
        {globalBookingOpen && defaultRoom && (
          <RoomModal
            room={defaultRoom}
            onClose={() => setGlobalBookingOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
