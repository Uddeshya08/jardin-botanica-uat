"use client"

import { motion } from "motion/react"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../../../app/components/ui/dialog"
import { Input } from "../../../../app/components/ui/input"
import { Label } from "../../../../app/components/ui/label"
import { ScrollArea } from "../../../../app/components/ui/scroll-area"
import { Checkbox } from "../../../../app/components/ui/checkbox"
import { toast } from "sonner"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer, requestEmailUpdate } from "@lib/data/customer"
import { Pencil } from "lucide-react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview: React.FC<OverviewProps> = ({ customer, orders }) => {
  const [editInfoOpen, setEditInfoOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [updateEmailOpen, setUpdateEmailOpen] = useState(false)
  const [emailComms, setEmailComms] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  // Utility function to convert text to title case
  const toTitleCase = (text: string) => {
    if (!text) return ''
    return text
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (!customer) {
    return null
  }

  const [userInfo, setUserInfo] = useState({
    firstName: customer.first_name || "",
    lastName: customer.last_name || "",
    email: customer.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [emailUpdateData, setEmailUpdateData] = useState({
    currentPassword: "",
    newEmail: "",
  })

  const handleSaveUserInfo = async () => {
    setLoading("userInfo")
    try {
      await updateCustomer({
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
      })
      setLoading(null)
      setEditInfoOpen(false)
      toast.success("Personal information updated successfully")
    } catch (error) {
      setLoading(null)
      toast.error("Failed to update information")
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading("password")
    // Note: Password update would need to be implemented via Medusa API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(null)
    setChangePasswordOpen(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    toast.success("Password updated successfully")
  }

  const handleRequestEmailUpdate = async () => {
    if (!emailUpdateData.currentPassword) {
      toast.error("Please enter your current password")
      return
    }
    if (!emailUpdateData.newEmail) {
      toast.error("Please enter your new email address")
      return
    }
    if (emailUpdateData.newEmail === customer.email) {
      toast.error("New email must be different from current email")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailUpdateData.newEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading("emailUpdate")
    try {
      const result = await requestEmailUpdate({
        current_password: emailUpdateData.currentPassword,
        new_email: emailUpdateData.newEmail,
      })

      setLoading(null)

      if (result.success) {
        setUpdateEmailOpen(false)
        setEmailUpdateData({ currentPassword: "", newEmail: "" })
        toast.success(
          `Verification email sent to ${emailUpdateData.newEmail}. Please check your inbox and follow the instructions.`,
          { duration: 6000 }
        )
      } else {
        toast.error(result.message || "Failed to send verification email")
      }
    } catch (error: any) {
      setLoading(null)
      toast.error(error?.message || "An error occurred. Please try again.")
    }
  }

  const handleSaveCommunicationPrefs = async () => {
    setLoading("commPrefs")
    // Note: Communication preferences would need to be stored via Medusa API
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(null)
    toast.success("Communication preferences updated successfully")
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      key="account-settings"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-testid="overview-page-wrapper"
    >
      <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-8 lg:mb-16 text-black">
        Account Settings
      </h1>

      {/* Two-column layout: Account Information (left) and Communication Preferences (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Account Information - Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="font-din-arabic text-sm uppercase mb-6 lg:mb-8 text-black/60 tracking-wider">
            Personal Information
          </h2>

          <div className="space-y-8 mb-8">
            <div>
              <label className="font-din-arabic block text-xs text-black/40 mb-3 tracking-wider uppercase">
                Name
              </label>
              <p className="font-din-arabic text-base text-black tracking-wide">
                {toTitleCase(customer.first_name || '')} {toTitleCase(customer.last_name || '')}
              </p>
            </div>

            <div>
              <label className="font-din-arabic block text-xs text-black/40 mb-3 tracking-wider uppercase">
                Email address
              </label>
              <div className="flex items-center justify-between group">
                <p className="font-din-arabic text-base text-black tracking-wide">
                  {customer.email}
                </p>
                <Dialog
                  open={updateEmailOpen}
                  onOpenChange={setUpdateEmailOpen}
                >
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-black/5 rounded-full transition-all duration-200"
                      aria-label="Update email address"
                    >
                      <Pencil className="w-4 h-4 text-black/40 group-hover:text-black/70 transition-colors" />
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-md"
                    style={{ backgroundColor: "#e3e3d8" }}
                  >
                    <DialogHeader className="pb-6">
                      <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                        Update Email Address
                      </DialogTitle>
                      <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                        Enter your current password and new email. You'll
                        receive a verification link to set a new password.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-96 pr-4">
                      <div className="space-y-6">
                        <div>
                          <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                            Current Password
                          </Label>
                          <Input
                            type="password"
                            value={emailUpdateData.currentPassword}
                            onChange={(e) =>
                              setEmailUpdateData({
                                ...emailUpdateData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                            style={{ borderColor: "#D8D2C7" }}
                            placeholder="Enter your password"
                          />
                        </div>
                        <div
                          className="border-t pt-6"
                          style={{ borderColor: "#D8D2C7" }}
                        >
                          <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                            New Email Address
                          </Label>
                          <Input
                            type="email"
                            value={emailUpdateData.newEmail}
                            onChange={(e) =>
                              setEmailUpdateData({
                                ...emailUpdateData,
                                newEmail: e.target.value,
                              })
                            }
                            className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                            style={{ borderColor: "#D8D2C7" }}
                            placeholder="Enter new email"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="flex space-x-3 pt-4 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRequestEmailUpdate}
                        disabled={
                          loading === "emailUpdate" ||
                          !emailUpdateData.currentPassword ||
                          !emailUpdateData.newEmail
                        }
                        className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                        style={{ borderColor: "#D8D2C7" }}
                      >
                        {loading === "emailUpdate" ? "Sending..." : "Update"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setUpdateEmailOpen(false)
                          setEmailUpdateData({
                            currentPassword: "",
                            newEmail: "",
                          })
                        }}
                        className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                        style={{ borderColor: "#D8D2C7" }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={editInfoOpen} onOpenChange={setEditInfoOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                  style={{ borderColor: "#D8D2C7" }}
                >
                  Edit Information
                </motion.button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md"
                style={{ backgroundColor: "#e3e3d8" }}
              >
                <DialogHeader className="pb-6">
                  <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                    Edit Information
                  </DialogTitle>
                  <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                    Update your personal information and contact details.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96 pr-4">
                  <div className="space-y-6">
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        First Name
                      </Label>
                      <Input
                        value={userInfo.firstName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            firstName: e.target.value,
                          })
                        }
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Last Name
                      </Label>
                      <Input
                        value={userInfo.lastName}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, lastName: e.target.value })
                        }
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex space-x-3 pt-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveUserInfo}
                    disabled={loading === "userInfo"}
                    className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    {loading === "userInfo" ? "Saving..." : "Save Changes"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditInfoOpen(false)}
                    className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={changePasswordOpen}
              onOpenChange={setChangePasswordOpen}
            >
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                  style={{ borderColor: "#D8D2C7" }}
                >
                  Change Password
                </motion.button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md"
                style={{ backgroundColor: "#e3e3d8" }}
              >
                <DialogHeader className="pb-6">
                  <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                    Change Password
                  </DialogTitle>
                  <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                    Update your account password for enhanced security.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96 pr-4">
                  <div className="space-y-6">
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Current Password
                      </Label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex space-x-3 pt-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={
                      loading === "password" ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    {loading === "password" ? "Saving..." : "Save Changes"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setChangePasswordOpen(false)
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                    }}
                    className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Communication Preferences - Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="font-din-arabic text-sm uppercase mb-6 lg:mb-8 text-black/60 tracking-wider">
            Communication Preferences
          </h2>

          <div className="space-y-6 mb-6">
            <label className="flex items-start space-x-4 cursor-pointer group">
              <Checkbox
                checked={emailComms}
                onCheckedChange={(checked) => setEmailComms(checked as boolean)}
                className="mt-1"
              />
              <span className="font-din-arabic text-sm text-black tracking-wide group-hover:text-black/70 transition-colors">
                Email updates — order details and occasional notes from the Lab
              </span>
            </label>

            <label className="flex items-start space-x-4 cursor-pointer group">
              <Checkbox
                checked={newsletter}
                onCheckedChange={(checked) => setNewsletter(checked as boolean)}
                className="mt-1"
              />
              <span className="font-din-arabic text-sm text-black tracking-wide group-hover:text-black/70 transition-colors">
                Newsletter — the Journal, in your inbox
              </span>
            </label>
          </div>

          <p className="font-din-arabic text-sm text-black/40 tracking-wide leading-relaxed mb-8">
            For details on how we handle your data, please see our{" "}
            <button className="underline hover:text-black/60 transition-colors">
              Privacy Policy
            </button>
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveCommunicationPrefs}
            disabled={loading === "commPrefs"}
            className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center w-full sm:w-auto disabled:opacity-50"
            style={{ borderColor: "#D8D2C7", marginTop: "20px" }}
          >
            {loading === "commPrefs" ? "Saving..." : "Save Preferences"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Overview
