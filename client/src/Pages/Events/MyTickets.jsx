"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: ticketData, error } = await supabase
        .from("tickets")
        .select("id, event_id, qr_code_url, created_at, events ( title, date, location )")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch tickets:", error)
      } else {
        setTickets(ticketData)
      }
      setLoading(false)
    }

    fetchTickets()
  }, [])

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mb-6"></div>
            <p className="text-white/80 text-lg font-medium">Loading your tickets...</p>
            <p className="text-white/60 text-sm mt-2">Please wait while we fetch your event tickets</p>
          </div>
        </div>
      </div>
    )

  if (tickets.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Tickets Yet</h3>
            <p className="text-white/70 text-lg mb-8">
              You haven't purchased any tickets yet. Start exploring amazing events!
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white/80 text-sm">🎫 Browse events and purchase tickets to see them here</p>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            My Tickets
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Your digital tickets collection. Show QR codes at events for quick entry.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">{tickets.length} Active Tickets</span>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tickets.map((ticket) => {
            const eventDate = new Date(ticket.events?.date)
            const purchaseDate = new Date(ticket.created_at)
            const isUpcoming = eventDate > new Date()

            return (
              <div
                key={ticket.id}
                className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {isUpcoming ? "🎫 Upcoming" : "📅 Past Event"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {ticket.events?.title}
                    </h3>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-white/80">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">
                        {eventDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-white/60">
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-white/80">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{ticket.events?.location}</p>
                      <p className="text-sm text-white/60">Event Location</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-4">
                  <div className="text-center mb-3">
                    <p className="text-white/80 text-sm font-medium mb-2">Entry QR Code</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 mx-auto max-w-[200px]">
                    <img
                      src={ticket.qr_code_url || "/placeholder.svg"}
                      alt="QR Code"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <p className="text-white/60 text-xs">Show this code at the event entrance</p>
                  </div>
                </div>

                {/* Purchase Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-white/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Purchased: {purchaseDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 text-xs font-medium">Verified</span>
                  </div>
                </div>

                {/* Ticket ID */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">Ticket ID: {ticket.id.slice(0, 8)}...</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
            <h4 className="text-white font-semibold mb-2">💡 Ticket Tips</h4>
            <p className="text-white/70 text-sm">
              Save your tickets offline by taking screenshots. Arrive early and have your QR code ready for quick
              scanning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTickets
