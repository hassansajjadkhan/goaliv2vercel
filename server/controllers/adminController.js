const supabase = require('../services/supabase')

const cloudinary = require('../services/cloudinary'); // adjust path if needed

exports.updateCoverImage = async (req, res) => {
  const { user_id } = req.body;
  const file = req.file; // multer populates this

  if (!user_id || !file) {
    return res.status(400).json({ error: 'Missing user_id or file' });
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'goali/admin-covers',
    });

    const imageUrl = result.secure_url;

    // Update Supabase
    const { error } = await supabase
      .from('users')
      .update({ cover_image: imageUrl })
      .eq('id', user_id);

    if (error) throw error;

    res.json({ message: 'Cover image updated successfully', url: imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload image', detail: err.message });
  }
};



exports.getAdminMetrics = async (req, res) => {
  const user_id = req.query.user_id

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    // 1. Get team ID of the admin
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single()

    if (adminError || !adminUser) throw adminError
    const team_id = adminUser.team_id

    // 2. Get fundraiser IDs for this team
    const { data: fundraisers, error: frError } = await supabase
      .from('fundraisers')
      .select('id')
      .eq('team_id', team_id)

    if (frError) throw frError
    const fundraiserIds = fundraisers.map(f => f.id)

    // 3. Get event IDs for this team
    const { data: events, error: evError } = await supabase
      .from('events')
      .select('id')
      .eq('team_id', team_id)

    if (evError) throw evError
    const eventIds = events.map(e => e.id)

    // 4. Get payments for fundraisers
    const { data: fundraiserPayments, error: pay1Err } = await supabase
      .from('payments')
      .select('amount, fundraiser_id')
      .in('fundraiser_id', fundraiserIds)

    if (pay1Err) throw pay1Err

    // 5. Get payments for events
    const { data: eventPayments, error: pay2Err } = await supabase
      .from('payments')
      .select('amount, event_id')
      .in('event_id', eventIds)

    if (pay2Err) throw pay2Err

    const totalRevenue =
      [...fundraiserPayments, ...eventPayments].reduce((sum, p) => sum + p.amount, 0)

    // 6. Active Campaigns
    const { data: activeFundraisers, error: activeErr } = await supabase
      .from('fundraisers')
      .select('id')
      .eq('team_id', team_id)
      .eq('status', 'published')

    if (activeErr) throw activeErr

    // 7. Team members
    const { data: members, error: memErr } = await supabase
      .from('users')
      .select('id')
      .eq('team_id', team_id)

    if (memErr) throw memErr

    // Placeholder: assume 80% collection rate for now
    const collectionRate = 80

    return res.json({
      totalRevenue,
      activeCampaigns: activeFundraisers.length,
      teamMembers: members.length,
      collectionRate
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load metrics', detail: err.message })
  }
}

exports.getTeamUsers = async (req, res) => {
  const user_id = req.query.user_id
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single()

    if (adminError || !adminUser) throw adminError

    const team_id = adminUser.team_id

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, email, role, phone_number, created_at')
      .eq('team_id', team_id)

    if (usersError) throw usersError

    res.json({ users })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users', detail: err.message })
  }
}

exports.getTeamPayments = async (req, res) => {
  const user_id = req.query.user_id
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single()

    if (error || !user) throw error

    const { data: payments, error: paymentError } = await supabase
      .from('payments')
      .select('amount, method, created_at, fundraiser_id, event_id')
      .eq('team_id', user.team_id)
      .order('created_at', { ascending: false })

    if (paymentError) throw paymentError

    res.json({ payments })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load payments', detail: err.message })
  }
}


exports.getTeamInvites = async (req, res) => {
  const user_id = req.query.user_id
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single()

    if (adminError || !adminUser) throw adminError

    const team_id = adminUser.team_id

    const { data: invites, error: inviteError } = await supabase
      .from('invites')
      .select('id, email, role, token, status, expires_at, created_at')
      .eq('team_id', team_id)

    if (inviteError) throw inviteError

    res.json({ invites })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch invites', detail: err.message })
  }
}

exports.getActivityLogs = async (req, res) => {
  const user_id = req.query.user_id
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single()

    if (error || !user) throw error

    const { data: logs, error: logError } = await supabase
      .from('activity_logs')
      .select('message, type, created_at')
      .eq('team_id', user.team_id)
      .order('created_at', { ascending: false })
      .limit(15)

    if (logError) throw logError

    res.json({ logs })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch activity feed', detail: err.message })
  }
}

exports.removeUserFromTeam = async (req, res) => {
  const { user_id, admin_id } = req.body

  if (!user_id || !admin_id) {
    return res.status(400).json({ error: 'Missing user_id or admin_id' })
  }

  // Check admin's role and team
  const { data: admin, error: adminErr } = await supabase
    .from('users')
    .select('role, team_id')
    .eq('id', admin_id)
    .single()

  if (adminErr || admin.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' })
  }

  // Fetch target user
  const { data: target, error: targetErr } = await supabase
    .from('users')
    .select('team_id')
    .eq('id', user_id)
    .single()

  if (targetErr || target.team_id !== admin.team_id) {
    return res.status(403).json({ error: 'Cannot remove this user' })
  }

  // Delete user
  const { error: deleteErr } = await supabase
    .from('users')
    .delete()
    .eq('id', user_id)

  if (deleteErr) {
    return res.status(500).json({ error: 'Failed to delete user' })
  }

  res.json({ message: 'User removed successfully' })
}
