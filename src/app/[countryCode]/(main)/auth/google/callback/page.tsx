"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { handleGoogleCallback } from "./action"

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const processCallback = async () => {
      // Convert searchParams to object
      const queryParams: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        queryParams[key] = value
      })

      // Call server action
      const result = await handleGoogleCallback(queryParams)

      if (result.success) {
        setStatus("success")
        // Redirect to account page after 1 second
        setTimeout(() => {
          router.push("/account")
        }, 1000)
      } else {
        setStatus("error")
        setError(result.error || "Authentication failed")
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Completing Google Sign In...</h2>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Successfully Authenticated!</h2>
            <p className="text-gray-500 mt-2">Redirecting to your account...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Authentication Failed</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
