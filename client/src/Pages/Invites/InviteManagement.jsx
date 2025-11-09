"use client"

import { useState } from "react"
import { API_BASE_URL } from "../../config"

const InviteManagement = ({ teamId, userRole }) => {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("parent")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const allowedRoles = userRole === "coach" ? ["parent", "athlete"] : ["admin", "coach", "parent", "athlete"]

  const roleDescriptions = {
    admin: "Full system access and management",
    coach: "Team management and athlete oversight",
    parent: "View athlete progress and activities",
    athlete: "Participate in team activities",
  }

  const handleSend = async () => {
    if (!email.trim()) {
      setMessage("Please enter an email address")
      setMessageType("error")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`${API_BASE_URL}/api/invite/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, team_id: teamId }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Invite sent successfully!")
        setMessageType("success")
        setEmail("")
      } else {
        setMessage(data.error || "Failed to send invite")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Send Team Invite
          </h2>
          <p className="text-gray-600 text-sm">Invite new members to join your team with the appropriate role</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg border ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {messageType === "success" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter invitee's email address"
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role Assignment
            </label>
            <select
              id="role"
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>

            {/* Role Description */}
            <div className="mt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                <span className="font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}:</span>{" "}
                {roleDescriptions[role]}
              </p>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading || !email.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending Invite...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>Send Invite</span>
              </div>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100/50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Invite Information</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                The invitee will receive an email with a secure link to join your team. Invites expire after 7 days for
                security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteManagement
