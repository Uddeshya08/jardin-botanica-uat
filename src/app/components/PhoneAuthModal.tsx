"use client";

import { requestPhoneOTP, verifyPhoneOTP } from "@lib/data/customer";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export default function PhoneAuthModal({ isOpen, onClose, onSuccess }: PhoneAuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const otpInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
    setError("");
  };

  const handleRequestOTP = async () => {
    setError("");
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const data = await requestPhoneOTP(`+91${phone}`);
      if (data.success) {
        setStep("otp");
        setCountdown(60);
        setCanResend(false);
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) otpInputsRef.current[index + 1]?.focus();
    if (index === 5 && value && newOtp.every((d) => d)) handleVerifyOTP(newOtp.join(""));
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      otpInputsRef.current[5]?.focus();
      setTimeout(() => handleVerifyOTP(pastedData), 100);
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await verifyPhoneOTP(`+91${phone}`, code);
      if (data.success && data.token) {
        onSuccess(data.token);
        handleClose();
      } else {
        setError(data.error || "Invalid code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        otpInputsRef.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    await handleRequestOTP();
  };

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setCountdown(0);
    setCanResend(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
            style={{ backgroundColor: "#e3e3d8" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5 rounded-lg">
                  <Smartphone className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-xl font-american-typewriter text-black">
                  {step === "phone" ? "Sign in with Phone" : "Enter Verification Code"}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-black/60" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === "phone" ? (
                <div className="space-y-5">
                  <p className="font-din-arabic text-sm text-black/70">
                    Enter your phone number to receive a verification code
                  </p>

                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                      Phone Number*
                    </label>
                    <div className="flex">
                      <span
                        className="font-din-arabic flex items-center px-3 border border-r-0 text-black/60 text-sm bg-black/5"
                        style={{ borderColor: "#D8D2C7" }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className="font-din-arabic flex-1 p-4 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                        style={{ borderColor: error ? "#ef4444" : "#D8D2C7" }}
                        disabled={loading}
                        onKeyDown={(e) => e.key === "Enter" && handleRequestOTP()}
                      />
                    </div>
                    {error && <p className="mt-2 text-sm text-rose-600 font-din-arabic">{error}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    onClick={handleRequestOTP}
                    disabled={loading || phone.length < 10}
                    className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending Code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="text-center">
                    <p className="font-din-arabic text-sm text-black/70 mb-1">
                      We sent a 6-digit code to
                    </p>
                    <p className="font-din-arabic font-medium text-black">+91 {phone}</p>
                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp(["", "", "", "", "", ""]);
                        setError("");
                      }}
                      className="font-din-arabic text-sm text-black/60 hover:text-black underline mt-2"
                    >
                      Change number
                    </button>
                  </div>

                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-3 text-center tracking-wide">
                      Enter Verification Code
                    </label>
                    <div className="flex gap-2 justify-center" onPaste={handleOTPPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputsRef.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleOTPKeyDown(index, e)}
                          className="w-12 h-14 text-center text-2xl font-din-arabic border bg-white text-black focus:outline-none focus:border-black transition-all duration-300"
                          style={{ borderColor: error ? "#ef4444" : "#D8D2C7" }}
                          disabled={loading}
                        />
                      ))}
                    </div>
                    {error && (
                      <p className="mt-3 text-sm text-rose-600 font-din-arabic text-center">
                        {error}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    onClick={() => handleVerifyOTP()}
                    disabled={loading || otp.some((d) => !d)}
                    className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </motion.button>

                  <div className="text-center">
                    <p className="font-din-arabic text-sm text-black/70">
                      Didn't receive the code?
                    </p>
                    {canResend ? (
                      <button
                        onClick={handleResendOTP}
                        className="font-din-arabic text-sm text-black hover:text-black/70 underline mt-1"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <p className="font-din-arabic text-sm text-black/50 mt-1">
                        Resend in {countdown}s
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
