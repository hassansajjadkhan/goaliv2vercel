"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Trophy, Eye, EyeOff, ArrowLeft, Shield, Target, AlertCircle } from "lucide-react"
import { supabase } from "../../supabaseClient.js"

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { email, password } = form

    try {
      // 1. Login via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw new Error(authError.message)

      const userId = authData.user.id

      // 2. Fetch user metadata from `users` table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", userId)
        .single()

      console.log(userData)

      if (userError) throw new Error("User not found in database.")

      // 3. Redirect to role dashboard
      navigate(`/dashboard/${userData.role}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-blue-900/90" />
        <motion.div
          className="absolute inset-0 opacity-20"
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
              radial-gradient(circle at 20% 80%, rgba(120,119,198,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,119,198,0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120,219,255,0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute bg-transparent top-6 left-6 z-50 flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-body ">Back to Home</span>
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
                  <span className="text-3xl font-title text-white">Goali</span>
                </motion.div>
                <motion.h1
                  className="text-4xl lg:text-5xl font-title text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-300 font-body"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Sign in to access your dashboard
                </motion.p>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h4 className="text-lg font-header text-white mb-4">What you can do:</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 font-body">Track fundraising progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-gray-300 font-body">Manage team activities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-gray-300 font-body">Secure payment processing</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
            >
              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-300 font-body text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-header text-white mb-2">
                    Email Address
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body"
                    placeholder="Enter your email"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-header text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-body pr-12"
                      placeholder="Enter your password"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bg-transparent right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white/70 font-body">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm bg-transparent text-blue-400 hover:text-blue-300 transition-colors font-body"
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !form.email || !form.password}
                  className={`w-full py-4 rounded-xl font-header text-lg transition-all duration-200 ${
                    loading || !form.email || !form.password
                      ? "bg-gray-900  cursor-not-allowed"
                      : `bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:scale-[1.02]`
                  } text-white`}
                  whileHover={!loading && form.email && form.password ? { scale: 1.02 } : {}}
                  whileTap={!loading && form.email && form.password ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-5 h-5 border-2  border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    `Log In`
                  )}
                </motion.button>

                <div className="text-center">
                  <p className="text-white/70 font-body">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup/org")}
                      className="text-blue-400 bg-gray-800 hover:text-blue-300 transition-colors font-header"
                    >
                      Sign up here
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

export default Login
