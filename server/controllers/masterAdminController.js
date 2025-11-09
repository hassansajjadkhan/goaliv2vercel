const supabase = require('../services/supabase')

// 1. Get global metrics
exports.getGlobalMetrics = async (req, res) => {
    try {
        // Fundraiser payments
        const { data: fundraiserPayments, error: pay1Err } = await supabase
            .from('payments')
            .select('amount')
            .not('fundraiser_id', 'is', null)

        if (pay1Err) throw pay1Err

        // Event payments
        const { data: eventPayments, error: pay2Err } = await supabase
            .from('payments')
            .select('amount')
            .not('event_id', 'is', null)

        if (pay2Err) throw pay2Err

        const totalRevenue =
            [...fundraiserPayments, ...eventPayments].reduce((sum, p) => sum + p.amount, 0)

        // Active campaigns = published fundraisers + published events
        const [{ data: activeFundraisers, error: frErr }, { data: activeEvents, error: evErr }] = await Promise.all([
            supabase.from('fundraisers').select('id').eq('status', 'published'),
            supabase.from('events').select('id').eq('status', 'published'),
        ])

        if (frErr) throw frErr
        if (evErr) throw evErr

        const activeCampaigns = activeFundraisers.length + activeEvents.length


        // All users (excluding master_admin itself)
        const { data: users, error: usersErr } = await supabase
            .from('users')
            .select('id')
            .neq('role', 'master_admin')

        if (usersErr) throw usersErr

        // Count of unique teams
        const { data: teams, error: teamsErr } = await supabase
            .from('teams')
            .select('id')

        if (teamsErr) throw teamsErr

        // Placeholder
        const collectionRate = 75

        return res.json({
            totalRevenue,
            activeCampaigns,
            totalUsers: users.length,
            totalTeams: teams.length,
            collectionRate
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to load global metrics', detail: err.message })
    }
}

// 2. Get all users (excluding master_admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, full_name, email, role, phone_number, created_at')
            .neq('role', 'master_admin')

        if (error) throw error

        res.json({ users })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', detail: err.message })
    }
}

// 3. Get all invites
exports.getAllInvites = async (req, res) => {
    try {
        const { data: invites, error } = await supabase
            .from('invites')
            .select('id, email, role, token, status, expires_at, created_at')

        if (error) throw error

        res.json({ invites })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch invites', detail: err.message })
    }
}

// 4. Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('amount, method, created_at, fundraiser_id, event_id, team_id')
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({ payments })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments', detail: err.message })
    }
}

// 5. Get recent activity logs globally
exports.getAllLogs = async (req, res) => {
    try {
        const { data: logs, error } = await supabase
            .from('activity_logs')
            .select('message, type, created_at')
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) throw error

        res.json({ logs })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch activity feed', detail: err.message })
    }
}

