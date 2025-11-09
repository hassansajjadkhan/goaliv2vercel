import { useParams } from 'react-router-dom'
import AdminDashboard from '../dashboard/Admin/AdminDashboard'
import CoachDashboard from '../dashboard/Coach/CoachDashboard'
import ParentDashboard from '../dashboard/ParentDashboard'
import AthleteDashboard from '../dashboard/Athlete/AthleteDashboard'
import MasterAdminDashboard from '../dashboard/MasterAdmin/MasterAdminDashboard'

const DashboardRedirect = () => {
  const { role } = useParams()

  switch (role) {
    case 'master_admin':
      return <MasterAdminDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'coach':
      return <CoachDashboard />
    case 'parent':
      return <ParentDashboard />
    case 'athlete':
      return <AthleteDashboard />
    default:
      return <div>Invalid role</div>
  }
}

export default DashboardRedirect
