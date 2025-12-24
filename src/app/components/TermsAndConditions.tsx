'use client'

import React from 'react'
import { motion } from 'motion/react'

interface TermsSection {
  number: string
  title: string
  content: string
  isContact?: boolean
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    number: "1",
    title: "Introduction",
    content: "Welcome to Jardin Botanica. By accessing or purchasing from our website, you agree to the Terms & Conditions outlined below. These are designed to ensure transparency and fairness in all interactions with our customers."
  },
  {
    number: "2",
    title: "Eligibility",
    content: "To place an order, you must be at least 18 years of age. By purchasing, you confirm that the information you provide is accurate and complete."
  },
  {
    number: "3",
    title: "Products & Availability",
    content: "We take great care to present our products accurately. However, availability may be limited, and product descriptions, pricing, and imagery are subject to updates without prior notice."
  },
  {
    number: "4",
    title: "Pricing & Payment",
    content: "All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated. We accept the payment methods shown at checkout. Orders are confirmed only once payment has been successfully processed."
  },
  {
    number: "5",
    title: "Shipping & Delivery",
    content: "We deliver across India and are expanding internationally. Estimated delivery times are provided at checkout but may vary due to external factors beyond our control. Once dispatched, we are not responsible for delays caused by courier partners or unforeseen circumstances."
  },
  {
    number: "6",
    title: "Returns & Refunds",
    content: "For reasons of safety, hygiene, and quality, we do not accept returns unless an item arrives damaged or defective. Please refer to our Returns & Exchanges Policy for details."
  },
  {
    number: "7",
    title: "Intellectual Property",
    content: "All content on this website—including text, images, design, and branding—belongs to Jardin Botanica. No part of this site may be copied, reproduced, or used without prior written consent."
  },
  {
    number: "8",
    title: "Limitation of Liability",
    content: "While we take pride in the quality of our products, Jardin Botanica is not liable for any indirect, incidental, or consequential damages arising from the use or misuse of our products or services."
  },
  {
    number: "9",
    title: "Amendments",
    content: "We may update these Terms & Conditions from time to time. Any changes will be posted on this page with the 'last updated' date. Continued use of the site implies acceptance of the revised terms."
  },
  {
    number: "10",
    title: "Governing Law",
    content: "These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in Bhopal, Madhya Pradesh."
  },
  {
    number: "11",
    title: "Contact",
    content: "For questions, concerns, or clarifications, please write to us at hello@jardinbotanica.com.",
    isContact: true
  }
]

export function TermsAndConditions() {

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="pt-8 mb-16 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-american-typewriter text-3xl mb-6 text-black">
            Terms & Conditions
          </h1>
          <div className="h-px w-20 bg-black/15 mb-6"></div>
          <p className="font-din-arabic text-black/50 tracking-wide">
            Last updated: October 5, 2025
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-0">
          {TERMS_SECTIONS.map((section, index) => (
            <motion.section
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`group relative border-b border-black/10 ${index === TERMS_SECTIONS.length - 1 ? 'border-b-0 py-10 pb-0' : 'py-10'}`}
            >
              <div className="flex gap-6 md:gap-10 items-start">
                {/* Number */}
                <div className="flex-shrink-0 w-10 pt-1">
                  <span className="font-din-arabic text-black/25 tracking-wide">
                    {section.number}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h2 className="font-american-typewriter mb-5 text-black font-bold">
                    {section.title}
                  </h2>
                  <p className="font-din-arabic text-black/65 leading-relaxed">
                    {section.isContact ? (
                      <>
                        For questions, concerns, or clarifications, please write to us at{' '}
                        <a 
                          href="mailto:hello@jardinbotanica.com" 
                          className="text-black underline decoration-black/20 hover:decoration-black/60 transition-all duration-300"
                        >
                          hello@jardinbotanica.com
                        </a>
                        .
                      </>
                    ) : (
                      section.content
                    )}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          className="mt-32 pt-16 border-t border-black/8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-black/8"></div>
              <span className="font-din-arabic text-black/20 text-xs">●</span>
              <div className="h-px w-12 bg-black/8"></div>
            </div>
            <p className="font-din-arabic text-black/40 tracking-wide text-sm">
             Thank you for choosing us
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}