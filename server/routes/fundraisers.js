const express = require('express')
const multer = require('multer')


const supabase = require('../services/supabase')
const router = express.Router()
const {
  createFundraiser,
  getFundraisers,
  updateFundraiserStatus,
  getAllFundraisers
} = require('../controllers/fundraiserController')
const upload = multer({dest: 'uploads/'});

router.post('/', upload.single('image'), createFundraiser)
router.get('/', getFundraisers)
router.patch('/:id/status', updateFundraiserStatus)
// GET all fundraisers (for master admin)
router.get('/all', async (req, res) => {
  const { status } = req.query

  try {
    let query = supabase.from('fundraisers').select('*')
    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error

    res.json({ fundraisers: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch fundraisers', detail: err.message })
  }
})



module.exports = router
