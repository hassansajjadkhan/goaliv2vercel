import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { API_BASE_URL } from "../../config"

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ticketsSold, setTicketsSold] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)


  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single()
      if (!error) setEvent(data)
      setLoading(false)
    }

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    const fetchTicketCount = async () => {
      const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("event_id", id)
      setTicketsSold(count || 0)
    }

    fetchEvent()
    fetchUser()
    fetchTicketCount()
  }, [id])

  const handleBuyTicket = async () => {
    if (!event) return

    const res = await fetch(`${API_BASE_URL}/api/checkout/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: id,
        user_id: user?.id || null,
        email: user?.email || null,
        amount: event.price,
      }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Failed to create Stripe session")
    }
  }

  const handleShareEvent = async () => {
    try {
      const currentUrl = window.location.href

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea")
        textArea.value = currentUrl
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
      }

      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      alert("Failed to copy URL to clipboard")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mb-4"></div>
            <p className="text-white/80 text-lg">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
            <p className="text-white/70">The event you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isUpcoming = event?.is_season_ticket || eventDate > new Date();
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Event Hero Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-8 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.02]">
            {/* Event Header with Optional Image */}
            <div className="relative h-64 overflow-hidden">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 flex items-center justify-center">
                  <div className="text-6xl">🎭</div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/30" />

              {/* Centered Tag */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  {isUpcoming ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      <span className="text-white font-medium">Upcoming Event</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      <span className="text-white/70 font-medium">Past Event</span>
                    </>
                  )}
                </div>
              </div>
              {/* Share Button - positioned in top right of header */}
              <div className="absolute top-4 right-4 Z-20">
                <button
                  onClick={handleShareEvent}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400 font-medium text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-white group-hover:text-purple-200 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      <span className="text-white group-hover:text-purple-200 font-medium text-sm transition-colors">
                        Share
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Event Content */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Left Column - Event Details */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">{event.description}</p>
                  {/* Event Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Date & Time */}
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {event.is_season_ticket ? "Season Ticket" : formattedDate}
                        </p>
                        <p className="text-white/60 text-sm">
                          {event.is_season_ticket ? "Multiple Games" : formattedTime}
                        </p>
                      </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <p className="text-white font-semibold">Location</p>
                        <p className="text-white/60 text-sm">
                          {event.is_season_ticket ? "Multiple Venues" : event.location}
                        </p>

                      </div>
                    </div>
                    {!event.is_season_ticket && (
                      <div className="text-center mb-4">
                        <p className="text-white/80 text-sm mb-1">Tickets Sold</p>
                        <div className="text-white font-bold text-lg">
                          {ticketsSold} / {event.max_tickets}
                        </div>
                        {/* Optional Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${(ticketsSold / event.max_tickets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
                {/* Right Column - Ticket Purchase */}
                <div className="lg:w-80">
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 sticky top-8">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {event.price === 0 ? "FREE" : `$${event.price}`}
                      </div>
                      <p className="text-white/60 text-sm">{event.price === 0 ? "No cost to attend" : "Per ticket"}</p>
                    </div>
                    {/* Ticket Features */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-white/80 text-sm">
                        <svg className="w-4 h-4 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Digital ticket with QR code
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <svg className="w-4 h-4 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Instant email confirmation
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <svg className="w-4 h-4 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Secure payment processing
                      </div>
                    </div>
                    {isUpcoming ? (
                      event.is_season_ticket || ticketsSold < event.max_tickets ? (
                        <button
                          onClick={handleBuyTicket}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span>{event.price === 0 ? "Get Free Ticket" : "Buy Ticket with Stripe"}</span>
                        </button>
                      ) : (
                        <div className="w-full bg-gray-600/50 text-white/60 font-bold py-4 px-6 rounded-xl text-center cursor-not-allowed">
                          Sold Out
                        </div>
                      )
                    ) : (
                      <div className="w-full bg-gray-600/50 text-white/60 font-bold py-4 px-6 rounded-xl text-center cursor-not-allowed">
                        Event Has Ended
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-white/50 text-xs">Powered by Stripe • Secure checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Organizer */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Event Organizer
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{event.title.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Event Team</p>
                  <p className="text-white/60 text-sm">Professional organizer</p>
                </div>
              </div>
            </div>
            {/* Event Stats */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Event Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Event ID</span>
                  <span className="text-white font-mono text-sm">#{event.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Category</span>
                  <span className="text-white">General Event</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${isUpcoming
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                  >
                    {isUpcoming ? "Active" : "Ended"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
