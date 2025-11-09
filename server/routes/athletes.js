const express = require('express')
const router = express.Router()
const {
  createAthlete,
  getAthletes,
  updateAthlete,
  deleteAthlete
} = require('../controllers/athleteController')

router.post('/create', createAthlete);
router.get('/by-team/:team_id', getAthletes);  // ← this MUST be here
router.put('/:id', updateAthlete);
router.delete('/:id', deleteAthlete);


module.exports = router;