const express = require('express')
const router = express.Router()
const { createFundraiserCheckout, createEventCheckout } = require('../controllers/checkoutController')

router.post('/fundraiser', createFundraiserCheckout);
router.post('/event', createEventCheckout);


module.exports = router
