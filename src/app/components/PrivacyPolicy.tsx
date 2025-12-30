'use client'

import React from 'react'
import { motion } from 'motion/react'

interface PrivacySection {
  number: string
  title: string
  content: string
  isContact?: boolean
  subsections?: { title: string; content: string }[]
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    number: "1",
    title: "Who We Are (Data Fiduciary / Controller)",
    content: "Legal entity name: Jardin Botanica (OPC) Pvt. Ltd. | Brand name: Jardin Botanica | Registered address: 153, Floor 4, Zone 1, M.P. Nagar, Bhopal, M.P. 462011 | Contact email: hello@jardinbotanica.com"
  },
  {
    number: "2",
    title: "What This Policy Covers",
    content: "This Policy applies to: Visitors to our Site, Customers who place orders, People who sign up for our newsletter, waitlist, or updates, and People who contact us (email, forms, social)."
  },
  {
    number: "3",
    title: "Personal Data We Collect",
    content: "We collect the following types of information:",
    subsections: [
      {
        title: "A) Information you provide",
        content: "Contact details: name, email, phone number | Order details: shipping address, billing address, items purchased, order notes | Account information (if you create an account): login details and preferences | Messages you send us: emails, support requests, feedback"
      },
      {
        title: "B) Information collected automatically",
        content: "Device + usage data: IP address, browser type, device identifiers, pages viewed, actions on the Site, approximate location (city/region) | Cookies and similar technologies"
      },
      {
        title: "C) Payment information",
        content: "Payments on our Site are processed by Razorpay. We do not store full card details on our servers. Razorpay may collect and process payment data directly to complete your transaction."
      }
    ]
  },
  {
    number: "4",
    title: "Why We Collect and Use Personal Data",
    content: "We use your personal data to: Process orders, payments, deliveries, returns, and refunds | Communicate with you about your order (confirmations, shipping updates, service messages) | Provide customer support and resolve issues | Send marketing communications if you opt in (email/SMS), and measure their performance | Maintain site security, prevent fraud, and protect our business and customers | Improve our Site, products, and customer experience (analytics and performance) | Comply with applicable laws, regulations, and lawful requests"
  },
  {
    number: "5",
    title: "Consent, Choices, and Marketing",
    content: "Marketing: If you sign up to receive marketing texts or emails, you can unsubscribe anytime using the link in our emails. If we send SMS (if enabled), you can opt out using the instructions in the message or by contacting us. | Cookie preferences: Where required, we provide a cookie banner to accept/reject non-essential cookies."
  },
  {
    number: "6",
    title: "Cookies and Analytics",
    content: "We use cookies and similar technologies to: Keep the Site working (essential cookies) | Understand Site usage and improve performance (analytics cookies, if enabled) | Support advertising/retargeting (marketing cookies, if enabled). You can manage cookies through our cookie banner (where available), and/or your browser settings (you can block or delete cookies). Note: Blocking certain cookies may impact how the Site functions."
  },
  {
    number: "7",
    title: "Payment Processing (Razorpay)",
    content: "We use Razorpay to process payments. When you pay, your payment details may be collected and processed by Razorpay in accordance with their terms and privacy practices. We receive confirmation of payment and limited transaction details needed to fulfill your order. Razorpay privacy policy: https://razorpay.com/privacy/ | Buyer privacy notice: https://razorpay.com/buyer-privacy-notice/"
  },
  {
    number: "8",
    title: "Email / SMS / Transactional Communications (Brevo)",
    content: "We use Brevo to send: Transactional messages (order confirmations, shipping updates, service emails) | Marketing emails (if you opt in) | SMS/WhatsApp communications (only if enabled and if you opt in, where required). Brevo may process your contact details and engagement data (e.g., email opens/clicks) so we can deliver messages and improve communication. Brevo privacy policy: https://www.brevo.com/legal/privacypolicy/"
  },
  {
    number: "9",
    title: "Website Hosting (Amazon Web Services – AWS)",
    content: "Our Site is hosted on Amazon Web Services (\"AWS\"), a cloud infrastructure provider. Personal data you submit through the Site (such as order details and contact information) may be processed and stored on AWS-hosted systems that we manage or that our service providers manage on our behalf. AWS operates and secures the underlying cloud infrastructure, while we remain responsible for how our application is configured and how personal data is handled within our systems (including access controls and encryption where applicable). Depending on how our services are configured and where our service providers operate, your personal data may be processed in locations outside India. We take reasonable steps to ensure appropriate safeguards are in place consistent with applicable law and vendor commitments. AWS Privacy Notice: https://aws.amazon.com/privacy/ | AWS Shared Responsibility Model: https://aws.amazon.com/compliance/shared-responsibility-model/"
  },
  {
    number: "10",
    title: "Who We Share Personal Data With",
    content: "We share personal data only as needed to run our business, including with: Website and hosting provider: AWS | Payment processor: Razorpay | Email/SMS service provider: Brevo | Shipping and logistics partners: Delhivery | Professional advisors and authorities where required by law (accountants, lawyers, regulators). We do not sell your personal data."
  },
  {
    number: "11",
    title: "International Data Transfers",
    content: "Some of our service providers (including AWS and Brevo) may process data outside India. When this happens, we take reasonable steps to ensure appropriate safeguards are in place consistent with applicable law and vendor commitments."
  },
  {
    number: "12",
    title: "Data Retention",
    content: "We keep personal data only as long as necessary for: Order fulfillment and customer support | Legal, tax, accounting, and compliance requirements | Security and fraud prevention | Marketing until you unsubscribe/withdraw consent (as applicable)"
  },
  {
    number: "13",
    title: "Security",
    content: "We implement reasonable administrative, technical, and physical safeguards designed to protect personal data. No method of transmission or storage is 100% secure, but we work to protect your information and reduce risk."
  },
  {
    number: "14",
    title: "Your Rights (Access, Correction, Deletion, Withdrawal)",
    content: "Subject to applicable law, you may request: Access to your personal data | Correction of inaccurate data | Deletion of your personal data | Withdrawal of consent (where processing is based on consent) | Information about how your data is processed. To make a request, email: hello@jardinbotanica.com. We may need to verify your identity before completing requests."
  },
  {
    number: "15",
    title: "Children's Privacy",
    content: "Our Site is not intended for children. We do not knowingly collect personal data from children. If you believe a child has provided us personal data, please contact us and we will take steps to delete it."
  },
  {
    number: "16",
    title: "Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will post the updated version on this page with a new \"Effective date\"."
  },
  {
    number: "17",
    title: "Grievance / Contact",
    content: "If you have questions, requests, or concerns about privacy, contact: hello@jardinbotanica.com",
    isContact: true
  }
]

export function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <div className="h-px w-20 bg-black/15 mb-6"></div>
          <p className="font-din-arabic text-black/50 tracking-wide">
            Effective date: February 01, 2026
          </p>
        </motion.div>

        {/* Intro Text */}
        <motion.div
          className="mb-12 pb-8 border-b border-black/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-din-arabic text-black/65 leading-relaxed text-center">
            This Privacy Policy explains how Jardin Botanica ("Jardin Botanica", "we", "us", "our") collects, uses, shares, 
            and protects your personal data when you visit or make a purchase from our Site, or otherwise interact with us.
            If you do not agree with this Policy, please do not use the Site.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-0">
          {PRIVACY_SECTIONS.map((section, index) => (
            <motion.section
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`group relative  border-black/10 ${index === PRIVACY_SECTIONS.length - 1 ? 'border-b-0 py-10 pb-0' : 'py-10'}`}
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
                  <div className="font-din-arabic text-black/65 leading-relaxed">
                    {section.isContact ? (
                      <>
                        If you have questions, requests, or concerns about privacy, contact:{' '}
                        <a 
                          href="mailto:hello@jardinbotanica.com" 
                          className="text-black underline decoration-black/20 hover:decoration-black/60 transition-all duration-300"
                        >
                          hello@jardinbotanica.com
                        </a>
                      </>
                    ) : (
                      <>
                        {section.content.split(' | ').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-3' : ''}>
                            {line}
                          </p>
                        ))}
                        {section.subsections && (
                          <div className="mt-6 space-y-4 ml-4">
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex}>
                                <h3 className="font-din-arabic font-semibold text-black/80 mb-2">
                                  {subsection.title}
                                </h3>
                                {subsection.content.split(' | ').map((line, i) => (
                                  <p key={i} className={`text-black/65 ${i > 0 ? 'mt-2' : ''}`}>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          className="pt-10 border-black/8"
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
              Your privacy matters to us
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

