// server/routes/invite.js
const express = require('express')
const { sendInvite } = require('../controllers/inviteController')

const router = express.Router()

router.post('/send', sendInvite)

module.exports = router