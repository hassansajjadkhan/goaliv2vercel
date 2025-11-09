// server/controllers/inviteController.js
const { v4: uuidv4 } = require('uuid')
const supabase = require('../services/supabase')

exports.sendInvite = async (req, res) => {
  const { email, role, team_id, sent_by } = req.body

  if (!email || !role || !team_id || !sent_by) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // 1. Check if invite already exists
    const { data: existing, error: existingError } = await supabase
      .from('invites')
      .select('*')
      .eq('email', email)
      .eq('team_id', team_id)
      .eq('status', 'pending')
      .single()

    if (existing) {
      return res.status(409).json({ error: 'An invite for this email already exists.' })
    }

    // 2. Generate token and expiration
    const token = uuidv4()
    const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours

    // 3. Insert invite
    const { error: insertError } = await supabase
      .from('invites')
      .insert({
        email,
        role,
        sent_by,
        team_id,
        token,
        expires_at,
        status: 'pending'
      })

    await supabase.from('activity_logs').insert({
      team_id,
      user_id: sent_by,
      type: 'invite',
      message: `Sent invite to ${email} as ${role}`
    })


    if (insertError) throw insertError

    const inviteLink = `http://localhost:5173/join?token=${token}`

    return res.status(201).json({ message: 'Invite sent', inviteLink })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send invite', detail: err.message })
  }
}
