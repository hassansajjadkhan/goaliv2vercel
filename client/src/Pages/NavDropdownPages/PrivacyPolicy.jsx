"use client"
import { motion } from "framer-motion"
import { Shield, Lock, Eye } from "lucide-react"

function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-title mb-4 text-gray-900">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
            How we collect, use, and protect your information
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-header mb-4 text-gray-900">Information We Collect</h2>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              We collect information to provide better services to all our users. The types of information we collect
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you provide to us (such as name, email address, payment information)</li>
              <li>Information we get from your use of our services (such as device information, log information)</li>
              <li>Location information (when you use location-enabled services)</li>
              <li>Local storage (we may collect and store information locally on your device)</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">How We Use Information</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              We use the information we collect to provide, maintain, protect and improve our services, to develop new
              ones, and to protect our users. We also use this information to offer you tailored content.
            </p>
            <p>
              When you contact us, we may keep a record of your communication to help solve any issues you might be
              facing. We may use your email address to inform you about our services, such as letting you know about
              upcoming changes or improvements.
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
            <Eye className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-header text-gray-900">Information Sharing</h2>
          </div>
          <div className="space-y-4 text-gray-700 font-body">
            <p>
              We do not share personal information with companies, organizations, or individuals outside of GOALI except
              in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>With your consent</strong> - We will share personal information with companies, organizations,
                or individuals outside of GOALI when we have your consent to do so.
              </li>
              <li>
                <strong>For legal reasons</strong> - We will share personal information if we have a good-faith belief
                that access, use, preservation, or disclosure of the information is reasonably necessary to meet any
                applicable law, regulation, legal process, or enforceable governmental request.
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 font-body">Last updated: July 22, 2025</p>
          <p className="text-gray-600 font-body mt-2">
            If you have any questions about our Privacy Policy, please contact us.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
