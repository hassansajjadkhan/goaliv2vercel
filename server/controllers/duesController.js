const supabase = require('../services/supabase')
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



app.use(express.json());

exports.generateMonthlyDues = async (req, res) => {
    const { team_id, amount, due_month } = req.body;
    console.log("Received payload:", { team_id, amount, due_month });

    if (!due_month || !amount || !team_id) {
        return res.status(400).json({ error: 'Missing required fields: due_month, amount, team_id' });
    }

    try {
        const { data: athletes, error } = await supabase
            .from('users')
            .select('id')
            .eq('team_id', team_id)
            .eq('role', 'athlete');

        if (error || !athletes || athletes.length === 0) {
            return res.status(404).json({ error: 'No athletes found for this team' });
        }

        const duesToInsert = [];

        for (const athlete of athletes) {
            const { data: mapping, error: parentError } = await supabase
                .from('athlete_parents')
                .select('parent_user_id')
                .eq('athlete_user_id', athlete.id)
                .maybeSingle();

            if (parentError) continue;

            duesToInsert.push({
                athlete_user_id: athlete.id,
                parent_user_id: mapping?.parent_user_id || null,
                team_id,
                due_month: due_month,
                amount,
            });
        }

        for (const due of duesToInsert) {
            const { data: existing } = await supabase
                .from('dues')
                .select('id')
                .eq('athlete_user_id', due.athlete_user_id)
                .eq('due_month', due.due_month)
                .maybeSingle();

            if (!existing) {
                await supabase.from('dues').insert([due]);
            }
        }

        res.json({ message: `Dues generated for ${duesToInsert.length} athletes.` });
    } catch (err) {
        console.error('[Generate Dues Error]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getUserDues = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id' });
    }

    try {
        const { data, error } = await supabase
            .from('dues')
            .select(`
        *,
        athlete:users!dues_athlete_user_id_fkey (
          full_name
        ),
        parent:users!dues_parent_user_id_fkey (
          full_name
        )
      `)
            .or(`athlete_user_id.eq.${user_id},parent_user_id.eq.${user_id}`)

        if (error) {
            console.error('[Get User Dues Error]', error.message)
            return res.status(500).json({ error: 'Failed to fetch dues' })
        }

        res.json({ dues: data });
    } catch (err) {
        console.error('[Internal Error]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// In duesController.js
exports.getTeamDues = async (req, res) => {
  const { team_id } = req.params;

  const { data, error } = await supabase
    .from('dues')
    .select(`
      *,
      athlete:users!dues_athlete_user_id_fkey(full_name),
      parent:users!dues_parent_user_id_fkey(full_name)
    `)
    .eq('team_id', team_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Get Team Dues Error]', error.message);
    return res.status(500).json({ error: 'Failed to fetch team dues' });
  }

  res.json({ dues: data });
};

exports.payDue = async (req, res) => {
  const { due_id } = req.params

  const { data: due, error } = await supabase
    .from('dues')
    .select(`
      id, amount, athlete_user_id,
      athlete:users!dues_athlete_user_id_fkey (email)
    `)
    .eq('id', due_id)
    .single()

  if (error || !due) return res.status(404).json({ error: 'Due not found' })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: due.athlete.email,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Monthly Dues - ${due_id}`,
        },
        unit_amount: Math.round(due.amount * 100), // in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/dues/success`,
    cancel_url: `${process.env.CLIENT_URL}/dues/cancel`,
    metadata: {
      due_id: due.id,
      athlete_user_id: due.athlete_user_id
    }
  })

  res.json({ url: session.url })
}
