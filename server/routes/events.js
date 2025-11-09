const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const supabase = require('../services/supabase')
const router = express.Router()
const {
  createEvent,
  getEvents,
  updateEventStatus,
  getAllEvents
} = require('../controllers/eventController')

router.post('/', upload.single('image'), createEvent)
router.get('/', getEvents)
router.patch('/:id/status', updateEventStatus)
router.get('/all', getAllEvents);


module.exports = router
