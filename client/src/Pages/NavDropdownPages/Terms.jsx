"use client"
import { motion } from "framer-motion"
import { FileText, BookOpen, AlertTriangle } from "lucide-react"

function Terms() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-title mb-4 text-gray-900">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
            Please read these terms carefully before using our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-header mb-4 text-gray-900">1. Acceptance of Terms</h2>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              By accessing or using the GOALI platform, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the platform following the
              posting of changes to these terms will be deemed your acceptance of those changes.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">2. User Accounts</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
              termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any
              activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
            <p>
              You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your
              account.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">3. Limitations</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              In no event shall GOALI be liable for any damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use or inability to use the materials on
              GOALI's platform, even if GOALI or a GOALI authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>
            <p>
              Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for
              consequential or incidental damages, these limitations may not apply to you.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-header mb-4 text-gray-900">4. Governing Law</h2>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, without
              regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
              rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
              provisions of these Terms will remain in effect.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 font-body">Last updated: July 22, 2025</p>
          <p className="text-gray-600 font-body mt-2">
            By using GOALI, you acknowledge that you have read these Terms of Service, understood them, and agree to be
            bound by them.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms
