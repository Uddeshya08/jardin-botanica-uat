'use client'
import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

export function Footer() {
  const footerSections = [
    {
      title: 'ABOUT US',
      links: [
        { name: 'Brand', href: '#' },
        { name: 'Journal', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'SHOP',
      links: [
        { name: 'Home Creations', href: '#' },
        { name: 'Collections', href: '#' },
        { name: 'Gift Sets', href: '#' },
      ],
    },
    {
      title: 'ORDERS AND SUPPORT',
      links: [
        { name: 'Order History', href: '#' },
        { name: 'Track Your Order', href: '#' },
        { name: 'Help & FAQs', href: '#' },
        { name: 'Returns & Exchanges', href: '#' },
        { name: 'Terms & Conditions', href: '#' },
      ],
    },
    {
      title: 'FOLLOW US',
      links: [
        { name: 'Instagram', href: '#' },
        { name: 'Facebook', href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h4 className="font-american-typewriter text-xl tracking-widest">
              <Image
                src="/assets/Jardinlogo.svg"
                alt="JArdin"
                width={200}
                height={60}
                className="transition-all duration-300"
              />
            </h4>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <h5 className="font-din-arabic text-sm tracking-wider text-white/80 mb-4 uppercase">
                {section.title}
              </h5>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: sectionIndex * 0.1 + linkIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4, color: '#ffffff' }}
                      className="font-din-arabic text-sm text-white/60 hover:text-white transition-all duration-300 block"
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10"
        >
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-0"
          >
            <p className="font-din-arabic text-sm text-white/60">
              © 2025 Jardin Botanica. All rights reserved.
            </p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <span className="font-din-arabic text-md text-white/60 ">
              We accept:
            </span>
            <div className="flex gap-3">
              {/* American Express */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-8 bg-white rounded flex items-center justify-center"
              >
                <img
                  src="/assets/payment-amex.svg"
                  alt="American Express"
                  className="w-10 h-8"
                />
              </motion.div>

              {/* PayPal */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-8 bg-white rounded flex items-center justify-center"
              >
                <img
                  src="/assets/payment-upi.svg"
                  alt="PayPal"
                  className="w-10 h-8"
                />
              </motion.div>

              {/* Visa */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-8 bg-white rounded flex items-center justify-center"
              >
                <img
                  src="/assets/payment-visa.svg"
                  alt="Visa"
                  className="w-10 h-8"
                />
              </motion.div>

              {/* Mastercard */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-8 bg-white rounded flex items-center justify-center"
              >
                <img
                  src="/assets/payment-mastercard.svg"
                  alt="Mastercard"
                  className="w-10 h-8"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
