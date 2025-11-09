"use client"
import { motion } from "framer-motion"
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from "lucide-react"

function Payments() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-title mb-4 text-gray-900">Payments</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
            Secure, transparent, and easy payment processing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-header mb-4 text-gray-900">Payment Methods</h2>
          <div className="space-y-4 text-gray-700 font-body">
            <p>GOALI accepts the following payment methods:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <CreditCard className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-header text-gray-900">Credit & Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <svg
                  className="h-8 w-8 text-blue-600 mr-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <h3 className="font-header text-gray-900">Bank Transfers</h3>
                  <p className="text-sm text-gray-600">ACH, Wire Transfers</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">Payment Security</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              Your payment information is always protected. We use industry-standard encryption to protect your personal
              and financial data.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All transactions are encrypted using SSL technology</li>
              <li>We are PCI DSS compliant</li>
              <li>We do not store your full credit card information on our servers</li>
              <li>Our payment processing partners maintain the highest security standards</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">Refund Policy</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>Our refund policy varies depending on the type of transaction:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Donations:</strong> Generally non-refundable, but exceptions may be made in special
                circumstances.
              </li>
              <li>
                <strong>Event Tickets:</strong> Refundable up to 7 days before the event, unless otherwise specified.
              </li>
              <li>
                <strong>Membership Fees:</strong> Refundable within 30 days of purchase if no services have been used.
              </li>
            </ul>
            <p className="mt-4">For any refund requests or questions, please contact our support team.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 font-body">Have questions about payments? Contact our support team.</p>
          <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-header hover:from-blue-700 hover:to-purple-700 transition-colors">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Payments
