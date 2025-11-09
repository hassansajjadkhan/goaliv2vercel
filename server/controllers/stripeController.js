const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const supabase = require('../services/supabase')

exports.createStripeAccountLink = async (req, res) => {
  const { user_id } = req.query

  // 1. Get the team
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('team_id')
    .eq('id', user_id)
    .single()

  if (userError || !user) {
    return res.status(400).json({ error: 'Invalid user or no team found' })
  }

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', user.team_id)
    .single()

  // 2. If team already has a Stripe account, skip
  if (team.stripe_connect_id) {
    return res.status(200).json({ message: 'Already connected' })
  }

  // 3. Create Stripe account
  const account = await stripe.accounts.create({ type: 'express' })

  // 4. Save connect ID
  await supabase
    .from('teams')
    .update({ stripe_connect_id: account.id })
    .eq('id', team.id)

  // 5. Create onboarding link
  const origin = process.env.FRONTEND_URL || 'http://localhost:5173'

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/dashboard/admin`,
    return_url: `${origin}/dashboard/admin`,
    type: 'account_onboarding'
  })

  res.json({ url: accountLink.url })
}
