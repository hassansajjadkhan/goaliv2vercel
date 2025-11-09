const express = require('express')
const router = express.Router()
const { stripeWebhook } = require('../controllers/paymentController')

// ⚠️ Must be raw for Stripe to verify signature!
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook)

module.exports = router
