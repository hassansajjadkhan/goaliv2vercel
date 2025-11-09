"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient"
import { Link } from "react-router-dom"
import AthleteDues from "./AthleteDues"
import { API_BASE_URL } from "../../../config"

const AthleteDashboard = () => {
  const [user, setUser] = useState(null)
  const [fundraisers, setFundraisers] = useState([])
  const [tickets, setTickets] = useState([])
  const [inviteLink, setInviteLink] = useState("")
  const [loading, setLoading] = useState(true)
  const [dues, setDues] = useState([])
  useEffect(() => {
    const fetchDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)
      // Fetch unpaid dues
      const duesRes = await fetch(`\${API_BASE_URL}/api/dues/by-user/${user.id}`)
      const duesData = await duesRes.json()
      setDues((duesData.dues || []).filter(d => !d.paid))
      // ✅ Get team_id for invite
      const { data: userRecord } = await supabase.from("users").select("team_id").eq("id", user.id).single()

      if (userRecord?.team_id) {
        const invite = `${window.location.origin}/join?token=${user.id}&role=parent`
        setInviteLink(invite)
      }

      // ✅ Fetch tickets
      const res = await fetch(`\${API_BASE_URL}/api/tickets/by-user/${user.id}`)
      const data = await res.json()
      setTickets(data.tickets || [])

      setLoading(false)
    }

    fetchDashboard()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    alert("Parent invite link copied!")
  }

  const handlePayDues = async (due) => {
    try {
      const res = await fetch('\${API_BASE_URL}/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: due.amount,
          due_id: due.id
        })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to initiate payment.")
      }
    } catch (err) {
      console.error("Payment error:", err)
      alert("Error initiating payment.")
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your athlete dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Athlete Dashboard
          </h1>
          <p className="text-purple-200 text-lg">
            Manage your fundraisers, track donations, and connect with supporters
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Active Fundraisers</p>
                <p className="text-3xl font-bold text-white">
                  {fundraisers.filter((f) => f.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Event Tickets</p>
                <p className="text-3xl font-bold text-white">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Fundraisers</p>
                <p className="text-3xl font-bold text-white">{fundraisers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Unpaid Dues Section */}
          <div className="mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center mr-4">
                  💳
                </div>
                <h2 className="text-2xl font-bold text-white">Your Unpaid Dues</h2>
              </div>

              {dues.length === 0 ? (
                <p className="text-purple-200">You have no unpaid dues. Great job!</p>
              ) : (
                <div className="space-y-4">
                  {dues.map((due) => (
                    <div
                      key={due.id}
                      className="bg-white/5 rounded-lg p-4 flex items-center justify-between border border-white/10"
                    >
                      <div>
                        <p className="text-white font-semibold">Month: {due.due_month}</p>
                        <p className="text-purple-300 text-sm">Amount: ${due.amount}</p>
                      </div>
                      <button
                        onClick={() => handlePayDues(due)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md"
                      >
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Parent Invite Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Invite Parent</h2>
            </div>
            {inviteLink ? (
              <div className="space-y-4">
                <p className="text-purple-200">
                  Share this link with your parent to join your team and support your fundraising efforts.
                </p>
                <div className="flex gap-2">
                  <input
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-purple-200">No team assigned yet. Contact your coach to join a team.</p>
            )}
          </div>
        </div>

        {/* Your Tickets Section */}
        <div className="mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Your Event Tickets</h2>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No tickets purchased</h3>
                <p className="text-purple-200">You haven't purchased any event tickets yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-white/10 bg-white/5">
                    <div className="text-purple-200 font-medium text-sm">Event</div>
                    <div className="text-purple-200 font-medium text-sm">Purchase Date</div>
                    <div className="text-purple-200 font-medium text-sm">QR Code</div>
                  </div>
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="grid grid-cols-3 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-white font-medium">{ticket.event_title}</div>
                      <div className="text-purple-200">{new Date(ticket.created_at).toLocaleDateString()}</div>
                      <div>
                        <img
                          src={ticket.qr_code_url || "/placeholder.svg"}
                          alt="QR Code"
                          className="h-16 w-16 rounded-lg border border-white/20 bg-white p-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Fundraising Tips</h3>
            <p className="text-purple-200 text-sm mb-4">
              Learn effective strategies to maximize your fundraising success and engage more supporters.
            </p>
            <button className="text-purple-300 hover:text-white font-medium text-sm transition-colors">
              View Tips →
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">📊 Performance Analytics</h3>
            <p className="text-blue-200 text-sm mb-4">
              Track your fundraising performance and see detailed analytics about your campaigns.
            </p>
            <button className="text-blue-300 hover:text-white font-medium text-sm transition-colors">
              View Analytics →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default AthleteDashboard

