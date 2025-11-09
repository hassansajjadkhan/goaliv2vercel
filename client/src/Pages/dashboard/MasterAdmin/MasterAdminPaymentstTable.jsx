"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard,
  DollarSign,
  Calendar,
  Heart,
  Ticket,
  Filter,
  TrendingUp,
  ArrowUpRight,
  Banknote,
  Smartphone,
  Building,
} from "lucide-react"

const AdminPaymentsTable = ({ payments }) => {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
      case "credit_card":
        return <CreditCard className="h-4 w-4" />
      case "bank_transfer":
      case "bank":
        return <Building className="h-4 w-4" />
      case "paypal":
        return <Smartphone className="h-4 w-4" />
      case "cash":
        return <Banknote className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentColor = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
      case "credit_card":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "bank_transfer":
      case "bank":
        return "bg-green-100 text-green-800 border-green-200"
      case "paypal":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cash":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (payment) => {
    if (payment.fundraiser_id) return <Heart className="h-4 w-4 text-pink-600" />
    if (payment.event_id) return <Ticket className="h-4 w-4 text-blue-600" />
    return <DollarSign className="h-4 w-4 text-gray-600" />
  }

  const getTypeLabel = (payment) => {
    if (payment.fundraiser_id) return "Fundraiser"
    if (payment.event_id) return "Event"
    return "Other"
  }

  const getTypeColor = (payment) => {
    if (payment.fundraiser_id) return "bg-pink-100 text-pink-800 border-pink-200"
    if (payment.event_id) return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Filter and sort payments
  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true
    if (filter === "fundraiser") return payment.fundraiser_id
    if (filter === "event") return payment.event_id
    if (filter === "method") return payment.method?.toLowerCase() === filter
    return true
  })

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.amount - a.amount
      case "date":
        return new Date(b.created_at) - new Date(a.created_at)
      case "method":
        return (a.method || "").localeCompare(b.method || "")
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  // Calculate statistics
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const fundraiserAmount = payments.filter((p) => p.fundraiser_id).reduce((sum, p) => sum + (p.amount || 0), 0)
  const eventAmount = payments.filter((p) => p.event_id).reduce((sum, p) => sum + (p.amount || 0), 0)

  const paymentMethods = [...new Set(payments.map((p) => p.method).filter(Boolean))]
  const methodStats = paymentMethods.map((method) => ({
    method,
    count: payments.filter((p) => p.method === method).length,
    amount: payments.filter((p) => p.method === method).reduce((sum, p) => sum + (p.amount || 0), 0),
  }))

  const filterOptions = [
    { value: "all", label: "All Payments", count: payments.length },
    { value: "fundraiser", label: "Fundraisers", count: payments.filter((p) => p.fundraiser_id).length },
    { value: "event", label: "Events", count: payments.filter((p) => p.event_id).length },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-title text-gray-900 mb-2">Payment Transactions</h2>
          <p className="text-gray-600 font-body">Monitor all payment transactions and revenue</p>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="font-header text-gray-900">{payments.length} transactions</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `$${totalAmount.toLocaleString()}`,
            icon: DollarSign,
            color: "green",
            change: "+12%",
          },
          {
            label: "Fundraiser Revenue",
            value: `$${fundraiserAmount.toLocaleString()}`,
            icon: Heart,
            color: "pink",
            change: "+8%",
          },
          {
            label: "Event Revenue",
            value: `$${eventAmount.toLocaleString()}`,
            icon: Ticket,
            color: "blue",
            change: "+15%",
          },
          {
            label: "Transactions",
            value: payments.length.toString(),
            icon: TrendingUp,
            color: "purple",
            change: "+5",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-header text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-title text-gray-900 mb-1">{stat.value}</div>
            <p className="text-sm font-body text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods Overview */}
      {methodStats.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-header text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {methodStats.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPaymentColor(method.method)}`}
                  >
                    {getPaymentIcon(method.method)}
                  </div>
                  <div>
                    <div className="font-header text-gray-900 capitalize">{method.method}</div>
                    <div className="text-sm text-gray-600 font-body">{method.count} transactions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-header text-gray-900">${method.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 font-body">
                    {((method.amount / totalAmount) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="bg-transparent border-none outline-none font-body text-gray-700 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <select
              className="bg-transparent border-none outline-none font-body text-gray-700 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="method">Sort by Method</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-header text-gray-900">Recent Transactions ({sortedPayments.length})</h3>
        </div>

        {sortedPayments.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-header text-gray-900 mb-2">No payments found</h4>
            <p className="text-gray-500 font-body">
              {filter === "all" ? "No transactions have been processed yet" : `No ${filter} payments found`}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-header text-gray-700">Transaction</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Amount</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Method</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Type</th>
                  <th className="text-center py-4 px-6 font-header text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedPayments.map((payment, index) => (
                    <motion.tr
                      key={`${payment.id || index}-${payment.created_at}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Transaction Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-header text-gray-900">Payment Received</h4>
                            <p className="text-sm text-gray-600 font-body">
                              Transaction #{payment.id || `${index + 1}`.padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-header text-gray-900 text-lg">
                            {payment.amount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getPaymentColor(
                            payment.method,
                          )}`}
                        >
                          {getPaymentIcon(payment.method)}
                          <span className="capitalize">{payment.method || "Unknown"}</span>
                        </span>
                      </td>

                      {/* Transaction Type */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-header border ${getTypeColor(
                            payment,
                          )}`}
                        >
                          {getTypeIcon(payment)}
                          <span>{getTypeLabel(payment)}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-body text-gray-700">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500 font-body">
                              {new Date(payment.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      {payments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-header text-gray-900 mb-2">Payment Summary</h4>
              <p className="text-sm text-gray-600 font-body">Overview of your payment transactions</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-title text-green-900">${totalAmount.toLocaleString()}</div>
                <div className="text-sm text-green-700 font-body">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-emerald-900">{payments.length}</div>
                <div className="text-sm text-emerald-700 font-body">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-blue-900">
                  ${payments.length > 0 ? (totalAmount / payments.length).toFixed(0) : 0}
                </div>
                <div className="text-sm text-blue-700 font-body">Avg Transaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-title text-purple-900">{paymentMethods.length}</div>
                <div className="text-sm text-purple-700 font-body">Payment Methods</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdminPaymentsTable
