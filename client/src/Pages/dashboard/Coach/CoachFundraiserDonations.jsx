"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient"
import { API_BASE_URL } from "../../../config"

const CoachFundraiserDonations = () => {
  const [fundraisers, setFundraisers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const res = await fetch(`\${API_BASE_URL}/api/coach/fundraiser-donations?user_id=${user.id}`)
      const result = await res.json()
      setFundraisers(result.fundraisers || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-white text-xl font-medium">Loading fundraiser donations...</p>
            <p className="text-white/70 text-sm mt-2">Gathering your fundraising data</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            Your Fundraisers & Donations
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Track the progress of your fundraising campaigns and view detailed donation analytics
          </p>
        </div>

        {/* Empty State */}
        {fundraisers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Fundraisers Yet</h3>
              <p className="text-white/70 mb-6">
                Start your first fundraising campaign to begin tracking donations and progress.
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                Create Fundraiser
              </button>
            </div>
          </div>
        )}

        {/* Fundraisers Grid */}
        <div className="space-y-8">
          {fundraisers.map(({ fundraiser, donations, totalRaised }) => {
            const progressPercentage = Math.min((totalRaised / fundraiser.goal_amount) * 100, 100)
            const isCompleted = progressPercentage >= 100

            return (
              <div
                key={fundraiser.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Fundraiser Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{fundraiser.title}</h3>
                      {isCompleted && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Goal Reached
                        </span>
                      )}
                    </div>
                    <p className="text-white/70">{fundraiser.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-center">
                    <div className="bg-white/10 rounded-2xl p-4 min-w-[120px]">
                      <p className="text-white/70 text-sm font-medium">Goal</p>
                      <p className="text-2xl font-bold text-white">${fundraiser.goal_amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 min-w-[120px]">
                      <p className="text-white/70 text-sm font-medium">Raised</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        ${totalRaised.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm font-medium">Progress</span>
                    <span className="text-white font-semibold">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gradient-to-r from-purple-400 to-blue-400"
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Donations Section */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Donations ({donations.length})
                    </h4>
                    {donations.length > 0 && (
                      <div className="text-right">
                        <p className="text-white/70 text-sm">Average Donation</p>
                        <p className="text-white font-semibold">${(totalRaised / donations.length).toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  {donations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <p className="text-white/70 text-lg font-medium">No donations yet</p>
                      <p className="text-white/50 text-sm mt-1">Share your fundraiser to start receiving donations</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left py-3 px-4 text-white/70 font-semibold">Donor</th>
                            <th className="text-left py-3 px-4 text-white/70 font-semibold">Amount</th>
                            <th className="text-left py-3 px-4 text-white/70 font-semibold">Date</th>
                            <th className="text-left py-3 px-4 text-white/70 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d, index) => (
                            <tr
                              key={d.id}
                              className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">Donor #{d.user_id.slice(0, 8)}</p>
                                    <p className="text-white/50 text-sm">Anonymous</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-green-400 font-bold text-lg">${d.amount}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-white/70">
                                  {new Date(d.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                  ✓ Completed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        {fundraisers.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{fundraisers.length}</p>
              <p className="text-white/70">Active Fundraisers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ${fundraisers.reduce((sum, f) => sum + f.totalRaised, 0).toLocaleString()}
              </p>
              <p className="text-white/70">Total Raised</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {fundraisers.reduce((sum, f) => sum + f.donations.length, 0)}
              </p>
              <p className="text-white/70">Total Donations</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default CoachFundraiserDonations

