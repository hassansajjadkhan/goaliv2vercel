// server/routes/auth.js
const express = require('express')
const { handleSignup, joinTeamSignup } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', handleSignup);
router.post('/join-team', joinTeamSignup);

module.exports = router
