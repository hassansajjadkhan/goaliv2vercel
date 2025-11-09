"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Calendar,
  Shield,
  Crown,
  User,
  UserPlus,
  LinkIcon,
} from "lucide-react"

const InviteTable = ({ invites }) => {
  const [copiedToken, setCopiedToken] = useState(null)

  const handleCopyLink = async (token) => {
    const fullLink = `${window.location.origin}/join?token=${token}`
    try {
      await navigator.clipboard.writeText(fullLink)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = fullLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "coach":
        return <Shield className="h-4 w-4" />
      case "player":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "coach":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "player":
        return "bg-green-100 text-green-800 border-green-200"
      case "parent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "expired":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date()
  }

  const getInitials = (email) => {
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const statusStats = {
    pending: invites.filter((i) => i.status === "pending" && !isExpired(i.expires_at)).length,
    accepted: invites.filter((i) => i.status === "accepted").length,
    expired: invites.filter((i) => isExpired(i.expires_at) && i.status !== "accepted").length,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-title text-gray-900 mb-2">Sent Invitations</h2>
          <p className="text-gray-600 font-body">Track and manage team invitations</p>
        </div>
        <div className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-gray-500" />
          <span className="font-header text-gray-900">{invites.length} invites</span>
        </div>
      </div>

      {/* Status Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { status: "pending", label: "Pending", count: statusStats.pending, color: "yellow", icon: Clock },
          { status: "accepted", label: "Accepted", count: statusStats.accepted, color: "green", icon: CheckCircle },
          { status: "expired", label: "Expired", count: statusStats.expired, color: "red", icon: AlertCircle },
        ].map((stat, index) => (
          <motion.div
            key={stat.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
              <span className="text-2xl font-title text-gray-900">{stat.count}</span>
            </div>
            <p className="text-sm font-body text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Invitations Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-header text-gray-900">All Invitations ({invites.length})</h3>
        </div>

        {invites.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-header text-gray-900 mb-2">No invitations sent</h4>
            <p className="text-gray-500 font-body">Send your first invitation to get started</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Invitee</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Role</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Status</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Invite Link</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Expires</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {invites.map((invite, index) => {
                    const expired = isExpired(invite.expires_at)
                    const actualStatus = expired && invite.status !== "accepted" ? "expired" : invite.status

                    return (
                      <motion.tr
                        key={invite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {/* Invitee Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-header text-sm">{getInitials(invite.email)}</span>
                            </div>
                            <div>
                              <h4 className="font-header text-gray-900">{invite.email}</h4>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 font-body">Invitation sent</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getRoleColor(
                              invite.role,
                            )}`}
                          >
                            {getRoleIcon(invite.role)}
                            <span className="capitalize">{invite.role}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getStatusColor(
                              actualStatus,
                            )}`}
                          >
                            {getStatusIcon(actualStatus)}
                            <span className="capitalize">{actualStatus}</span>
                          </span>
                        </td>

                        {/* Invite Link */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center space-x-2 max-w-[200px]">
                              <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-mono text-gray-600 truncate">
                                /join?token={invite.token.slice(0, 8)}...
                              </span>
                            </div>
                            <motion.button
                              onClick={() => handleCopyLink(invite.token)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Copy full link"
                            >
                              {copiedToken === invite.token ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </td>

                        {/* Expires */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span
                              className={`text-sm font-body ${expired ? "text-red-600 font-medium" : "text-gray-700"}`}
                            >
                              {new Date(invite.expires_at).toLocaleDateString()}
                            </span>
                          </div>
                          {expired && <div className="text-xs text-red-500 font-body mt-1">Expired</div>}
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

      {/* Invitations Summary */}
      {invites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-header text-gray-900 mb-2">Invitation Summary</h4>
              <p className="text-sm text-gray-600 font-body">Overview of your team invitations</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-title text-blue-900">{invites.length}</div>
                <div className="text-sm text-blue-700 font-body">Total Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-green-900">{statusStats.accepted}</div>
                <div className="text-sm text-green-700 font-body">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-yellow-900">{statusStats.pending}</div>
                <div className="text-sm text-yellow-700 font-body">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-purple-900">
                  {statusStats.accepted > 0 ? Math.round((statusStats.accepted / invites.length) * 100) : 0}%
                </div>
                <div className="text-sm text-purple-700 font-body">Success Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Copy Success Toast */}
      <AnimatePresence>
        {copiedToken && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="font-body">Invite link copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default InviteTable
