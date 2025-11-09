"use client"

import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../../config"

const AdminDuesList = ({ teamId }) => {
  const [dues, setDues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await fetch(`\${API_BASE_URL}/api/dues/team/${teamId}`)
        const data = await res.json()
        if (res.ok) setDues(data.dues)
        else console.error(data.error)
      } catch (err) {
        console.error("Failed to load dues", err)
      } finally {
        setLoading(false)
      }
    }

    if (teamId) fetchDues()
  }, [teamId])

  if (loading) return <p>Loading dues...</p>

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Generated Dues</h2>
      {dues.length === 0 ? (
        <p>No dues generated yet.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-2">Athlete</th>
              <th className="p-2">Parent</th>
              <th className="p-2">Month</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Paid</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due.id} className="border-t">
                <td className="p-2">{due.athlete?.full_name || "—"}</td>
                <td className="p-2">{due.parent?.full_name || "—"}</td>
                <td className="p-2">{due.due_month}</td>
                <td className="p-2">${due.amount}</td>
                <td className="p-2">{due.paid ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminDuesList

