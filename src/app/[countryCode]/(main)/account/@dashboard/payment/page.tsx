"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app/components/ui/dialog"
import { Input } from "app/components/ui/input"
import { Label } from "app/components/ui/label"
import { ScrollArea } from "app/components/ui/scroll-area"
import { CreditCard, Edit, Plus, Trash2, Wallet } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

export default function PaymentPage() {
  const [editPaymentOpen, setEditPaymentOpen] = useState(false)
  const [deletePaymentOpen, setDeletePaymentOpen] = useState(false)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [loading, setLoading] = useState<"addPayment" | "deletePayment" | null>(null)

  const [newPayment, setNewPayment] = useState({
    type: "credit" as "credit" | "debit" | "upi",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    isDefault: false,
  })

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  }

  const handleAddPayment = async () => {
    setLoading("addPayment")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(null)
    setAddPaymentOpen(false)
    setNewPayment({
      type: "credit",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      upiId: "",
      isDefault: false,
    })
  }

  const handleDeletePayment = async (paymentType: string) => {
    setLoading("deletePayment")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(null)
    setDeletePaymentOpen(false)
    setSelectedPaymentId(null)
  }

  return (
    <motion.div
      key="credit-cards"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-8 lg:mb-16 text-black">
        Payment Methods
      </h1>

      <div className="space-y-12">
        {/* Credit Card 1 */}
        <motion.div
          className="py-8 border-b"
          style={{ borderColor: "#D8D2C7" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start mb-6 gap-12">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-8 rounded border border-black/10 flex items-center justify-center"
                style={{ backgroundColor: "#e3e3d8", borderColor: "#D8D2C7" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <CreditCard className="w-6 h-6 text-black/60" />
              </motion.div>
              <div>
                <h3 className="font-din-arabic text-base text-black tracking-wide mb-1">
                  •••• •••• •••• 4321
                </h3>
                <span className="font-din-arabic text-xs text-black/50 tracking-wide">
                  Expires 12/25 • Default
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={editPaymentOpen} onOpenChange={setEditPaymentOpen}>
                <DialogTrigger asChild>
                  <button
                    className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    <Edit className="w-5 h-5 text-black/60" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#e3e3d8" }}>
                  <DialogHeader className="pb-6">
                    <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                      Edit Payment Method
                    </DialogTitle>
                    <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                      Update your payment method information.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-72 pr-4">
                    <div className="space-y-6">
                      <div>
                        <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                          Card Number
                        </Label>
                        <Input
                          defaultValue="•••• •••• •••• 4321"
                          className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                          style={{ borderColor: "#D8D2C7" }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                            Expiry Date
                          </Label>
                          <Input
                            defaultValue="12/25"
                            className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                            style={{ borderColor: "#D8D2C7" }}
                          />
                        </div>
                        <div>
                          <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                            CVV
                          </Label>
                          <Input
                            defaultValue="123"
                            type="password"
                            className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                            style={{ borderColor: "#D8D2C7" }}
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-3 pt-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditPaymentOpen(false)}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                      style={{ borderColor: "#D8D2C7" }}
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditPaymentOpen(false)}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                      style={{ borderColor: "#D8D2C7" }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={deletePaymentOpen} onOpenChange={setDeletePaymentOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setSelectedPaymentId("card1")}
                    className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    <Trash2 className="w-5 h-5 text-black/60" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#e3e3d8" }}>
                  <DialogHeader className="pb-6">
                    <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                      Delete Payment Method
                    </DialogTitle>
                    <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                      Are you sure you want to delete this payment method? This action cannot be
                      undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeletePayment("Credit card")}
                      disabled={loading === "deletePayment"}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                      style={{ borderColor: "#D8D2C7" }}
                    >
                      {loading === "deletePayment" ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                        />
                      ) : (
                        "Delete"
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setDeletePaymentOpen(false)
                        setSelectedPaymentId(null)
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
        </motion.div>
      </div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Dialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
              style={{ borderColor: "#D8D2C7" }}
            >
              <Plus className="w-4 h-4" />
              Add payment method
            </motion.button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#e3e3d8" }}>
            <DialogHeader className="pb-6">
              <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">
                Add payment method
              </DialogTitle>
              <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-80 pr-4">
              <div className="space-y-6">
                {/* Payment Type Selection */}
                <div>
                  <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                    Payment Type
                  </Label>
                  <div className="mt-2 flex space-x-2">
                    {[
                      {
                        value: "credit",
                        label: "Credit Card",
                        icon: CreditCard,
                      },
                      { value: "debit", label: "Debit Card", icon: CreditCard },
                      { value: "upi", label: "UPI", icon: Wallet },
                    ].map((type) => {
                      const Icon = type.icon
                      return (
                        <motion.button
                          key={type.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setNewPayment({
                              ...newPayment,
                              type: type.value as "credit" | "debit" | "upi",
                            })
                          }
                          className={`flex-1 px-3 py-2 border rounded text-sm font-din-arabic tracking-wide transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
                            newPayment.type === type.value
                              ? "bg-black text-white border-black"
                              : "bg-transparent text-black hover:bg-black/5"
                          }`}
                          style={{
                            borderColor: newPayment.type === type.value ? "#000" : "#D8D2C7",
                          }}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {type.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {newPayment.type === "upi" ? (
                  // UPI Form
                  <>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        UPI ID
                      </Label>
                      <Input
                        value={newPayment.upiId}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            upiId: e.target.value,
                          })
                        }
                        placeholder="yourname@upi"
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Account Holder Name
                      </Label>
                      <Input
                        value={newPayment.cardholderName}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            cardholderName: e.target.value,
                          })
                        }
                        placeholder="Full name as per bank account"
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                  </>
                ) : (
                  // Card Form
                  <>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Card Number
                      </Label>
                      <Input
                        value={newPayment.cardNumber}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            cardNumber: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                          Expiry Date
                        </Label>
                        <Input
                          value={newPayment.expiryDate}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              expiryDate: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                          className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                          style={{ borderColor: "#D8D2C7" }}
                        />
                      </div>
                      <div>
                        <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                          CVV
                        </Label>
                        <Input
                          value={newPayment.cvv}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              cvv: e.target.value,
                            })
                          }
                          placeholder="123"
                          type="password"
                          className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                          style={{ borderColor: "#D8D2C7" }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                        Cardholder Name
                      </Label>
                      <Input
                        value={newPayment.cardholderName}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            cardholderName: e.target.value,
                          })
                        }
                        placeholder="Full name as on card"
                        className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                        style={{ borderColor: "#D8D2C7" }}
                      />
                    </div>
                  </>
                )}

                <motion.label
                  className="flex items-center space-x-3 cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <input
                    type="checkbox"
                    checked={newPayment.isDefault}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        isDefault: e.target.checked,
                      })
                    }
                    className="w-4 h-4 border bg-transparent focus:ring-0 transition-all duration-200"
                    style={{ borderColor: "#D8D2C7" }}
                  />
                  <span className="font-din-arabic text-sm text-black/60 tracking-wide">
                    Set as default payment method
                  </span>
                </motion.label>
              </div>
            </ScrollArea>
            <div className="flex space-x-3 pt-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddPayment}
                disabled={
                  loading === "addPayment" ||
                  !newPayment.cardholderName ||
                  (newPayment.type === "upi"
                    ? !newPayment.upiId
                    : !newPayment.cardNumber || !newPayment.expiryDate || !newPayment.cvv)
                }
                className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                style={{ borderColor: "#D8D2C7" }}
              >
                {loading === "addPayment" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                  />
                ) : (
                  "Add"
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAddPaymentOpen(false)
                  setNewPayment({
                    type: "credit",
                    cardNumber: "",
                    expiryDate: "",
                    cvv: "",
                    cardholderName: "",
                    upiId: "",
                    isDefault: false,
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
      </motion.div>
    </motion.div>
  )
}
