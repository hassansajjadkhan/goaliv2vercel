import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../../config"

const AthleteDues = ({ userId }) => {
  const [dues, setDues] = useState([])

  useEffect(() => {
    const fetchDues = async () => {
      const res = await fetch(`\${API_BASE_URL}/api/dues/by-user/${userId}`)
      const data = await res.json()
      setDues(data.dues || [])
    }

    if (userId) fetchDues()
  }, [userId])

  const payDue = async (due) => {
    const confirm = window.confirm(`Pay $${due.amount} for ${due.due_month}?`)
    if (!confirm) return

    const res = await fetch("\${API_BASE_URL}/api/dues/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        due_id: due.id,
        user_id: userId,
        amount: due.amount,
        method: "manual", // or "stripe" if you integrate Stripe later
      }),
    })

    if (res.ok) {
      alert("Payment successful")
      setDues((prev) =>
        prev.map((d) => (d.id === due.id ? { ...d, paid: true } : d))
      )
    } else {
      alert("Payment failed")
    }
  }

  if (dues.length === 0) {
    return <p className="text-purple-200">No dues found.</p>
  }

  return (
    <div className="space-y-4">
      {dues.map((due) => (
        <div
          key={due.id}
          className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/10"
        >
          <div>
            <p className="text-white font-semibold">
              {due.due_month} - ${due.amount}
            </p>
            <p className="text-purple-200 text-sm">
              {due.paid ? "Paid" : "Unpaid"}
            </p>
          </div>
          {!due.paid && (
            <button
              onClick={() => payDue(due)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default AthleteDues

