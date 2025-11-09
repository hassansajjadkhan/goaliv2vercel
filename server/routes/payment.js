const express = require('express')
const router = express.Router()
const { 
    stripeWebhook,
    createCheckoutSession 
} = require('../controllers/paymentController')

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/checkout', createCheckoutSession);

module.exports = router