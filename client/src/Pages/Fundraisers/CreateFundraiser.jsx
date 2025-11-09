"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import { API_BASE_URL } from "../../config"

const CreateFundraiser = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    image: null
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!form.title.trim()) {
      newErrors.title = "Title is required"
    } else if (form.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters"
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required"
    } else if (form.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    if (!form.goal_amount) {
      newErrors.goal_amount = "Goal amount is required"
    } else if (Number.parseFloat(form.goal_amount) < 100) {
      newErrors.goal_amount = "Goal amount must be at least $100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      alert("Please log in to create a fundraiser");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("goal_amount", parseFloat(form.goal_amount));
      formData.append("owner_id", user.id);
      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch(`${API_BASE_URL}/api/fundraisers`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/dashboard/${user.role}`, {
          state: { message: "Fundraiser created successfully!" },
        });
      } else {
        throw new Error(data.error || "Failed to create fundraiser");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  const suggestedGoals = [500, 1000, 2500, 5000, 10000]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Fundraiser</h1>
            <p className="text-gray-600">Start raising funds for your cause today</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fundraiser Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Give your fundraiser a compelling title"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  maxLength={100}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                <p className="mt-1 text-xs text-gray-500">{form.title.length}/100 characters</p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  placeholder="Tell your story. Why are you fundraising? What will the money be used for?"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  maxLength={1000}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                <p className="mt-1 text-xs text-gray-500">{form.description.length}/1000 characters</p>
              </div>

              {/* Goal Amount Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fundraising Goal *</label>

                {/* Suggested Goals */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {suggestedGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setForm({ ...form, goal_amount: goal.toString() })}
                      className={`p-2 text-sm rounded-lg border-2 transition-all duration-200 ${form.goal_amount === goal.toString()
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                        }`}
                    >
                      ${goal.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fundraiser Image (optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    className="w-full px-4 py-2 border rounded-xl border-gray-300"
                  />
                  {form.image && (
                    <p className="mt-1 text-xs text-gray-500">Selected: {form.image.name}</p>
                  )}
                </div>


                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="goal_amount"
                    placeholder="0.00"
                    value={form.goal_amount}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${errors.goal_amount ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    min="100"
                    step="1"
                  />
                </div>
                {errors.goal_amount && <p className="mt-1 text-sm text-red-600">{errors.goal_amount}</p>}
                <p className="mt-1 text-xs text-gray-500">Minimum goal amount is $100</p>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use a clear, compelling title that explains your cause</li>
                  <li>• Tell your story with specific details and emotions</li>
                  <li>• Set a realistic but ambitious goal</li>
                  <li>• Share regular updates with your supporters</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Fundraiser"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>By creating a fundraiser, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateFundraiser
