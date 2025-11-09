require('dotenv').config();
const supabase = require('../services/supabase');
const QRCode = require('qrcode');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    console.log("Stripe metadata received:", metadata);

    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', metadata.user_id)
      .single();

    if (userErr || !user) {
      console.error('Failed to fetch user/team:', userErr);
      return res.status(500).json({ error: 'Failed to get team_id' });
    }

    const newPayment = {
      user_id: metadata.user_id,
      amount: session.amount_total / 100,
      method: 'stripe',
      status: 'completed',
      fundraiser_id: metadata.fundraiser_id || null,
      event_id: metadata.event_id || null,
      team_id: user.team_id,
      type: metadata.event_id
        ? 'ticket'
        : metadata.fundraiser_id
          ? 'donation'
          : 'dues'
    };

    // ✅ Update dues once only
    if (metadata.due_id) {
      await supabase
        .from('dues')
        .update({
          paid: true,
          paid_by: metadata.user_id,
          paid_at: new Date().toISOString()
        })
        .eq('id', metadata.due_id);
    }

    const { error: insertError } = await supabase
      .from('payments')
      .insert(newPayment);

    if (insertError) {
      console.error('Failed to store payment:', insertError);
      return res.status(500).json({ error: 'Failed to store payment' });
    }

    // ✅ Update fundraiser total
    if (metadata.fundraiser_id) {
      await supabase.rpc('update_collected_amount', {
        fid: metadata.fundraiser_id
      })
    }
    // ✅ Ticket generation
    if (metadata.event_id) {
      const ticketData = {
        user_id: metadata.user_id,
        event_id: metadata.event_id,
      }

      const ticketPayload = JSON.stringify({
        user_id: metadata.user_id,
        event_id: metadata.event_id,
        purchased_at: new Date().toISOString(),
      })

      const qrDataURL = await QRCode.toDataURL(ticketPayload)

      const { error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          qr_code_url: qrDataURL
        })

      if (ticketError) {
        console.error('Failed to insert ticket:', ticketError)
      }
    }

    return res.status(200).json({ received: true })
  }

  res.status(200).json({ received: true })
}

exports.createCheckoutSession = async (req, res) => {
  const { user_id, amount, fundraiser_id, event_id, due_id } = req.body;

  try {
    // ✅ Get user's team_id
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user_id)
      .single();

    if (userError || !userRow) {
      console.error('Invalid user or missing team_id');
      return res.status(400).json({ error: 'Invalid user/team' });
    }

    // ✅ Get the team's Stripe Connect account
    const { data: teamRow, error: teamError } = await supabase
      .from('teams')
      .select('stripe_connect_id')
      .eq('id', userRow.team_id)
      .single();

    if (teamError || !teamRow?.stripe_connect_id) {
      console.error('Team Stripe Connect not found');
      return res.status(400).json({ error: 'Team has not connected Stripe' });
    }

    const platformFee = Math.floor(amount * 0.05 * 100); // 5% fee in cents

    // ✅ Debug log for testing
    console.log('Creating checkout session:', {
      amount,
      platformFee,
      destination: teamRow.stripe_connect_id,
      isFundraiser: Boolean(fundraiser_id),
      isEvent: Boolean(event_id)
    });

    // ✅ Create Checkout Session with fee split
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount * 100,
            product_data: {
              name: fundraiser_id
                ? 'Fundraiser Donation'
                : event_id
                  ? 'Event Ticket'
                  : 'Monthly Dues'
            }
          },
          quantity: 1
        }
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: teamRow.stripe_connect_id
        }
      },
      metadata: {
        user_id,
        ...(fundraiser_id && { fundraiser_id }),
        ...(event_id && { event_id }),
        ...(due_id && { due_id })
      },
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}`
    });

    return res.json({ url: session.url });

  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
