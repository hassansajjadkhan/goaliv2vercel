import React from "react"
import Header from "./Navbar"
import Footer from "./Footer"

function Layout({
  children,

  // Header props
  headerTitle,
  headerSubtitle,
  showBackButton = false,
  showUserMenu = false,
  headerTransparent = false,

  // Footer props
  showFooter = true,
  footerVariant = "default",

  // Layout props
  className = "",
  contentClassName = "",
  fullHeight = false,
}) {
  const layoutClasses = fullHeight
    ? "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30"
    : "bg-gradient-to-br from-gray-50 to-blue-50/30"

  return (
    <div className={`${layoutClasses} ${className}`}>
      {/* Header */}
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        showBackButton={showBackButton}
        showUserMenu={showUserMenu}
        isTransparent={headerTransparent}
      />

      {/* Main Content Area */}
      <main className={`pt-16 ${fullHeight ? "min-h-screen" : ""} ${contentClassName}`}>
        <div className="flex-grow">{children}</div>
      </main>

      {/* Footer */}
      {showFooter && <Footer variant={footerVariant} />}
    </div>
  )
}

export default Layout
