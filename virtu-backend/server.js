require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const courseContentRoutes = require('./routes/courseContentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const publicCourseRoutes = require('./routes/publicCourseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseRoutes);
app.use('/api', courseContentRoutes);
app.use('/api', submissionRoutes);
app.use('/api', publicCourseRoutes);
app.use('/api', paymentRoutes);
app.use('/api', chatRoutes);

// Add this to start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
