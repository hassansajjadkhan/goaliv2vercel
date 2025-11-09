"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  DollarSign,
  Target,
  Users,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  Trophy,
  CreditCard,
  Shield,
} from "lucide-react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../config"

const FundraiserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fundraiser, setFundraiser] = useState(null)
  const [amount, setAmount] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        const { data, error } = await supabase.from("fundraisers").select("*").eq("id", id).single()

        if (error) throw error
        setFundraiser(data)
      } catch (err) {
        setError("Failed to load fundraiser")
        console.error("Error fetching fundraiser:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchFundraiser()
    fetchUser()
  }, [id])

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid donation amount")
      return
    }

    setDonating(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout/fundraiser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          fundraiser_id: id,
          user_id: user?.id || null,
          email: user?.email || null,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Failed to create payment session")
      }
    } catch (err) {
      setError("Failed to process donation. Please try again.")
      console.error("Donation error:", err)
    } finally {
      setDonating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fundraiser.title,
          text: fundraiser.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setSuccess("Link copied to clipboard!")
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const quickAmounts = [25, 50, 100, 250]

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
            <span className="text-lg font-header text-gray-900">Loading fundraiser...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error && !fundraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-header text-gray-900 mb-2">Fundraiser Not Found</h2>
          <p className="text-gray-600 font-body mb-6">{error}</p>
          <button
            onClick={() => navigate("/fundraisers")}
            className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-header hover:shadow-lg transition-all duration-200"
          >
            View All Fundraisers
          </button>
        </motion.div>
      </div>
    )
  }

  const progressPercentage = Math.min((fundraiser.collected_amount / fundraiser.goal_amount) * 100, 100)
  const remainingAmount = Math.max(fundraiser.goal_amount - fundraiser.collected_amount, 0)
  const daysLeft = Math.max(Math.ceil((new Date(fundraiser.end_date) - new Date()) / (1000 * 60 * 60 * 24)), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-8 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/fundraisers")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body">Back to Fundraisers</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="h-5 w-5" />
            <span className="font-body">Share</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Fundraiser Image or Gradient */}
              <div className="relative h-64 overflow-hidden">
                {fundraiser.image_url ? (
                  <img
                    src={fundraiser.image_url}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center text-white text-6xl">
                    ❤️
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border border-white/20 bg-white/10 text-white">
                    <CheckCircle className="h-4 w-4" />
                    <span className="capitalize">{fundraiser.status || "Active"}</span>
                  </span>
                </div>
              </div>

              {/* Title and Description */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-7 w-7 text-pink-600" />
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-title text-gray-900 mb-4">{fundraiser.title}</h1>
                <p className="text-gray-700 font-body text-lg leading-relaxed">{fundraiser.description}</p>
              </div>


              {/* Progress Section */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-title text-gray-900">
                        ${fundraiser.collected_amount?.toLocaleString() || 0}
                      </span>
                      <span className="text-gray-600 font-body">raised</span>
                    </div>
                    <span className="text-lg font-header text-gray-700">{progressPercentage.toFixed(0)}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-pink-500 to-rose-600 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-title text-gray-900">
                        ${fundraiser.goal_amount?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 font-body">Goal</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xl font-title text-gray-900">${remainingAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 font-body">Remaining</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xl font-title text-gray-900">{Math.floor(Math.random() * 50) + 10}</div>
                      <div className="text-sm text-gray-600 font-body">Supporters</div>
                    </div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-header text-gray-900 mb-4">Campaign Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fundraiser.end_date && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-header text-gray-900">
                            {daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}
                          </div>
                          <div className="text-sm text-gray-600 font-body">
                            Ends {new Date(fundraiser.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-header text-gray-900">Sports Fundraiser</div>
                        <div className="text-sm text-gray-600 font-body">Team fundraising campaign</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>


          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-title text-gray-900 mb-2">Make a Donation</h2>
                <p className="text-gray-600 font-body">Support this amazing cause</p>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-red-700 font-body text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Display */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-green-700 font-body text-sm">{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <label className="block text-sm font-header text-gray-700 mb-3">Quick amounts</label>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <motion.button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 font-header ${amount === quickAmount.toString()
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ${quickAmount}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-header text-gray-700 mb-2">
                  Custom amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="amount"
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 font-body"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      setError(null)
                    }}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <motion.button
                onClick={handleDonate}
                disabled={donating || !amount || Number.parseFloat(amount) <= 0}
                className={`w-full py-4 rounded-xl font-header text-lg transition-all duration-200 ${donating || !amount || Number.parseFloat(amount) <= 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-lg hover:scale-[1.02]"
                  }`}
                whileHover={!donating && amount && Number.parseFloat(amount) > 0 ? { scale: 1.02 } : {}}
                whileTap={!donating && amount && Number.parseFloat(amount) > 0 ? { scale: 0.98 } : {}}
              >
                {donating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Donate ${amount || "0"}</span>
                  </div>
                )}
              </motion.button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <p className="text-blue-700 font-body text-sm">Secure payment powered by Stripe</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-header text-gray-900 mb-3">Help spread the word</h4>
                <motion.button
                  onClick={handleShare}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-header hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Campaign</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundraiserDetail
