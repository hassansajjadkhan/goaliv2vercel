"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../supabaseClient"
import { Link } from "react-router-dom"
import { Heart, DollarSign, Target, CheckCircle, Clock, XCircle, Eye, Filter, AlertCircle, Plus } from "lucide-react"
import { API_BASE_URL } from "../../../config"

const AdminFundraiserList = () => {
  const [fundraisers, setFundraisers] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFundraisers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("users").select("team_id").eq("id", user.id).single()

      let url = `\${API_BASE_URL}/api/fundraisers?team_id=${profile.team_id}`
      if (filter !== "all") url += `&status=${filter}`

      const res = await fetch(url)
      const json = await res.json()
      setFundraisers(json.fundraisers || [])
      setLoading(false)
    }

    fetchFundraisers()
  }, [filter])

  const handleStatusChange = async (id, newStatus) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const res = await fetch(`\${API_BASE_URL}/api/fundraisers/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, admin_id: user.id }),
    })

    if (res.ok) {
      setFundraisers((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)))
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

  const getProgressPercentage = (raised, goal) => {
    if (!goal || goal === 0) return 0
    return Math.min((raised / goal) * 100, 100)
  }

  const filterOptions = [
    { value: "all", label: "All Fundraisers", count: fundraisers.length },
    { value: "pending", label: "Pending", count: fundraisers.filter((f) => f.status === "pending").length },
    { value: "published", label: "Published", count: fundraisers.filter((f) => f.status === "published").length },
    { value: "closed", label: "Closed", count: fundraisers.filter((f) => f.status === "closed").length },
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
            className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <span className="text-gray-600 font-body">Loading fundraisers...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-title text-gray-900 mb-2">Fundraiser Management</h2>
          <p className="text-gray-600 font-body">Manage and monitor all your fundraising campaigns</p>
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
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-2xl font-title text-gray-900">{stat.count}</span>
            </div>
            <p className="text-sm font-body text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Fundraisers List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-header text-gray-900">
              {filter === "all" ? "All Fundraisers" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Fundraisers`}{" "}
              ({fundraisers.length})
            </h3>
            <Link
              to="/fundraisers/create"
              className="bg-pink-600 text-white px-4 py-2 rounded-lg font-body hover:bg-pink-700 transition-colors flex items-center space-x-2 no-underline"
            >
              <Plus className="h-4 w-4" />
              <span>Create Fundraiser</span>
            </Link>
          </div>
        </div>

        {fundraisers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-header text-gray-900 mb-2">No fundraisers found</h4>
            <p className="text-gray-500 font-body">
              {filter === "all"
                ? "Create your first fundraiser to get started"
                : `No ${filter} fundraisers at the moment`}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Campaign Details</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Goal</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Progress</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Status</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {fundraisers.map((fundraiser, index) => {
                    const progressPercentage = getProgressPercentage(
                      fundraiser.collected_amount,
                      fundraiser.goal_amount,
                    )

                    return (
                      <motion.tr
                        key={fundraiser.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {/* Campaign Details */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                              <Heart className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-header text-gray-900 mb-1">{fundraiser.title}</h4>
                              <p className="text-sm text-gray-600 font-body line-clamp-2">
                                {fundraiser.description || "No description available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Goal */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="font-header text-gray-900">
                              ${fundraiser.goal_amount?.toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-header text-gray-900">
                                  ${fundraiser.collected_amount?.toLocaleString() || 0}
                                </span>
                              </div>
                              <span className="text-sm font-body text-gray-600">{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getStatusColor(
                              fundraiser.status,
                            )}`}
                          >
                            {getStatusIcon(fundraiser.status)}
                            <span className="capitalize">{fundraiser.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            {fundraiser.status === "pending" && (
                              <motion.button
                                onClick={() => handleStatusChange(fundraiser.id, "published")}
                                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-green-700 transition-colors flex items-center space-x-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <CheckCircle className="h-3 w-3" />
                                <span>Approve</span>
                              </motion.button>
                            )}

                            {fundraiser.status !== "closed" && (
                              <motion.button
                                onClick={() => handleStatusChange(fundraiser.id, "closed")}
                                className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-gray-700 transition-colors flex items-center space-x-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <XCircle className="h-3 w-3" />
                                <span>Close</span>
                              </motion.button>
                            )}

                            <Link
                              to={`/fundraisers/${fundraiser.id}`}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-body hover:bg-blue-700 transition-colors flex items-center space-x-1 no-underline"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {fundraisers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-header text-gray-900 mb-2">Fundraising Summary</h4>
              <p className="text-sm text-gray-600 font-body">Overview of your fundraising performance</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-title text-pink-900">
                  ${fundraisers.reduce((sum, f) => sum + (f.collected_amount || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-pink-700 font-body">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-rose-900">
                  ${fundraisers.reduce((sum, f) => sum + (f.goal_amount || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-rose-700 font-body">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-purple-900">
                  {fundraisers.filter((f) => f.status === "published").length}
                </div>
                <div className="text-sm text-purple-700 font-body">Active Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-blue-900">
                  {fundraisers.length > 0
                    ? Math.round(
                        (fundraisers.reduce((sum, f) => sum + (f.collected_amount || 0), 0) /
                          fundraisers.reduce((sum, f) => sum + (f.goal_amount || 0), 0)) *
                          100,
                      ) || 0
                    : 0}
                  %
                </div>
                <div className="text-sm text-blue-700 font-body">Overall Progress</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdminFundraiserList

