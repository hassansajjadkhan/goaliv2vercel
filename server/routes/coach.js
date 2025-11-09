const express = require('express')
const router = express.Router()
const coachController = require('../controllers/coachController')

router.get('/fundraiser-donations', coachController.getCoachFundraiserDonations)

module.exports = router
