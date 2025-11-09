const supabase = require('../services/supabase');

exports.createSeasonTicket = async (req, res) => {
  const { title, description, price, event_ids, created_by } = req.body;

  if (!title || !price || !event_ids?.length || !created_by) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', created_by)
      .single();
    if (userErr || !user) throw userErr;

    const { data: ticket, error } = await supabase
      .from('season_tickets')
      .insert({
        title,
        description,
        price,
        event_ids,
        team_id: user.team_id,
        created_by
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create season ticket', detail: err.message });
  }
};
