import express from 'express';
import {
  hotelDetails,
  roomCategories,
  roomCategoriesWithInventory,
  diningOutlets,
  eventSpaces,
  guestReviews,
  bookingsStore,
  tableReservationsStore,
  eventInquiriesStore,
  getRoomAvailability,
  autoUpdateCheckouts,
} from '../data/db.js';

const router = express.Router();

const getValidatedStay = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { error: 'Check-in and check-out dates are required' };
  }

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { error: 'Check-out must be later than check-in' };
  }

  return {
    start,
    end,
    nights: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
  };
};

// Helper to generate reference code
const generateRefCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SONO-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 1. Hotel Information Endpoint
router.get('/hotel-info', (req, res) => {
  res.json({ success: true, data: hotelDetails });
});

// 2. Room Outlets & Categories with Live Inventory
router.get('/rooms', (req, res) => {
  autoUpdateCheckouts();
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const roomsWithAvailability = roomCategoriesWithInventory.map((room) => {
    const avail = getRoomAvailability(room.id, todayStr, tomorrowStr);
    return {
      ...room,
      totalQuantity: avail.totalQuantity,
      bookedCount: avail.bookedCount,
      availableCount: avail.availableCount,
      isAvailable: avail.isAvailable,
    };
  });

  res.json({ success: true, data: roomsWithAvailability });
});

router.get('/rooms/:id', (req, res) => {
  autoUpdateCheckouts();
  const room = roomCategoriesWithInventory.find((r) => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room category not found' });
  }
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const avail = getRoomAvailability(room.id, todayStr, tomorrowStr);

  res.json({
    success: true,
    data: {
      ...room,
      totalQuantity: avail.totalQuantity,
      bookedCount: avail.bookedCount,
      availableCount: avail.availableCount,
      isAvailable: avail.isAvailable,
    },
  });
});

// 3. Dining Outlets
router.get('/dining', (req, res) => {
  res.json({ success: true, data: diningOutlets });
});

// 4. Event & Banquet Spaces
router.get('/events', (req, res) => {
  res.json({ success: true, data: eventSpaces });
});

// 5. Guest Reviews
router.get('/reviews', (req, res) => {
  res.json({ success: true, data: guestReviews });
});

// 6. Check Room Availability & Calculate Price dynamically
router.post('/bookings/check-availability', (req, res) => {
  const { checkIn, checkOut, guests, roomId } = req.body;
  const stay = getValidatedStay(checkIn, checkOut);
  if (stay.error) {
    return res.status(400).json({ success: false, message: stay.error });
  }
  const { nights } = stay;

  let availableRooms = roomCategoriesWithInventory.map((room) => {
    const avail = getRoomAvailability(room.id, checkIn, checkOut);
    return {
      ...room,
      totalNights: nights,
      calculatedTotal: room.price * nights,
      totalQuantity: avail.totalQuantity,
      bookedCount: avail.bookedCount,
      availableCount: avail.availableCount,
      isAvailable: avail.isAvailable,
    };
  });

  if (roomId) {
    availableRooms = availableRooms.filter((r) => r.id === roomId);
  }

  res.json({
    success: true,
    checkIn,
    checkOut,
    nights,
    guests: guests || 2,
    rooms: availableRooms,
  });
});

// 7. Create Guest Booking with Sold-Out Validation & Live Database Update
router.post('/bookings', (req, res) => {
  const { guestName, email, phone, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

  if (!guestName || !email || !phone || !roomId || !checkIn || !checkOut) {
    return res.status(400).json({
      success: false,
      message: 'Missing required booking details (Name, Email, Phone, Room, Dates)',
    });
  }

  const stay = getValidatedStay(checkIn, checkOut);
  if (stay.error) {
    return res.status(400).json({ success: false, message: stay.error });
  }

  const room = roomCategoriesWithInventory.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Invalid room category selected' });
  }

  // Real-time Database Sold-Out Check
  const avail = getRoomAvailability(roomId, checkIn, checkOut);
  if (!avail.isAvailable || avail.availableCount <= 0) {
    return res.status(400).json({
      success: false,
      isAvailable: false,
      availableCount: 0,
      message: `SOLD OUT! All ${room.title} rooms are fully booked for ${checkIn} to ${checkOut}. Please select different dates or choose another room category.`,
    });
  }

  const { nights } = stay;
  const totalPrice = room.price * nights;

  const newBooking = {
    id: `BK-${Date.now().toString().slice(-5)}`,
    referenceCode: generateRefCode(),
    guestName,
    email,
    phone,
    roomId: room.id,
    roomTitle: room.title,
    checkIn,
    checkOut,
    nights,
    guests: guests || 2,
    totalPrice,
    specialRequests: specialRequests || 'None',
    status: 'Confirmed',
    paymentStatus: 'Pay at Hotel / Guaranteed',
    createdAt: new Date().toISOString(),
  };

  // Append new booking to database store instantly
  bookingsStore.unshift(newBooking);

  // Recalculate remaining inventory after booking creation
  const updatedAvail = getRoomAvailability(roomId, checkIn, checkOut);

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully!',
    data: newBooking,
    remainingAvailable: updatedAvail.availableCount,
  });
});

// 8. Find Booking by Reference Code
router.get('/bookings/:referenceCode', (req, res) => {
  const booking = bookingsStore.find(
    (b) => b.referenceCode.toUpperCase() === req.params.referenceCode.toUpperCase()
  );

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Reservation reference not found' });
  }

  res.json({ success: true, data: booking });
});

// 9. Table Reservation for Dining
router.post('/dining/reserve', (req, res) => {
  const { name, phone, outletId, date, time, guests, specialNotes } = req.body;

  if (!name || !phone || !date || !time || !outletId) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields' });
  }

  const outlet = diningOutlets.find((d) => d.id === outletId);

  const reservation = {
    id: `TBL-${Date.now().toString().slice(-4)}`,
    name,
    phone,
    outletName: outlet ? outlet.name : outletId,
    date,
    time,
    guests: guests || 2,
    specialNotes: specialNotes || 'None',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  tableReservationsStore.unshift(reservation);

  res.status(201).json({
    success: true,
    message: `Table reserved at ${outlet ? outlet.name : 'Restaurant'}! We look forward to serving you.`,
    data: reservation,
  });
});

// 10. Event / Banquet Hall Inquiry
router.post('/events/inquire', (req, res) => {
  const { name, email, phone, eventType, spaceId, date, guestCount, message } = req.body;

  if (!name || !email || !phone || !eventType) {
    return res.status(400).json({ success: false, message: 'Please provide contact info and event type' });
  }

  const inquiry = {
    id: `EVT-${Date.now().toString().slice(-4)}`,
    name,
    email,
    phone,
    eventType,
    spaceId: spaceId || 'general',
    date: date || 'Flexible',
    guestCount: guestCount || '100+',
    message: message || '',
    status: 'Pending Contact',
    createdAt: new Date().toISOString(),
  };

  eventInquiriesStore.unshift(inquiry);

  res.status(201).json({
    success: true,
    message: 'Event inquiry received! Our banquet team will call you back within 2 hours.',
    data: inquiry,
  });
});

// 11. Admin Authentication & Data Overview
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Default demo credentials
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      token: 'demo-admin-jwt-token-98765',
      user: { name: 'Hotel Manager', role: 'Administrator' },
    });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials. Use admin / admin123 for demo.' });
});

router.get('/admin/overview', (req, res) => {
  autoUpdateCheckouts();
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const roomInventoryOverview = roomCategoriesWithInventory.map((room) => {
    const avail = getRoomAvailability(room.id, todayStr, tomorrowStr);
    return {
      id: room.id,
      title: room.title,
      totalQuantity: room.totalQuantity,
      bookedCount: avail.bookedCount,
      availableCount: avail.availableCount,
      isAvailable: avail.isAvailable,
    };
  });

  res.json({
    success: true,
    data: {
      totalBookings: bookingsStore.length,
      totalTableReservations: tableReservationsStore.length,
      totalEventInquiries: eventInquiriesStore.length,
      roomInventoryOverview,
      bookings: bookingsStore,
      tableReservations: tableReservationsStore,
      eventInquiries: eventInquiriesStore,
    },
  });
});

export default router;
