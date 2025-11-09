"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Shield,
  Heart,
  ArrowRight,
  Award,
  DollarSign,
  BarChart3,
  CreditCard,
  Calendar,
  Bell,
  Settings,
} from "lucide-react"
import "./App.css"

// Your existing imports
import SignupOrganization from "./Pages/Authentication/SignupOrganization"
import Login from "./Pages/Authentication/Login"
import JoinTeam from "./Pages/Authentication/JoinTeam"
import SendInvite from "./Pages/Invites/SendInvite"
import DashboardRedirect from "./Pages/DashboardRedirect/DashboardRedirect"
import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute"
import Layout from "./Boilerplate/Layout"
import CreateEvent from "./Pages/Events/CreateEvent"
import CreateFundraiser from "./Pages/Fundraisers/CreateFundraiser"
import FundraiserDetail from "./Pages/Fundraisers/FundraiserDetail"
import EventDetail from "./Pages/Events/EventDetail"
import MyTickets from "./Pages/Events/MyTickets"
import AthleteManager from "./Pages/Athletes/AthleteManager"
import PublicFundraiserList from "./Pages/Fundraisers/PublicFundraiserList"
import PublicEventList from "./Pages/Events/PublicEventList"
import CoachFundraiserDonations from "./Pages/dashboard/Coach/CoachFundraiserDonations"
import CoachTeamMembers from "./Pages/dashboard/Coach/CoachTeamMembers"
import CoachFundraiserManager from "./Pages/dashboard/Coach/CoachFundraiserManager"
import SignupMasterAdmin from "./Pages/Authentication/SignupMasterAdmin"
import Payments from "./Pages/NavDropdownPages/Payments"
import PrivacyPolicy from "./Pages/NavDropdownPages/PrivacyPolicy"
import Terms from "./Pages/NavDropdownPages/terms"

function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeRole, setActiveRole] = useState("Coach")

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const howItWorksRef = useRef(null)
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" })

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePosition({ x, y })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const roles = [
    {
      name: "Coach",
      description: "See team progress, track dues, motivate players with real-time dashboards and performance metrics.",
      features: ["Team Progress Tracking", "Dues Management", "Player Motivation Tools", "Performance Analytics"],
      dashboardData: {
        stats: [
          { label: "Team Progress", value: "85%", color: "blue" },
          { label: "Collected", value: "$12,450", color: "green" },
        ],
        activities: [
          { player: "Sarah M.", amount: "$450", color: "green" },
          { player: "Mike R.", amount: "$380", color: "blue" },
        ],
      },
    },
    {
      name: "Player",
      description: "Share fundraising links, view personal leaderboard, see progress and compete with teammates.",
      features: ["Personal Leaderboard", "Fundraising Links", "Progress Tracking", "Team Competition"],
      dashboardData: {
        stats: [
          { label: "Team Ranking", value: "#3", color: "purple" },
          { label: "My Total", value: "$385", color: "blue" },
        ],
        activities: [
          { player: "Supporters", amount: "12", color: "green" },
          { player: "Goal Progress", amount: "76%", color: "purple" },
        ],
      },
    },
    {
      name: "Parent",
      description: "Pay dues, buy tickets, track donations with secure payment processing and receipt management.",
      features: ["Secure Payments", "Ticket Purchases", "Donation Tracking", "Receipt Management"],
      dashboardData: {
        stats: [
          { label: "This Month", value: "$180", color: "blue" },
          { label: "Status", value: "Paid", color: "green" },
        ],
        activities: [
          { player: "Monthly Dues", amount: "$45", color: "pink" },
          { player: "Tournament Fee", amount: "$25", color: "pink" },
        ],
      },
    },
    {
      name: "Admin",
      description: "Track all money flows, view comprehensive reports, manage user roles and system settings.",
      features: ["Financial Overview", "User Management", "Detailed Reports", "System Administration"],
      dashboardData: {
        stats: [
          { label: "Total", value: "$24.5K", color: "blue" },
          { label: "Users", value: "342", color: "green" },
        ],
        activities: [
          { player: "New donation", amount: "$250", color: "green" },
          { player: "User registered", amount: "John D.", color: "blue" },
        ],
      },
    },
  ]

  const currentRole = roles.find((role) => role.name === activeRole) || roles[0]

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-body">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y, opacity }}
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      >
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{
            backgroundPosition: [`0px 0px`, `100px 100px`],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)
            `,
              backgroundSize: "24px 24px",
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
              transition: "transform 0.6s ease-out",
            }}
          />
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
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
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl lg:text-7xl font-title leading-[1.1] tracking-tight text-gray-900">
                  The All-In-One
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Fundraising Platform
                  </span>
                  <br />
                  for Teams
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-body">
                  Track dues, ticket sales, donations, merch, and more in one place. Built for modern teams who want to
                  focus on what matters most.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  onClick={() => navigate("/signup/org")}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-header text-lg transition-all duration-200 flex items-center justify-center gap-3 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <p className="text-sm text-gray-500 mb-4 font-body">Trusted by 500+ teams worldwide</p>
                <div className="flex items-center space-x-6 opacity-60">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-body text-gray-600">Sports Teams</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-body text-gray-600">Clubs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-body text-gray-600">Organizations</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Floating UI Preview */}
            <div className="relative lg:block hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {/* Main Dashboard Card */}
                <motion.div
                  className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 5 - 2.5}deg) rotateX(${mousePosition.y * 3 - 1.5}deg) translateZ(0px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-header text-gray-900">Team Dashboard</h3>
                      <p className="text-sm text-gray-500 font-body">Thunder Soccer Club</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-xs text-blue-600 font-header">+12%</span>
                      </div>
                      <div className="text-2xl font-header text-blue-900">$24,567</div>
                      <div className="text-sm text-blue-700 font-body">Total Raised</div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="text-xs text-purple-600 font-header">+8</span>
                      </div>
                      <div className="text-2xl font-header text-purple-900">342</div>
                      <div className="text-sm text-purple-700 font-body">Active Donors</div>
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-header text-gray-700">Goal Progress</span>
                      <span className="text-sm text-gray-500 font-body">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-body">$16,433 remaining to reach $40,000</div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CreditCard className="h-5 w-5 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-600 font-body">Payments</span>
                    </motion.button>
                    <motion.button
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BarChart3 className="h-5 w-5 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-600 font-body">Analytics</span>
                    </motion.button>
                    <motion.button
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="h-5 w-5 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-600 font-body">Events</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-48"
                  style={{
                    transform: `translateY(${mousePosition.y * 10}px) translateX(${mousePosition.x * 5}px)`,
                    transition: "transform 0.4s ease-out",
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-header text-gray-900">New Donation</div>
                      <div className="text-xs text-gray-500 font-body">$250 from Sarah M.</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-44"
                  style={{
                    transform: `translateY(${-mousePosition.y * 8}px) translateX(${-mousePosition.x * 6}px)`,
                    transition: "transform 0.5s ease-out",
                  }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-header text-gray-900">Goal Reached!</div>
                      <div className="text-xs text-gray-500 font-body">Equipment fund</div>
                    </div>
                  </div>
                </motion.div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -z-10 blur-xl scale-110"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center space-y-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-gray-400 text-sm font-body">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* How It Works - Smooth Role Switching */}
      <section
        ref={howItWorksRef}
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 relative overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-title mb-4 text-white">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-body">
              Tailored experiences for every role in your organization
            </p>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex space-x-2">
              {roles.map((role) => (
                <motion.button
                  key={role.name}
                  onClick={() => setActiveRole(role.name)}
                  className={`px-8 py-4 rounded-xl font-header transition-all duration-300 ${activeRole === role.name ? "bg-white text-gray-900 shadow-lg" : "text-white hover:bg-white/20 hover:text-white-900"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {role.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Description */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-3xl font-title text-white mb-4">{currentRole.name} Dashboard</h3>
                    <p className="text-lg text-gray-300 leading-relaxed font-body">{currentRole.description}</p>
                  </div>
                  <div className="space-y-3">
                    {currentRole.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300 font-body">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    onClick={() => navigate("/signup/org")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-header hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore {currentRole.name} Features
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side - Dashboard Mockup */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-header text-gray-900">{currentRole.name} Dashboard</h4>
                        <p className="text-sm text-gray-500 font-body">Thunder Soccer Club</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activeRole === "Coach" && <Trophy className="h-5 w-5 text-blue-600" />}
                        {activeRole === "Player" && <Award className="h-5 w-5 text-purple-600" />}
                        {activeRole === "Parent" && <Heart className="h-5 w-5 text-pink-600" />}
                        {activeRole === "Admin" && <Settings className="h-5 w-5 text-green-600" />}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Dynamic Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {currentRole.dashboardData.stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`bg-${stat.color}-50 rounded-lg p-4`}
                        >
                          <div className={`text-2xl font-header text-${stat.color}-900`}>{stat.value}</div>
                          <div className={`text-sm text-${stat.color}-700 font-body`}>{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Dynamic Activities */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-header text-gray-700 mb-3">Recent Activity</div>
                      <div className="space-y-2">
                        {currentRole.dashboardData.activities.map((activity, index) => (
                          <motion.div
                            key={activity.player}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-body text-gray-600">{activity.player}</span>
                            <span className={`text-sm font-header text-${activity.color}-600`}>{activity.amount}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Status Indicator */}
                  <motion.div
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="text-sm font-header">Live Updates</div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <motion.section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-title mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
              Everything you need to run successful fundraising campaigns
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Bank-level security with encrypted transactions and PCI compliance for safe donations.",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Track donations, monitor progress, and gain insights with comprehensive analytics.",
                color: "purple",
              },
              {
                icon: Users,
                title: "Community Building",
                description: "Engage supporters with updates, photos, and milestone celebrations.",
                color: "green",
              },
              {
                icon: Heart,
                title: "Donor Management",
                description: "Keep track of supporters and send thank you messages automatically.",
                color: "pink",
              },
              {
                icon: Target,
                title: "Goal Setting",
                description: "Set multiple fundraising goals and track progress with visual indicators.",
                color: "yellow",
              },
              {
                icon: Trophy,
                title: "Team Campaigns",
                description: "Create team-based fundraising with individual and collective goals.",
                color: "cyan",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-${feature.color}-300 hover:shadow-lg transition-all duration-200 cursor-pointer`}
              >
                <feature.icon className={`h-12 w-12 text-${feature.color}-600 mb-4`} />
                <h3 className="text-xl font-header mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 font-body">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-title mb-6 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Fundraising?
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-body"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of sports clubs already using GOALI to achieve their fundraising goals.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => navigate("/signup/org")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-header text-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Campaign
            </motion.button>
            <motion.button
              onClick={() => navigate("/fundraisers")}
              className="border-2 border-gray-200 hover:border-gray-300 text-black px-8 py-4 rounded-xl font-header text-lg transition-all duration-200 hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Fundraisers
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* Landing Page Route - Uses your existing Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        {/* Your existing routes with Layout wrapper */}
        <Route
          path="/signup/org"
          element={
            <Layout>
              <SignupOrganization />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/join"
          element={
            <Layout>
              <JoinTeam />
            </Layout>
          }
        />
        <Route
          path="/admin/send-invite"
          element={
            <Layout>
              <ProtectedRoute requiredRole="admin">
                <SendInvite />
              </ProtectedRoute>
            </Layout>
          }
        />
        {/* Protected Role-Based Dashboard */}
        <Route
          path="/dashboard/:role"
          element={
            <Layout>
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/events/create"
          element={
            <Layout>
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/fundraisers/create"
          element={
            <Layout>
              <ProtectedRoute>
                <CreateFundraiser />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/fundraisers/:id"
          element={
            <Layout>
              <FundraiserDetail />
            </Layout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <Layout>
              <EventDetail />
            </Layout>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <Layout>
              <MyTickets />
            </Layout>
          }
        />
        <Route
          path="/dashboard/athletes"
          element={
            <Layout>
              <ProtectedRoute>
                <AthleteManager />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/fundraisers"
          element={
            <Layout>
              <PublicFundraiserList />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <PublicEventList />
            </Layout>
          }
        />
        <Route
          path="/coach/donations"
          element={
            <Layout>
              <ProtectedRoute>
                <CoachFundraiserDonations />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/coach/team-members"
          element={
            <Layout>
              <ProtectedRoute>
                <CoachTeamMembers />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/coach/fundraisers/manage"
          element={
            <Layout>
              <ProtectedRoute>
                <CoachFundraiserManager />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/signup-master-admin"
          element={
            <Layout>
              <SignupMasterAdmin />
            </Layout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/payments"
          element={
            <Layout>
              <Payments />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <Terms />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
