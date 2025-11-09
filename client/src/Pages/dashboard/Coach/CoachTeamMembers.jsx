"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient"

const CoachTeamMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: coach, error } = await supabase.from("users").select("team_id").eq("id", user.id).single()

      if (error || !coach) return

      const { data: users } = await supabase
        .from("users")
        .select("*")
        .eq("team_id", coach.team_id)
        .in("role", ["parent", "athlete"])

      setMembers(users || [])
      setLoading(false)
    }

    fetchMembers()
  }, [])

  const handleRemove = async (id) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    const { error } = await supabase.from("users").delete().eq("id", id)
    if (error) {
      alert("Failed to remove member.")
    } else {
      setMembers(members.filter((m) => m.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Team Members</h2>
            <p className="text-white/70">Gathering your team information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Team Members
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">Manage your team roster and member information</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Members</p>
                <p className="text-3xl font-bold text-white">{members.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Athletes</p>
                <p className="text-3xl font-bold text-white">{members.filter((m) => m.role === "athlete").length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Parents</p>
                <p className="text-3xl font-bold text-white">{members.filter((m) => m.role === "parent").length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Members Content */}
        {members.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Team Members Yet</h3>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
              Start building your team by inviting athletes and parents to join your organization.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Send Invitations
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left py-4 px-6 text-white font-semibold">Member</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Contact</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Role</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Joined</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr
                      key={member.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.full_name || "Unknown"}</p>
                            <p className="text-white/50 text-sm">ID: {member.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white">{member.email}</p>
                          <p className="text-white/70 text-sm">{member.phone_number || "No phone"}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            member.role === "athlete"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          }`}
                        >
                          {member.role === "athlete" ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          )}
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white">{new Date(member.created_at).toLocaleDateString()}</p>
                        <p className="text-white/50 text-sm">
                          {new Date(member.created_at).toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-6 space-y-4">
              {members.map((member) => (
                <div key={member.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.full_name || "Unknown"}</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.role === "athlete"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}
                        >
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/70">
                      <span className="text-white/50">Email:</span> {member.email}
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/50">Phone:</span> {member.phone_number || "Not provided"}
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/50">Joined:</span> {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Invite New Members</h3>
                <p className="text-white/70 text-sm">Send invitations to grow your team</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Export Member List</h3>
                <p className="text-white/70 text-sm">Download team roster as CSV</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(-1deg); }
          66% { transform: translateY(-25px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default CoachTeamMembers
