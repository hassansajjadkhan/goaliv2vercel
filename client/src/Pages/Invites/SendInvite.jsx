"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../config"

const SendInvite = () => {
  const [form, setForm] = useState({ email: "", role: "athlete" })
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [emailError, setEmailError] = useState("")
  const navigate = useNavigate()

  // Fetch current user + team
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setError("You must be logged in")
          navigate("/login")
          return
        }

        setUserId(user.id)

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("team_id, role")
          .eq("id", user.id)
          .single()

        if (userError) {
          setError("Failed to fetch user data")
          return
        }

        setTeamId(userData.team_id)

        if (userData.role === "admin") {
          setIsAdmin(true)
        } else {
          navigate("/")
        }
      } catch (err) {
        setError("Failed to load user information")
      } finally {
        setCheckingAuth(false)
      }
    }

    getUserInfo()
  }, [navigate])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Clear email error when user types
    if (name === "email" && emailError) {
      setEmailError("")
    }

    // Clear general error
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setEmailError("")
    setInviteLink("")
    setSuccess(false)

    // Validate email
    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (!userId || !teamId) {
      setError("User or team information not loaded. Please refresh the page.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/invite/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          team_id: teamId,
          sent_by: userId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invite")
      }

      setInviteLink(data.inviteLink)
      setSuccess(true)

      // Reset form after successful invite
      setTimeout(() => {
        setForm({ email: "", role: "athlete" })
        setInviteLink("")
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      // You could add a toast notification here
      alert("Invite link copied to clipboard!")
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = inviteLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Invite link copied to clipboard!")
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to send invites.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Team Invite</h1>
            <p className="text-gray-600">Invite new members to join your team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="md:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                {/* Success Message */}
                {success && inviteLink && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-2">Invite Sent Successfully!</h4>
                        <p className="text-green-700 text-sm mb-3">Share this invite link with the new team member:</p>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={inviteLink}
                            className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-mono"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter the invitee's email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        emailError ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Role *</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="athlete">Athlete</option>
                      <option value="coach">Coach</option>
                      <option value="parent">Parent</option>
                    </select>
                    <p className="text-gray-500 text-sm mt-1">Select the appropriate role for the new team member</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !teamId}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending Invite...
                      </span>
                    ) : (
                      "Send Team Invite"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 How It Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Enter Email</h4>
                      <p className="text-gray-600 text-xs">
                        Provide the email address of the person you want to invite
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Select Role</h4>
                      <p className="text-gray-600 text-xs">Choose the appropriate team role for the new member</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Share Link</h4>
                      <p className="text-gray-600 text-xs">Copy and share the generated invite link</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 text-sm mb-2">Team Roles</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>
                      <strong>Athlete:</strong> Team member participant
                    </p>
                    <p>
                      <strong>Coach:</strong> Team leader and trainer
                    </p>
                    <p>
                      <strong>Parent:</strong> Guardian and supporter
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-xs">
                    <strong>Note:</strong> Invite links expire after 7 days for security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendInvite
