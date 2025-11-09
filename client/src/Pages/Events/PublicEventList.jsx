"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, DollarSign, Users, Clock, Star, Search, Filter, Ticket } from "lucide-react"
import { API_BASE_URL } from "../../config"

const PublicEventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE_URL}/api/events/all`)
        const data = await res.json()

        if (res.ok) {
          setEvents(data.events || [])
        } else {
          throw new Error(data.error || "Failed to fetch events")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "free") return matchesSearch && event.price === 0
      if (filterBy === "paid") return matchesSearch && event.price > 0
      if (filterBy === "upcoming") {
        const eventDate = new Date(event.date)
        const now = new Date()
        return matchesSearch && eventDate > now
      }

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date) - new Date(b.date)
      }
      if (sortBy === "price") {
        return a.price - b.price
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 text-purple-500" />
            Discover Events
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing events happening in your area. From workshops to concerts, find your next adventure.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="free">Free Events</option>
                <option value="paid">Paid Events</option>
              </select>
            </div>

            {/* Sort */}
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event) => {
              const dateInfo = formatDate(event.date)
              const upcoming = isUpcoming(event.date)

              return (
                <div
                  key={event.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Event Image or Placeholder */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/50" />
                      </div>
                    )}

                    {/* Date Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-gray-900">{formatDate(event.date).day}</div>
                        <div className="text-xs text-gray-600 uppercase">{formatDate(event.date).month}</div>
                      </div>
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute top-4 right-4">
                      {isUpcoming(event.date) && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Upcoming
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-1 text-yellow-500 ml-2">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{dateInfo.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>50+ attending</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold text-gray-900">
                          {event.price === 0 ? "Free" : `$${event.price}`}
                        </span>
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Ticket className="w-4 h-4" />
                        {event.price === 0 ? "Join Event" : "Buy Ticket"}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-medium py-3 px-8 rounded-lg border border-gray-200 hover:border-purple-300 transition-all transform hover:scale-105 shadow-lg">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicEventList
