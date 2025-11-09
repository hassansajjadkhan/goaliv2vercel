const express = require('express')
const router = express.Router()
const { 
    generateMonthlyDues, 
    getUserDues, 
    getTeamDues,
    payDue
} = require('../controllers/duesController')

router.post('/generate', generateMonthlyDues)
// duesRoutes.js
router.get('/by-user/:user_id', getUserDues)
router.get('/team/:team_id', getTeamDues);
router.post('/pay', payDue)


module.exports = router