const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const supabase = require('../services/supabase');

exports.createFundraiserCheckout = async (req, res) => {
  const { amount, fundraiser_id, user_id, email } = req.body;

  if (!amount || !fundraiser_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 🔍 Step 1: Get fundraiser
    const { data: fundraiser, error: fundraiserError } = await supabase
      .from('fundraisers')
      .select('owner_id')
      .eq('id', fundraiser_id)
      .single();

    if (fundraiserError || !fundraiser) {
      console.error('[Stripe] Fundraiser not found:', fundraiserError);
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    // 🔍 Step 2: Get owner’s team
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', fundraiser.owner_id)
      .single();

    if (userError || !user || !user.team_id) {
      console.error('[Stripe] Owner or team not found:', userError);
      return res.status(404).json({ error: 'Team not found for this fundraiser owner' });
    }

    // 🔍 Step 3: Get stripe_connect_id
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('stripe_connect_id')
      .eq('id', user.team_id)
      .single();
    console.log("Fundraiser owner ID:", fundraiser.owner_id);
    console.log("Fundraiser owner's team ID:", user.team_id);
    console.log("Team stripe_connect_id:", team.stripe_connect_id);


    if (teamError || !team || !team.stripe_connect_id) {
      console.error('[Stripe] Team Stripe Connect ID missing:', teamError);
      return res.status(400).json({ error: 'Team is not connected to Stripe' });
    }

    // 🔍 Step 4: Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Donation to Fundraiser' },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        fundraiser_id,
        user_id: user_id || '',
        email: email || ''
      },
      payment_intent_data: {
        application_fee_amount: Math.round(amount * 100 * 0.05), // 5%
        transfer_data: {
          destination: team.stripe_connect_id
        }
      },
      success_url: `http://localhost:5173/fundraisers/${fundraiser_id}`,
      cancel_url: `http://localhost:5173/fundraisers/${fundraiser_id}?cancelled=true`
    });

    console.log('[Stripe] Session created:', session.id);
    return res.json({ url: session.url });

  } catch (err) {
    console.error('[Stripe] Unhandled error during session creation:', err);

    let clientMessage = 'Failed to create Stripe session. Please try again later.';
    if (err.type === 'StripeInvalidRequestError' && err.raw?.message) {
      clientMessage = err.raw.message; // Use Stripe's specific error
    }

    return res.status(500).json({
      error: clientMessage,
      code: err.code || 'stripe_error',
      raw: err.raw || null,
    });
  }
};



exports.createEventCheckout = async (req, res) => {
  const { event_id, user_id, email, amount } = req.body;

  if (!event_id || !amount) {
    return res.status(400).json({ error: 'Missing event ID or amount' });
  }

  try {
    // Step 1: Get event to find owner
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      console.error('[Stripe] Event not found:', eventError);
      return res.status(404).json({ error: 'Event not found' });
    }

    // Step 2: Get owner's team
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', event.created_by)
      .single();

    if (userError || !user || !user.team_id) {
      console.error('[Stripe] Owner or team not found:', userError);
      return res.status(404).json({ error: 'Team not found for this event owner' });
    }

    // Step 3: Get stripe_connect_id
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('stripe_connect_id')
      .eq('id', user.team_id)
      .single();

    console.log("Event owner ID:", event.created_by);
    console.log("Event owner's team ID:", user.team_id);
    console.log("Team stripe_connect_id:", team.stripe_connect_id);

    if (teamError || !team || !team.stripe_connect_id) {
      console.error('[Stripe] Team Stripe Connect ID missing:', teamError);
      return res.status(400).json({ error: 'Team is not connected to Stripe' });
    }

    // Step 4: Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Event Ticket',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        event_id,
        user_id: user_id || '',
        email: email || '',
      },
      payment_intent_data: {
        application_fee_amount: Math.round(amount * 100 * 0.05), // 5% platform fee
        transfer_data: {
          destination: team.stripe_connect_id
        }
      },
      success_url: `http://localhost:5173/events/${event_id}`,
      cancel_url: `http://localhost:5173/events/${event_id}?cancelled=true`,
    });

    console.log('[Stripe] Event session created:', session.id);
    res.json({ url: session.url });

  } catch (err) {
    console.error('[Stripe] Unhandled error during event session creation:', err);
    res.status(500).json({ error: 'Failed to create Stripe session', details: err.message });
  }
};
