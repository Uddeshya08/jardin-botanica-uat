"use client"

import { useEffect, useState, useRef } from "react"

export default function ScrollIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasBouncedRef = useRef(false)
  const lastScrollPositionRef = useRef<number>(0)
  const scrollStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkScrollPosition = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // Show indicator if:
      // 1. Not at the bottom (with 100px threshold)
      // 2. There's more content to scroll
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 100
      const hasMoreContent = documentHeight > windowHeight

      if (!isNearBottom && hasMoreContent) {
        setShowIndicator(true)
        // Trigger screen bounce only once when indicator first appears
        if (!hasBouncedRef.current) {
          hasBouncedRef.current = true
          document.body.classList.add('screen-bounce')
          setTimeout(() => {
            document.body.classList.remove('screen-bounce')
          }, 600)
        }
      } else {
        setShowIndicator(false)
        // Reset bounce flag when indicator hides
        hasBouncedRef.current = false
      }
    }

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY || document.documentElement.scrollTop
      
      // Hide indicator immediately when scrolling
      setShowIndicator(false)
      hasBouncedRef.current = false

      // Clear existing timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current)
      }

      // Update last scroll position
      lastScrollPositionRef.current = currentScrollPosition

      // Wait for scrolling to stop (check if position hasn't changed)
      scrollTimeoutRef.current = setTimeout(() => {
        const newScrollPosition = window.scrollY || document.documentElement.scrollTop
        
        // Only proceed if scroll position hasn't changed (user is at same place)
        if (Math.abs(newScrollPosition - lastScrollPositionRef.current) < 5) {
          // Wait 5 seconds after scrolling stops before showing indicator
          scrollStopTimeoutRef.current = setTimeout(() => {
            const finalScrollPosition = window.scrollY || document.documentElement.scrollTop
            
            // Double check user is still at same place (within 5px tolerance)
            if (Math.abs(finalScrollPosition - lastScrollPositionRef.current) < 5) {
              checkScrollPosition()
            }
          }, 5000) // 5 seconds delay
        }
      }, 100) // Small delay to detect scroll stop
    }

    // Initial check - wait 5 seconds after page load
    const initialTimeout = setTimeout(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      lastScrollPositionRef.current = scrollTop
      
      // Wait 5 seconds before showing indicator on initial load
      scrollStopTimeoutRef.current = setTimeout(() => {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop
        // Check if user hasn't scrolled
        if (Math.abs(currentScrollTop - lastScrollPositionRef.current) < 5) {
          checkScrollPosition()
        }
      }, 5000)
    }, 1000) // Initial delay to allow page to load

    const handleResize = () => {
      // Reset on resize
      setShowIndicator(false)
      hasBouncedRef.current = false
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current)
      }
      clearTimeout(initialTimeout)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-500 ${
        showIndicator ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="animate-bounce">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                Scroll
              </span>
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300 animate-pulse"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

