"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Trophy, ArrowLeft, Bell, User, Menu, X, ChevronDown, ChevronUp } from "lucide-react"
import { supabase } from "../supabaseClient"

function Header({
  title = "GOALI",
  subtitle,
  showBackButton = false,
  showUserMenu = false,
  isTransparent = false,
  className = "",
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: userDetails, error } = await supabase.from("users").select("role").eq("id", user.id).single()
        if (!error && userDetails) {
          setUser({ ...user, role: userDetails.role })
        } else {
          setUser(user) // fallback
        }
      }
    }
    fetchUser()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUser() // fetch full user details with role
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      }
      // Hide header when scrolling down and past the initial threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const headerClasses = isTransparent ? "bg-white/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        y: isVisible ? 0 : -100,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${headerClasses} border-b border-gray-200 fixed w-full z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            {showBackButton && (
              <motion.button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-body">Back to Home</span>
              </motion.button>
            )}
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-title text-gray-900">{title}</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard/:role" className="text-black hover:text-gray-900 transition-colors font-body">
              Dashboard
            </Link>
            <Link to="/fundraisers" className="text-black hover:text-gray-900 transition-colors font-body">
              Fundraiser
            </Link>
            <Link to="/events" className="text-black hover:text-gray-900 transition-colors font-body">
              Event
            </Link>


            {user && (
              <>
                <Link to="/my-tickets" className="text-black hover:text-gray-900 transition-colors font-body">
                  My Tickets
                </Link>
                {(user?.role === "admin" || user?.role === "coach" || user?.role === "master_admin") && (
                  <Link
                    to="/dashboard/athletes"
                    className="text-black hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Athletes
                  </Link>
                )}
              </>
            )}
            {/* New Dropdown Menu */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 text-black hover:text-gray-900 transition-colors font-body"
              >
                <span>Resources</span>
                {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
                >
                  <Link
                    to="/privacy-policy"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-body"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/payments"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-body"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Payments
                  </Link>
                  <Link
                    to="/terms"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-body"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Terms
                  </Link>
                </motion.div>
              )}
            </div>  
          </div>
          {/* User Menu or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm flex items-center justify-center">
                  <Bell className="h-5 w-5 text-black-600 bg-none" />
                </button>
                <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm flex items-center justify-center">
                  <User className="h-5 w-5 text-black-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-body shadow-md hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/signup/org" className="text-gray-600 hover:text-gray-900 transition-colors font-body">
                  Start Org
                </Link>
                <Link to="/join" className="text-gray-600 hover:text-gray-900 transition-colors font-body">
                  Join Team
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-body">
                  Log In
                </Link>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/dashboard/:role"
                className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/fundraisers"
                className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fundraiser
              </Link>
              <Link
                to="/events"
                className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Event
              </Link>

              {/* Mobile Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 transition-colors font-body"
                >
                  <span>Resources</span>
                  {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 mt-2 space-y-2"
                  >
                    <Link
                      to="/privacy-policy"
                      className="block py-1 text-gray-600 hover:text-gray-900 transition-colors font-body"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/payments"
                      className="block py-1 text-gray-600 hover:text-gray-900 transition-colors font-body"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Payments
                    </Link>
                    <Link
                      to="/terms"
                      className="block py-1 text-gray-600 hover:text-gray-900 transition-colors font-body"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Terms
                    </Link>
                  </motion.div>
                )}
              </div>

              {user ? (
                <>
                  <Link
                    to="/my-tickets"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Tickets
                  </Link>
                  <Link
                    to="/dashboard/athletes"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Athletes
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-gray-900 transition-colors font-body"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup/org"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start Org
                  </Link>
                  <Link
                    to="/join"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Team
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
