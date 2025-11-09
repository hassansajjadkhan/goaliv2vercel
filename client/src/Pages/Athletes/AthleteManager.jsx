"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { API_BASE_URL } from "../../config"

const AthleteManager = () => {
  const [teamId, setTeamId] = useState(null)
  const [userId, setUserId] = useState(null)
  const [athletes, setAthletes] = useState([])
  const [athleteUsers, setAthleteUsers] = useState([])
  const [form, setForm] = useState({ full_name: "", position: "", age: "", jersey_number: "", user_id: null, parent_id: null })
  const [editingId, setEditingId] = useState(null)
  const [availableParents, setAvailableParents] = useState([])
  const [parentUsers, setParentUsers] = useState([])

  useEffect(() => {
    const fetchInitial = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
      const { data: userData } = await supabase.from("users").select("team_id").eq("id", user.id).single()
      const team_id = userData.team_id
      setTeamId(team_id)

      const { data: userList } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("team_id", team_id)
        .eq("role", "athlete")
      setAthleteUsers(userList)

      const { data: parentUsers } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("team_id", team_id)
        .eq("role", "parent")
      setAvailableParents(parentUsers)

      const { data: parents } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("team_id", team_id)
        .eq("role", "parent")

      setParentUsers(parents || [])

      const res = await fetch(`${API_BASE_URL}/api/athletes/by-team/${team_id}`)
      const { athletes } = await res.json()
      setAthletes(athletes)
    }
    fetchInitial()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = (user_id, full_name) => {
    setForm({ full_name, position: "", age: "", jersey_number: "", user_id, parent_id: "" })
  }


  const handleEdit = (a) => {
    setForm({
      full_name: a.full_name,
      position: a.position || "",
      age: a.age || "",
      jersey_number: a.jersey_number || "",
      user_id: a.user_id,
    })
    setEditingId(a.id)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this athlete profile?")) return
    await fetch(`${API_BASE_URL}/api/athletes/${id}`, { method: "DELETE" })
    setAthletes(athletes.filter((a) => a.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      age: Number(form.age),
      jersey_number: Number(form.jersey_number),
      team_id: teamId,
      created_by: userId,
      user_id: form.user_id
    }

    // If this is a new athlete being created AND a parent is selected
    if (!editingId && form.parent_id) {
      payload.parent_id = form.parent_id
    }
    if (editingId) {
      await fetch(`${API_BASE_URL}/api/athletes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch(`${API_BASE_URL}/api/athletes/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }
    setForm({ full_name: "", position: "", age: "", jersey_number: "", user_id: null, parent_id: "" })
    setEditingId(null)
    const res = await fetch(`${API_BASE_URL}/api/athletes/by-team/${teamId}`)
    const { athletes } = await res.json()
    setAthletes(athletes)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Athlete Manager
          </h1>
          <p className="text-gray-300 text-lg">{editingId ? "Edit Athlete Profile" : "Manage Your Team Athletes"}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Athletes</p>
                <p className="text-3xl font-bold text-white">{athleteUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
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
                <p className="text-gray-300 text-sm">Profiles Created</p>
                <p className="text-3xl font-bold text-white">{athletes.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-white">
                  {athleteUsers.length > 0 ? Math.round((athletes.length / athleteUsers.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {form.user_id && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                {editingId ? "Edit Athlete Profile" : "Create Athlete Profile"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g., Forward, Guard, Center"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-9 0v10a2 2 0 002 2h8a2 2 0 002-2V7H7z"
                    />
                  </svg>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  Jersey Number
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  value={form.jersey_number}
                  onChange={handleChange}
                  placeholder="Enter jersey number"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Assign Parent</label>
                <select
                  name="parent_id"
                  value={form.parent_id || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none"
                >
                  <option value="">Select parent</option>
                  {parentUsers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {editingId ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Athletes Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Team Athletes</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Athlete</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Position</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Jersey</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Age</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {athleteUsers.map((u) => {
                  const profile = athletes.find((a) => a.user_id === u.id)
                  return (
                    <tr key={u.id} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {u.full_name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.full_name}</p>
                            {profile && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                Profile Complete
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{u.email}</td>
                      <td className="p-4">
                        {profile?.position ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {profile.position}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {profile?.jersey_number ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold text-sm">
                            {profile.jersey_number}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">{profile?.age || "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {profile ? (
                            <>
                              <button
                                onClick={() => handleEdit(profile)}
                                className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(profile.id)}
                                className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors duration-200 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleCreate(u.id, u.full_name)}
                              className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors duration-200 text-xs font-medium"
                            >
                              Create Profile
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {athleteUsers.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Athletes Found</h3>
              <p className="text-gray-400">Invite athletes to your team to start managing their profiles.</p>
            </div>
          )}
        </div>

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Profile Management</h4>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Create and manage detailed athlete profiles with positions, jersey numbers, and personal information.
            </p>
            <div className="flex items-center text-green-400 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Track athlete development
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Team Analytics</h4>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Monitor team composition, profile completion rates, and athlete engagement metrics.
            </p>
            <div className="flex items-center text-blue-400 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Data-driven insights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AthleteManager