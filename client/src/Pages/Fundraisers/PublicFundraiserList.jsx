"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Trophy,
  CheckCircle,
  Clock,
} from "lucide-react"
import { API_BASE_URL } from "../../config"

const PublicFundraiserList = () => {
  const [fundraisers, setFundraisers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fundraisers/all`)
        const data = await res.json()
        setFundraisers(data.fundraisers || [])
      } catch (error) {
        console.error("Error fetching fundraisers:", error)
        setFundraisers([])
      } finally {
        setLoading(false)
      }
    }
    fetchFundraisers()
  }, [])

  const getProgressPercentage = (collected, goal) => {
    if (!goal || goal === 0) return 0
    return Math.min((collected / goal) * 100, 100)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // Filter and search fundraisers
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const matchesFilter = filter === "all" || fundraiser.status === filter
    const matchesSearch =
      fundraiser.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calculate statistics
  const totalRaised = fundraisers.reduce((sum, f) => sum + (f.collected_amount || 0), 0)
  const totalGoal = fundraisers.reduce((sum, f) => sum + (f.goal_amount || 0), 0)
  const activeFundraisers = fundraisers.filter((f) => f.status === "published").length

  const filterOptions = [
    { value: "all", label: "All Fundraisers", count: fundraisers.length },
    { value: "published", label: "Active", count: fundraisers.filter((f) => f.status === "published").length },
    { value: "pending", label: "Coming Soon", count: fundraisers.filter((f) => f.status === "pending").length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <span className="text-lg font-header text-gray-900">Loading fundraisers...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-title">Fundraisers</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-title mb-6"
          >
            Support Amazing Causes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-pink-100 max-w-3xl mx-auto font-body"
          >
            Discover and support fundraising campaigns from teams and organizations making a difference in their
            communities
          </motion.p>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Raised",
              value: `$${totalRaised.toLocaleString()}`,
              icon: DollarSign,
              color: "green",
              description: "Across all campaigns",
            },
            {
              label: "Active Campaigns",
              value: activeFundraisers.toString(),
              icon: Target,
              color: "blue",
              description: "Currently accepting donations",
            },
            {
              label: "Overall Progress",
              value: `${totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%`,
              icon: TrendingUp,
              color: "purple",
              description: "Towards collective goals",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <Sparkles className="h-5 w-5 text-gray-300" />
              </div>
              <div className="text-3xl font-title text-gray-900 mb-1">{stat.value}</div>
              <div className="text-lg font-header text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500 font-body">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 font-body w-64"
            />
          </div>
        </div>

        {/* Fundraisers Grid */}
        {filteredFundraisers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-title text-gray-900 mb-2">No fundraisers found</h3>
            <p className="text-gray-600 font-body">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Check back soon for new fundraising campaigns"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredFundraisers.map((fundraiser, index) => {
                const progressPercentage = getProgressPercentage(fundraiser.collected_amount, fundraiser.goal_amount)

                return (
                  <motion.div
                    key={fundraiser.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Card Header with Image */}
                    {fundraiser.image_url ? (
                      <img
                        src={fundraiser.image_url}
                        alt={fundraiser.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white">
                        <Heart className="h-8 w-8" />
                      </div>
                    )}
                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getStatusColor(
                            fundraiser.status
                          )}`}
                        >
                          {getStatusIcon(fundraiser.status)}
                          <span className="capitalize">{fundraiser.status}</span>
                        </span>
                      </div>
                      <h2 className="text-xl font-title text-gray-900 mb-2 line-clamp-2">{fundraiser.title}</h2>
                      <p className="text-gray-600 font-body text-sm line-clamp-3">
                        {fundraiser.description || "Help us reach our fundraising goal"}
                      </p>
                    </div>


                    {/* Card Body */}
                    <div className="p-6">
                      {/* Progress Section */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-header text-gray-900">
                              ${(fundraiser.collected_amount || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500 font-body text-sm">raised</span>
                          </div>
                          <span className="text-sm font-body text-gray-600">{progressPercentage.toFixed(0)}%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <motion.div
                            className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-body text-gray-600">
                              Goal: ${(fundraiser.goal_amount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-body text-gray-600">
                              {Math.floor(Math.random() * 50) + 10} supporters
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/fundraisers/${fundraiser.id}`}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 rounded-xl font-header text-center hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group no-underline"
                      >
                        <Heart className="h-4 w-4" />
                        <span>View & Donate</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-title mb-4">Start Your Own Fundraiser</h2>
          <p className="text-xl text-pink-100 mb-8 font-body">
            Join thousands of teams already using Goali to achieve their fundraising goals
          </p>
          <Link
            to="/signup/org"
            className="bg-white text-pink-600 px-8 py-4 rounded-xl font-header text-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2 no-underline"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create Fundraiser</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default PublicFundraiserList
