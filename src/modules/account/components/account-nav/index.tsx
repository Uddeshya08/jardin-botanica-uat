"use client"

import { useParams, usePathname } from "next/navigation"
import { motion } from "motion/react"
import { 
  Settings, 
  Package, 
  MapPin, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  Heart 
} from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const sidebarItems = [
    { id: 'account', href: '/account', label: 'Account Settings', icon: Settings },
    { id: 'orders', href: '/account/orders', label: 'Orders', icon: Package },
    { id: 'ledger', href: '/account/ledger', label: 'Ledger', icon: Heart },
    { id: 'addresses', href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payment', href: '/account/payment', label: 'Payment Methods', icon: CreditCard },
  ]

  const isActive = (href: string) => {
    const path = route.split(countryCode)[1] || ''
    if (href === '/account') {
      return path === '/account' || path === '/account/'
    }
    return path === href || path.startsWith(href + '/')
  }

  // Desktop Sidebar
  return (
    <>
      <div className="hidden lg:block" data-testid="account-nav">
        {/* Greeting */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-2 text-center">
            <h2 className="font-american-typewriter text-3xl text-black tracking-wide">
              Hello, {customer?.first_name || "there"}
            </h2>
            <p className="font-din-arabic text-sm text-black/50 tracking-wide">
              Manage your account and preferences
            </p>
          </div>
        </motion.div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                <LocalizedClientLink href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded transition-all duration-300 ${
                      active
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black/5'
                    }`}
                    data-testid={`${item.id}-link`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-din-arabic tracking-wide">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${active ? 'rotate-90' : ''}`} />
                  </motion.button>
                </LocalizedClientLink>
              </motion.div>
            )
          })}
        </nav>

        <motion.div 
          className="mt-12 pt-8 border-t" 
          style={{ borderColor: "#D8D2C7" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-black hover:bg-black/5 rounded transition-all duration-300"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-din-arabic tracking-wide">Sign Out</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden" data-testid="mobile-account-nav">
        <div className="flex justify-center space-x-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <LocalizedClientLink key={item.id} href={item.href}>
                <button
                  className={`flex items-center justify-center p-4 rounded-full transition-all duration-300 min-w-[48px] min-h-[48px] ${
                    active
                      ? 'bg-black text-white shadow-lg ring-1 ring-[#D8D2C7]'
                      : 'text-black hover:bg-black/10 ring-1 ring-[#D8D2C7]'
                  }`}
                  title={item.label}
                  aria-label={item.label}
                  data-testid={`${item.id}-link`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default AccountNav
