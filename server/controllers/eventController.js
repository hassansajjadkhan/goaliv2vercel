const supabase = require('../services/supabase')
const cloudinary = require('../services/cloudinary')
const fs = require('fs')

// Create Event (Admin or Coach)
exports.createEvent = async (req, res) => {
  const {
    title, description, location, date, price, max_tickets,
    created_by, is_season_ticket, total_games, total_price
  } = req.body;



  if (!title || !created_by) {
    return res.status(400).json({ error: 'Missing required fields: title or creator' });
  }

  if (is_season_ticket === 'true') {
    if (!total_games || isNaN(total_games)) {
      return res.status(400).json({ error: 'Total games must be a number for season tickets' });
    }
    if (!total_price || isNaN(total_price)) {
      return res.status(400).json({ error: 'Total price must be a number for season tickets' });
    }
  } else {
    if (!date) {
      return res.status(400).json({ error: 'Event date is required' });
    }
    if (!location) {
      return res.status(400).json({ error: 'Event location is required' });
    }
    if (!max_tickets || isNaN(max_tickets)) {
      return res.status(400).json({ error: 'Max tickets must be a valid number' });
    }
  }


  try {
    // Get the user to fetch team & role
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('team_id, role')
      .eq('id', created_by)
      .single()

    if (userErr || !user) throw userErr
    const { team_id, role } = user

    const status = role === 'admin' ? 'published' : 'pending'

    let image_url = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'events',
      });
      image_url = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
    }


    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        location: location === "" ? null : location,
        date: is_season_ticket === 'true'
          ? '2099-01-01'
          : (date === "" ? null : date),
        price: parseFloat(
          is_season_ticket === 'true'
            ? total_price || '0'
            : price || '0'
        ),
        max_tickets: max_tickets ? parseInt(max_tickets) : 0,
        created_by,
        team_id,
        status,
        image_url,
        is_season_ticket: is_season_ticket === 'true',
        total_games: total_games ? parseInt(total_games) : null,
      })
      .select()
      .single()

    if (error) throw error

    // Optionally log activity
    await supabase.from('activity_logs').insert({
      team_id,
      user_id: created_by,
      type: 'event',
      message: `${role} created event: ${title} (${status})`
    })

    res.status(201).json({ event })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Event creation failed', detail: err.message })
  }
}

// List Events by Team & Status
exports.getEvents = async (req, res) => {
  const { team_id, status } = req.query

  if (!team_id) return res.status(400).json({ error: 'Missing team_id' })

  try {
    let query = supabase.from('events').select('*').eq('team_id', team_id)

    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('date', { ascending: true })
    if (error) throw error

    res.json({ events: data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load events', detail: err.message })
  }
}

// Admin Approve/Reject
exports.updateEventStatus = async (req, res) => {
  const { id } = req.params
  const { status, admin_id } = req.body

  if (!['pending', 'published', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    const { data: event, error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await supabase.from('activity_logs').insert({
      team_id: event.team_id,
      user_id: admin_id,
      type: 'event',
      message: `Admin changed event status: ${event.title} → ${status}`
    })

    res.json({ event })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event status', detail: err.message })
  }
}

// List ALL Events (Master Admin)
exports.getAllEvents = async (req, res) => {
  const { status } = req.query

  try {
    let query = supabase.from('events').select('*')

    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('date', { ascending: true })

    if (error) throw error

    res.json({ events: data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all events', detail: err.message })
  }
}

