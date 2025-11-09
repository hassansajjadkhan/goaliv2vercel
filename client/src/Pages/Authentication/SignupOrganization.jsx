"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Trophy,
  User,
  Mail,
  Lock,
  Building,
  MessageSquare,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react"
import { API_BASE_URL } from "../../config"

const SignupOrganization = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    organization_name: "",
    fundraising_needs: "",
    phone_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

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
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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

  const isFormValid = form.full_name && form.email && form.password && form.organization_name && form.fundraising_needs

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white/90 to-blue-50/90" />
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
              radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120,219,255,0.2) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
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
                  Start Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Organization
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 font-body"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Join thousands of teams already using Goali to achieve their fundraising goals
                </motion.p>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              >
                <h4 className="text-lg font-header text-gray-900 mb-4">What you'll get:</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-body">Complete fundraising platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body">Team management tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-body">Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700 font-body">Real-time analytics</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Signup Form */}
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
                      Organization created successfully! Redirecting to login...
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
                <h2 className="text-2xl font-title text-gray-900 mb-2">Create Your Organization</h2>
                <p className="text-gray-600 font-body">Fill out the form below to get started</p>
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
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
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
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
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
                      className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
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

                {/* Organization Name */}
                <div>
                  <label htmlFor="organization_name" className="block text-sm font-header text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type="text"
                      id="organization_name"
                      name="organization_name"
                      value={form.organization_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Enter organization name"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Fundraising Needs */}
                <div>
                  <label htmlFor="fundraising_needs" className="block text-sm font-header text-gray-700 mb-2">
                    Fundraising Needs
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <motion.textarea
                      id="fundraising_needs"
                      name="fundraising_needs"
                      value={form.fundraising_needs}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body resize-none"
                      placeholder="Tell us about your fundraising goals and needs..."
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
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
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
                      placeholder="Enter phone number"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-4 rounded-xl font-header text-lg transition-all duration-200 ${
                    loading || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]"
                  } text-white`}
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
                      <span>Creating Organization...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Start Organization</span>
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
                      className="text-blue-600 hover:text-blue-500 transition-colors font-header"
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

export default SignupOrganization
