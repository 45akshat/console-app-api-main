const express = require('express');
const userRoutes = require('./routes/user.routes');
const shopLocationRoutes = require('./routes/shop_locations.routes'); // Updated import
const codeRoutes = require('./routes/codes.routes'); // Updated import
const referralRoutes = require('./routes/referral.routes');
const tournamentRoutes = require('./routes/tournament.routes');
const paymentRoutes = require('./routes/payment.routes'); // New import

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shops', shopLocationRoutes); // Add the /api/shops route
app.use('/api/codes', codeRoutes); // Add the /api/shops route
app.use('/api/referrals', referralRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/payments', paymentRoutes); // Add the /api/payments route

module.exports = app;
