// app.js
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const routes = require('./routes');
const authRoutes = require('./routes/auth');
const inviteRoutes = require('./routes/invite');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');
const fundraiserRoutes = require('./routes/fundraisers');
const paymentRoutes = require('./routes/payment');
const checkoutRoutes = require('./routes/checkout');
const athleteRoutes = require('./routes/athletes');
const stripeRoutes = require('./routes/stripe');
const coachRoutes = require('./routes/coach');
const ticketRoutes = require('./routes/ticket');
const masterAdminRoutes = require('./routes/masterAdminRoutes');
const duesRoutes = require('./routes/dues')

const app = express()

app.use('/api/payments/webhook', require('./routes/stripeRawRoute'))
app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes)
app.use('/api/auth', authRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fundraisers', fundraiserRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/master', masterAdminRoutes);
app.use('/api/dues', duesRoutes)
app.use('/api/season-tickets', require('./routes/seasonRoutes'));

module.exports = app
