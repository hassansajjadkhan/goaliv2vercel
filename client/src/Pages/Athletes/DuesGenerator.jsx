"use client"

import { useState } from "react"
import { Loader2, DollarSign, Calendar } from "lucide-react"
import { API_BASE_URL } from "../../config"

const GenerateDuesButton = ({ teamId }) => {
    const [amount, setAmount] = useState("")
    const [month, setMonth] = useState("")
    const [loading, setLoading] = useState(false)

    const generateDues = async () => {
        if (!amount || !month) return alert("Amount and Month required")
        setLoading(true)

        const payload = {
            team_id: teamId,
            amount: Number(amount),
            due_month: month  // This will store as "2025-06"
        }

        console.log("Sending payload:", payload)

        try {
            const res = await fetch(`${API_BASE_URL}/api/dues/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (res.ok) {
                alert("Dues generated!")
            } else {
                alert(data.error || "Failed to generate dues")
            }
        } catch (err) {
            console.error("Fetch error:", err)
            alert("Network error")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="w-full max-w-md mx-auto backdrop-blur-lg text-black bg-gradient-to-br from-white/15 via-white/10 to-white/5 rounded-2xl border border-white/30 shadow-2xl p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <DollarSign className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Generate Monthly Dues</h3>
                </div>
                <p className="text-black/70 text-sm">Set the amount and month for team dues collection</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
                {/* Amount Input */}
                <div className="space-y-2">
                    <label htmlFor="amount" className="block text-sm font-semibold text-black/90">
                        Amount
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-black/60 group-focus-within:text-black/80 transition-colors" />
                        </div>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black placeholder:text-black/50 focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Month Input */}
                <div className="space-y-2">
                    <label htmlFor="month" className="block text-sm font-semibold text-black/90">
                        Due Month
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-black/60 group-focus-within:text-black/80 transition-colors" />
                        </div>
                        <input
                            id="month"
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black placeholder:text-black/50 focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    disabled={loading || !amount || !month}
                    onClick={generateDues}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-black font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <span>Generate Dues</span>
                    )}
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-lg"></div>
        </div>
    )
}

export default GenerateDuesButton
