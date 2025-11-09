// server/controllers/coachController.js
const supabase = require('../services/supabase')

exports.getCoachFundraiserDonations = async (req, res) => {
  const { user_id } = req.query

  try {
    // Step 1: Get all fundraisers by this coach
    const { data: fundraisers, error: fundraiserError } = await supabase
      .from('fundraisers')
      .select('id, title, goal_amount, created_at')
      .eq('owner_id', user_id)

    if (fundraiserError) throw fundraiserError

    // Step 2: For each fundraiser, get related donations
    const donationPromises = fundraisers.map(async (f) => {
      const { data: donations, error: donationError } = await supabase
        .from('payments')
        .select('id, user_id, amount, created_at')
        .eq('fundraiser_id', f.id)
        .eq('status', 'completed')

      const totalRaised = donations?.reduce((sum, d) => sum + d.amount, 0) || 0

      return {
        fundraiser: f,
        donations: donations || [],
        totalRaised
      }
    })

    const result = await Promise.all(donationPromises)

    return res.json({ fundraisers: result })
  } catch (err) {
    console.error('Error fetching coach donations:', err)
    return res.status(500).json({ error: 'Failed to fetch donations' })
  }
}
