import app from './app.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏨 Luxury Hotel Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints active at http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}

export default app;
