const express = require('express');
const router = express.Router();
const { createSeasonTicket } = require('../controllers/seasonTicketController');

router.post('/', createSeasonTicket); // POST /api/season-tickets

module.exports = router;
