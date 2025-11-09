"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Trophy,
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  Key,
  UserPlus,
} from "lucide-react"
import { API_BASE_URL } from "../../config"

const JoinTeam = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    token: "",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenFromURL = searchParams.get("token")
    if (tokenFromURL) {
      setForm((prev) => ({ ...prev, token: tokenFromURL }))
    }
  }, [searchParams])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/join-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Signup failed")
      }

      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = form.full_name && form.email && form.password && form.token

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white/90 to-green-50/90" />
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(34,197,94,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59,130,246,0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(168,85,247,0.2) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${25 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-body">Back to Home</span>
      </motion.button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo & Title */}
              <div className="text-center lg:text-left">
                <motion.div
                  className="flex items-center justify-center lg:justify-start space-x-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-3xl font-title text-gray-900">Goali</span>
                </motion.div>
                <motion.h1
                  className="text-4xl lg:text-5xl font-title text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Join Your
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {" "}
                    Team
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 font-body"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Complete your registration to join your team and start contributing to fundraising goals
                </motion.p>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              >
                <h4 className="text-lg font-header text-gray-900 mb-4">As a team member, you can:</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body">Collaborate with your team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-body">Track fundraising progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-body">Access team dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700 font-body">Participate in events</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Join Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-2xl"
            >
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-700 font-body text-sm">
                      Successfully joined the team! Redirecting to login...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-600 font-body text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-title text-gray-900 mb-2">Join an Existing Team</h2>
                <p className="text-gray-600 font-body">Complete your profile to join your team</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-header text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Enter your full name"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-header text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Enter your email"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-header text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Create a password"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-header text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Enter phone number"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Invitation Token */}
                <div>
                  <label htmlFor="token" className="block text-sm font-header text-gray-700 mb-2">
                    Invitation Token
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type="text"
                      id="token"
                      name="token"
                      value={form.token}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-200 font-body cursor-not-allowed"
                      placeholder="Invitation token (auto-filled from link)"
                      required
                      disabled
                    />
                  </div>
                  {form.token && (
                    <p className="text-sm text-green-600 mt-1 font-body">✓ Valid invitation token detected</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-4 rounded-xl font-header text-lg transition-all duration-200 ${
                    loading || !isFormValid
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]"
                  }`}
                  whileHover={!loading && isFormValid ? { scale: 1.02 } : {}}
                  whileTap={!loading && isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <span>Joining Team...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus className="h-5 w-5" />
                      <span>Join Team</span>
                    </div>
                  )}
                </motion.button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600 font-body">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-green-600 hover:text-green-500 transition-colors font-header"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinTeam
