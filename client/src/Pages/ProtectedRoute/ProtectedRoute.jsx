import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role: routeRoleParam } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        navigate('/login')
        return
      }

      const actualRole = data.role

      // 🔐 If this route requires a specific role
      if (requiredRole && actualRole !== requiredRole) {
        navigate(`/dashboard/${actualRole}`)
        return
      }

      // If this route uses :role in the URL
      if (routeRoleParam && actualRole !== routeRoleParam) {
        navigate(`/dashboard/${actualRole}`)
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [navigate, requiredRole, routeRoleParam])

  if (loading) {
    return <div className="p-4 text-center">Checking permissions...</div>
  }

  return children
}

export default ProtectedRoute
