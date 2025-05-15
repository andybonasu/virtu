require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');





app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseRoutes);

// Add this to start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
