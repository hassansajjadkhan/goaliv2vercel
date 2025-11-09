// server/controllers/ticketController.js
const supabase = require('../services/supabase');

exports.getTicketsByUser = async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('tickets')
    .select(`
      id,
      event_id,
      created_at,
      qr_code_url,
      events (
        title
      )
    `)
    .eq('user_id', user_id);

  if (error) {
    console.error('Failed to fetch tickets:', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }

  // Flatten event title for easy frontend use
  const flattened = data.map(ticket => ({
    id: ticket.id,
    event_id: ticket.event_id,
    created_at: ticket.created_at,
    qr_code_url: ticket.qr_code_url,
    event_title: ticket.events?.title || 'Unknown Event'
  }));

  res.json({ tickets: flattened });
};
