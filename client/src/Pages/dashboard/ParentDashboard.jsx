"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { Link } from "react-router-dom"
import { API_BASE_URL } from "../../config"

const ParentDashboard = () => {
  const [user, setUser] = useState(null)
  const [athleteChild, setAthleteChild] = useState(null)
  const [recentPayments, setRecentPayments] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [unpaidDues, setUnpaidDues] = useState([])


  useEffect(() => {
    const fetchDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Fetch user's team info to find athlete child
      const { data: userRecord } = await supabase.from("users").select("team_id").eq("id", user.id).single()

      if (userRecord?.team_id) {
        // Find athlete in same team (simplified - in real app you'd have parent-child relationships)
        const { data: athletes } = await supabase
          .from("users")
          .select("*")
          .eq("team_id", userRecord.team_id)
          .eq("role", "athlete")
          .limit(1)

        if (athletes && athletes.length > 0) {
          setAthleteChild(athletes[0])
        }
        // ✅ Fetch unpaid dues for that athlete
        const duesRes = await fetch(`${API_BASE_URL}/api/dues/by-user/${athletes[0].id}`)
        const duesData = await duesRes.json()
        setUnpaidDues(duesData.dues || [])
      }


      // Mock recent payments data
      setRecentPayments([
        { id: 1, description: "Team Registration Fee", amount: 150, date: "2024-01-15", status: "completed" },
        { id: 2, description: "Equipment Fund", amount: 75, date: "2024-01-10", status: "completed" },
      ])

      // Mock upcoming events
      setUpcomingEvents([
        { id: 1, title: "Championship Game", date: "2024-02-15", location: "Main Stadium" },
        { id: 2, title: "Team Fundraiser Dinner", date: "2024-02-20", location: "Community Center" },
      ])

      setLoading(false)
    }

    fetchDashboard()
  }, [])

  const handlePayDues = async (due) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,        // parent paying
          due_id: due.id,
          amount: due.amount
        })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to initiate payment.")
      }
    } catch (err) {
      console.error("Parent Payment Error:", err)
      alert("Error initiating payment.")
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">Loading Parent Dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            Parent Dashboard
          </h1>
          <p className="text-white/70 text-lg">View athlete progress, make payments, and purchase tickets.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Athlete Child</h3>
            <p className="text-white/60 text-sm">{athleteChild ? athleteChild.full_name : "No athlete found"}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <span className="text-blue-400 text-sm font-medium">This Month</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Total Payments</h3>
            <p className="text-white/60 text-sm">${recentPayments.reduce((sum, payment) => sum + payment.amount, 0)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <span className="text-purple-400 text-sm font-medium">Upcoming</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Events</h3>
            <p className="text-white/60 text-sm">{upcomingEvents.length} events this month</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {unpaidDues.length > 0 && (
            <div className="bg-white/10 p-6 mt-10 rounded-xl border border-white/20">
              <h2 className="text-white text-xl font-semibold mb-4">
                Dues for {athleteChild?.full_name}
              </h2>
              <div className="space-y-3">
                {unpaidDues.map((due) => (
                  <div
                    key={due.id}
                    className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div>
                      <p className="text-white font-semibold">Month: {due.due_month}</p>
                      <p className="text-purple-300 text-sm">Amount: ${due.amount}</p>
                      {due.paid && (
                        <p className="text-green-400 text-xs mt-1">Paid on {new Date(due.paid_at).toLocaleDateString()}</p>
                      )}
                    </div>

                    {due.paid ? (
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        ✅ Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayDues(due)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Recent Payments */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Payments</h2>
              <Link
                to="/parent/payments"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.description}</p>
                      <p className="text-white/60 text-sm">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${payment.amount}</p>
                    <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <Link to="/events" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-white/60 text-sm">{event.location}</p>
                      </div>
                    </div>
                    <span className="text-blue-400 text-sm font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/events"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Purchase Tickets</h3>
                <p className="text-white/80 text-sm">Buy tickets for upcoming events</p>
              </div>
            </div>
          </Link>

          <Link
            to="/fundraisers"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Support Fundraisers</h3>
                <p className="text-white/80 text-sm">Donate to team fundraising campaigns</p>
              </div>
            </div>
          </Link>

          <Link
            to="/parent/payments"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Payment History</h3>
                <p className="text-white/80 text-sm">View all payments and receipts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ParentDashboard
