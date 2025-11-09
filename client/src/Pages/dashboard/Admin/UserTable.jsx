"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../supabaseClient"
import { Users, Mail, Phone, Calendar, Shield, Crown, User, Trash2 } from "lucide-react"
import { API_BASE_URL } from "../../../config"

const UserTable = ({ users }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [teamUsers, setTeamUsers] = useState(users)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    setTeamUsers(users)
  }, [users])

  const handleRemove = async (targetUserId) => {
    if (!currentUser) return

    const targetUser = teamUsers.find((u) => u.id === targetUserId)
    const confirm = window.confirm(
      `Are you sure you want to remove ${targetUser?.full_name || "this user"}? This action cannot be undone.`,
    )
    if (!confirm) return

    setLoading(true)

    const res = await fetch("\${API_BASE_URL}/api/admin/remove-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_id: currentUser.id,
        user_id: targetUserId,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      // Remove user from local state with animation
      setTeamUsers(teamUsers.filter((u) => u.id !== targetUserId))
      // You could add a toast notification here instead of alert
    } else {
      alert(`Failed: ${data.error}`)
    }

    setLoading(false)
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

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const roleStats = {
    admin: teamUsers.filter((u) => u.role === "admin").length,
    coach: teamUsers.filter((u) => u.role === "coach").length,
    player: teamUsers.filter((u) => u.role === "player").length,
    parent: teamUsers.filter((u) => u.role === "parent").length,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-title text-gray-900 mb-2">Team Members</h2>
          <p className="text-gray-600 font-body">Manage your team members and their roles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="font-header text-gray-900">{teamUsers.length} members</span>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { role: "admin", label: "Admins", count: roleStats.admin, color: "purple", icon: Crown },
          { role: "coach", label: "Coaches", count: roleStats.coach, color: "blue", icon: Shield },
          { role: "player", label: "Players", count: roleStats.player, color: "green", icon: User },
          { role: "parent", label: "Parents", count: roleStats.parent, color: "orange", icon: User },
        ].map((stat, index) => (
          <motion.div
            key={stat.role}
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

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-header text-gray-900">All Team Members ({teamUsers.length})</h3>
        </div>

        {teamUsers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-header text-gray-900 mb-2">No team members found</h4>
            <p className="text-gray-500 font-body">Invite members to get started</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Member</th>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Contact</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Role</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Joined</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {teamUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Member Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-header text-sm">{getInitials(user.full_name)}</span>
                          </div>
                          <div>
                            <h4 className="font-header text-gray-900">
                              {user.full_name || "Unknown User"}
                              {user.id === currentUser?.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 font-body">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-body text-gray-700">{user.email}</span>
                          </div>
                          {user.phone_number && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-body text-gray-700">{user.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getRoleColor(
                            user.role,
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-body text-gray-700">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        {user.id !== currentUser?.id ? (
                          <motion.button
                            onClick={() => handleRemove(user.id)}
                            disabled={loading}
                            className="inline-flex items-center space-x-1 bg-red-50 text-red-700 px-3 py-1 rounded-lg text-sm font-body hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </motion.button>
                        ) : (
                          <span className="text-gray-400 text-sm font-body">Current User</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team Summary */}
      {teamUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-header text-gray-900 mb-2">Team Overview</h4>
              <p className="text-sm text-gray-600 font-body">Your team composition and member statistics</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-title text-blue-900">{teamUsers.length}</div>
                <div className="text-sm text-blue-700 font-body">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-purple-900">
                  {teamUsers.filter((u) => u.phone_number).length}
                </div>
                <div className="text-sm text-purple-700 font-body">With Phone</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-green-900">
                  {
                    teamUsers.filter((u) => new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                      .length
                  }
                </div>
                <div className="text-sm text-green-700 font-body">Joined This Month</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <span className="font-body text-gray-900">Removing user...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default UserTable

