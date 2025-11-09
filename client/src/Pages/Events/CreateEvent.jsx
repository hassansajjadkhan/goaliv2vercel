"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../config"

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    max_tickets: "",
    image: null,
    is_season_ticket: false,
    total_games: "",
    total_price: ""
  });
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  const validateForm = () => {
    const newErrors = {};

    // Always validate title
    if (!form.title.trim()) newErrors.title = "Event title is required";

    // If it's NOT a season ticket, validate normal event fields
    if (!form.is_season_ticket) {
      if (!form.date) newErrors.date = "Event date is required";
      if (!form.location.trim()) newErrors.location = "Event location is required";
      if (form.price && isNaN(form.price)) newErrors.price = "Price must be a valid number";
      if (!form.max_tickets || isNaN(form.max_tickets)) newErrors.max_tickets = "Max tickets must be a valid number";
    }

    // If it's a season ticket, validate season-specific fields
    if (form.is_season_ticket) {
      if (!form.total_games || isNaN(form.total_games)) newErrors.total_games = "Total games must be a number";
      if (!form.total_price || isNaN(form.total_price)) newErrors.total_price = "Total price must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Not logged in");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("date", form.date);
      formData.append("price", parseFloat(form.price || 0));
      formData.append("max_tickets", parseInt(form.max_tickets || 0));
      formData.append("created_by", user.id);
      formData.append("is_season_ticket", form.is_season_ticket);
      formData.append("total_games", form.total_games || 0);
      formData.append("total_price", form.total_price || 0);


      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Event created successfully");
        navigate("/dashboard/" + user.role);
      } else {
        alert(data.error || "Failed to create event");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Create New Event
            </h1>
            <p className="text-gray-300 text-lg">Bring your community together with an amazing event</p>
          </div>

          {/* Main Form Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  placeholder="Enter your event title"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.title ? "border-red-400" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  required
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Describe your event in detail..."
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                />
              </div>

              {/* Date and Location Row */}
              {/* Date and Location (hidden for season tickets) */}
              {!form.is_season_ticket && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-white font-medium">
                      <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.date ? "border-red-400" : "border-white/20"} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                      required
                    />
                    {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-white font-medium">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      placeholder="Event venue or address"
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.location ? "border-red-400" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                      required
                    />
                    {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
                  </div>
                </div>
              )}


              {/* Image Upload Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Fundraiser Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border text-white rounded-xl border-gray-300"
                />
                {form.image && (
                  <p className="mt-1 text-xs text-white">Selected: {form.image.name}</p>
                )}
              </div>


              {!form.is_season_ticket && (
                <>
                  {/* Pricing Section */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Event Pricing & Goals
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm">Ticket Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          placeholder="0.00"
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 bg-white/10 border ${errors.price ? "border-red-400" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                        />
                        {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
                        <p className="text-gray-400 text-xs">Leave empty for free events</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm">Max Tickets</label>
                        <input
                          type="number"
                          name="max_tickets"
                          value={form.max_tickets}
                          placeholder="e.g. 50"
                          onChange={handleChange}
                          min="1"
                          step="1"
                          className={`w-full px-4 py-3 bg-white/10 border ${errors.max_tickets ? "border-red-400" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                        />
                        {errors.max_tickets && <p className="text-red-400 text-sm">{errors.max_tickets}</p>}
                        <p className="text-gray-400 text-xs">Total number of tickets you want to sell</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-4">
                <label className="flex items-center text-white font-medium">
                  <input
                    type="checkbox"
                    name="is_season_ticket"
                    checked={form.is_season_ticket}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  This is a Season Ticket
                </label>

                {form.is_season_ticket && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm">Total Games</label>
                      <input
                        type="number"
                        name="total_games"
                        value={form.total_games}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      />
                      {errors.total_games && <p className="text-red-400 text-sm">{errors.total_games}</p>}
                    </div>
                    <div>
                      <label className="text-white text-sm">Total Season Price</label>
                      <input
                        type="number"
                        name="total_price"
                        value={form.total_price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      />
                      {errors.total_price && <p className="text-red-400 text-sm">{errors.total_price}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Need help? Check out our{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                    event creation guide
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Digital Tickets</h3>
              <p className="text-gray-400 text-xs mt-1">QR code tickets sent instantly</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Analytics</h3>
              <p className="text-gray-400 text-xs mt-1">Track sales and attendance</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Secure Payments</h3>
              <p className="text-gray-400 text-xs mt-1">Powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
