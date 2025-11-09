const express = require('express')
const router = express.Router()
const { createStripeAccountLink } = require('../controllers/stripeController')

router.get('/connect', createStripeAccountLink)

module.exports = router
