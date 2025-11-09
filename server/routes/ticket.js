// server/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/by-user/:user_id', ticketController.getTicketsByUser);

module.exports = router;
