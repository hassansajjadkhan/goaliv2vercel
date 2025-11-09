const supabase = require('../services/supabase')
const cloudinary = require('../services/cloudinary')
const fs = require('fs');
// Create Fundraiser (Coach or Admin)
exports.createFundraiser = async (req, res) => {
  const { title, description, goal_amount, owner_id } = req.body

  if (!title || !goal_amount || !owner_id) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('team_id, role')
      .eq('id', owner_id)
      .single()

    if (userError || !user) throw userError

    const status = user.role === 'admin' ? 'published' : 'pending'

    let image_url = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'fundraisers',
      });
      image_url = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // delete temp file
    }

    const { data: fundraiser, error } = await supabase
      .from('fundraisers')
      .insert({
        title,
        description,
        goal_amount,
        collected_amount: 0,
        team_id: user.team_id,
        owner_id,
        status,
        image_url
      })
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('activity_logs').insert({
      team_id: user.team_id,
      user_id: owner_id,
      type: 'fundraiser',
      message: `${user.role} created fundraiser: ${title} (${status})`
    })

    res.status(201).json({ fundraiser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create fundraiser', detail: err.message })
  }
}

// Get Fundraisers by team/status
exports.getFundraisers = async (req, res) => {
  const { team_id, status } = req.query
  if (!team_id) return res.status(400).json({ error: 'Missing team_id' })

  try {
    let query = supabase.from('fundraisers').select('*').eq('team_id', team_id)
    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error

    res.json({ fundraisers: data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fundraisers', detail: err.message })
  }
}

// Admin approval toggle
exports.updateFundraiserStatus = async (req, res) => {
  const { id } = req.params
  const { status, admin_id } = req.body

  if (!['pending', 'published', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    const { data: updated, error } = await supabase
      .from('fundraisers')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await supabase.from('activity_logs').insert({
      team_id: updated.team_id,
      user_id: admin_id,
      type: 'fundraiser',
      message: `Admin changed fundraiser status: ${updated.title} → ${status}`
    })

    res.json({ fundraiser: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update fundraiser', detail: err.message })
  }
}

exports.updateFundraiser = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { error } = await supabase
    .from('fundraisers')
    .update(updates)
    .eq('id', id)

  if (error) return res.status(500).json({ error: 'Failed to update fundraiser' })

  res.json({ message: 'Fundraiser updated successfully' })
}

// GET all fundraisers (for master admin)
exports.getAllFundraisers = async (req, res) => {
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
}
