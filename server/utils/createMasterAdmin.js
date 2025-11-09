// utils/createMasterAdmin.js
const supabase = require('../services/supabase')  // adjust path if needed

async function createMasterAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'master@goali.com',
    password: 'securePassword123!',
    user_metadata: { full_name: 'Master Admin' }
  })

  if (error) {
    console.error('Failed to create Supabase Auth user:', error.message)
    return
  }

  const userId = data.user.id

  const { error: dbError } = await supabase.from('users').insert({
    id: userId,
    full_name: 'Master Admin',
    email: 'master@goali.com',
    role: 'master_admin',
    team_id: null,
    signup_type: 'new_org'
  })

  if (dbError) {
    console.error('Failed to insert master admin into users table:', dbError.message)
  } else {
    console.log('✅ Master admin created successfully.')
  }
}

createMasterAdmin()
