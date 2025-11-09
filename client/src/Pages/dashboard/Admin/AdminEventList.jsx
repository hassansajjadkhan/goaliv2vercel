"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../supabaseClient"
import { Link } from "react-router-dom"
import { API_BASE_URL } from "../../../config"
import {
  Calendar,
  MapPin,
  DollarSign,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
  AlertCircle,
} from "lucide-react"

const AdminEventList = () => {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [ticketCounts, setTicketCounts] = useState({})

  useEffect(() => {
    const fetchEvents = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("users").select("team_id").eq("id", user.id).single()

      let url = `\${API_BASE_URL}/api/events?team_id=${profile.team_id}`
      if (filter !== "all") url += `&status=${filter}`

      const res = await fetch(url)
      const json = await res.json()
      setEvents(json.events || [])
      setLoading(false)
    }

    fetchEvents()
  }, [filter])

  useEffect(() => {
    const fetchTicketCounts = async () => {
      const counts = {}
      for (const ev of events) {
        const { count, error } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("event_id", ev.id)
        if (!error) counts[ev.id] = count
      }
      setTicketCounts(counts)
    }

    if (events?.length > 0) fetchTicketCounts()
  }, [events])

  const handleStatusChange = async (eventId, newStatus) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const res = await fetch(`\${API_BASE_URL}/api/events/${eventId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, admin_id: user.id }),
    })

    if (res.ok) {
      setEvents((prev) => prev.map((ev) => (ev.id === eventId ? { ...ev, status: newStatus } : ev)))
    } else {
      alert("Failed to update status")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const filterOptions = [
    { value: "all", label: "All Events", count: events.length },
    { value: "pending", label: "Pending", count: events.filter((e) => e.status === "pending").length },
    { value: "published", label: "Published", count: events.filter((e) => e.status === "published").length },
    { value: "closed", label: "Closed", count: events.filter((e) => e.status === "closed").length },
  ]

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-center space-x-4">
          <motion.div
            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <span className="text-gray-600 font-body">Loading events...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-title text-gray-900 mb-2">Event Management</h2>
          <p className="text-gray-600 font-body">Manage and monitor all your fundraising events</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="bg-transparent border-none outline-none font-body text-gray-700 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filterOptions.slice(1).map((stat, index) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-2xl font-title text-gray-900">{stat.count}</span>
            </div>
            <p className="text-sm font-body text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-header text-gray-900">
            {filter === "all" ? "All Events" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Events`} (
            {events.length})
          </h3>
        </div>

        {events.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-header text-gray-900 mb-2">No events found</h4>
            <p className="text-gray-500 font-body">
              {filter === "all" ? "Create your first event to get started" : `No ${filter} events at the moment`}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Event Details</th>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Date & Location</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Price</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Status</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Tickets Sold</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {events.map((ev, index) => (
                    <motion.tr
                      key={ev.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Event Details */}
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="font-header text-gray-900 mb-1">{ev.title}</h4>
                          <p className="text-sm text-gray-600 font-body line-clamp-2">{ev.description}</p>
                        </div>
                      </td>

                      {/* Date & Location */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-body text-gray-700">
                              {new Date(ev.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-body text-gray-700">{ev.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-header text-gray-900">{ev.price}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getStatusColor(
                            ev.status,
                          )}`}
                        >
                          {getStatusIcon(ev.status)}
                          <span className="capitalize">{ev.status}</span>
                        </span>
                      </td>

                      {/* Tickets Sold */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Ticket className="h-4 w-4 text-blue-600" />
                          <span className="font-header text-gray-900">
                            {ticketCounts[ev.id] !== undefined ? ticketCounts[ev.id] : "..."}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          {ev.status === "pending" && (
                            <motion.button
                              onClick={() => handleStatusChange(ev.id, "published")}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-green-700 transition-colors flex items-center space-x-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Approve</span>
                            </motion.button>
                          )}

                          {ev.status !== "closed" && (
                            <motion.button
                              onClick={() => handleStatusChange(ev.id, "closed")}
                              className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-gray-700 transition-colors flex items-center space-x-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Close</span>
                            </motion.button>
                          )}

                          <Link
                            to={`/events/${ev.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-blue-700 transition-colors flex items-center space-x-1 no-underline"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-header text-gray-900 mb-2">Event Summary</h4>
              <p className="text-sm text-gray-600 font-body">Overview of your event performance</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-title text-blue-900">
                  {Object.values(ticketCounts).reduce((sum, count) => sum + (count || 0), 0)}
                </div>
                <div className="text-sm text-blue-700 font-body">Total Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-purple-900">
                  ${events.reduce((sum, ev) => sum + ev.price * (ticketCounts[ev.id] || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-purple-700 font-body">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-green-900">
                  {events.filter((e) => e.status === "published").length}
                </div>
                <div className="text-sm text-green-700 font-body">Active Events</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdminEventList

