import React from 'react';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion';

export function HelpFAQ() {
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 lg:px-16" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h1 className="font-american-typewriter text-black mb-8" style={{ fontSize: '2rem' }}>
            Help & FAQ
          </h1>
          <p className="font-din-arabic text-black/80 mb-12 max-w-2xl mx-auto">
            If you're here, you're our kind of curious. Consider this a small field guide to how Jardin Botanica cares for what leaves its lab and how it reaches you.
          </p>

          {/* Summary Section */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 pb-10 border-b border-black/10">
              <div className="text-center md:text-left">
                <p className="font-din-arabic text-black/60 mb-2" style={{ fontSize: '0.75rem' }}>SHIPPING</p>
                <p className="font-din-arabic text-black/90">India-wide delivery</p>
                <p className="font-din-arabic text-black/90">Usually within 2–5 business days</p>
              </div>
              <div className="text-center md:text-left">
                <p className="font-din-arabic text-black/60 mb-2" style={{ fontSize: '0.75rem' }}>RETURNS</p>
                <p className="font-din-arabic text-black/90">Accepted only if damaged</p>
                <p className="font-din-arabic text-black/90">Notify us within 48 hours</p>
              </div>
              <div className="text-center md:text-left">
                <p className="font-din-arabic text-black/60 mb-2" style={{ fontSize: '0.75rem' }}>SUPPORT</p>
                <a
                  href="mailto:hello@jardinbotanica.com"
                  className="font-din-arabic text-black/90 hover:text-black transition-colors duration-300 underline decoration-black/20 hover:decoration-black/60 block"
                >
                  hello@jardinbotanica.com
                </a>
                <p className="font-din-arabic text-black/90">We read every message — <span className="italic">love notes included.</span></p>
              </div>
            </div>
            <p className="font-din-arabic text-black/70 text-center italic">
              Every parcel leaves the Botanist's Lab with care and intention.
            </p>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-0">
            {/* Orders & Payments */}
            <AccordionItem
              value="orders-payments"
              className="border-b border-black/10 px-0 pt-0 pb-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Orders & Payments
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  We accept UPI, major cards, and netbanking — safe, encrypted, and boring in the best way.
                </p>
                <p className="font-din-arabic text-black/80">
                  If your order hasn't shipped yet, we'll try to change or cancel it; write to{' '}
                  <a
                    href="mailto:hello@jardinbotanica.com"
                    className="text-black hover:text-black/70 transition-colors duration-300 underline decoration-black/30 hover:decoration-black/60"
                  >
                    hello@jardinbotanica.com
                  </a>
                  {' '}with the subject "Order Change – #[Order No.]".
                </p>
                <p className="font-din-arabic text-black/80">
                  If your confirmation email has gone wandering, check spam/promotions; if it's still hiding, tell us and we'll resend it.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping & Delivery */}
            <AccordionItem
              value="shipping-delivery"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Shipping & Delivery
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  We deliver India-wide — from our lab to your door in 3–5 days.
                </p>
                <p className="font-din-arabic text-black/80">
                  We hand off your parcel in 1–2 business days. Transit is typically 2–3 days to metro cities and 3–5 days elsewhere; remote PINs and holidays can add a beat.
                </p>
                <p className="font-din-arabic text-black/80">
                  Shipping is calculated at checkout based on your PIN code and parcel weight; it's on us for all orders above ₹2,500.
                </p>
                <p className="font-din-arabic text-black/80">
                  A tracking link lands in your inbox the moment your order leaves the Botanist's Lab.
                </p>
                <p className="font-din-arabic text-black/80">
                  If tracking says "delivered" but the parcel isn't with you, try building security, neighbours, and the courier's proof-of-delivery; if it's still missing after 48 hours, email us and we'll help locate it.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Returns, Replacements & Refunds */}
            <AccordionItem
              value="returns-refunds"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Returns, Replacements & Refunds
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  For hygiene and product integrity, we only accept returns for items that arrive damaged or defective.
                </p>
                <p className="font-din-arabic text-black/80">
                  If your order arrived damaged, email{' '}
                  <a
                    href="mailto:hello@jardinbotanica.com"
                    className="text-black hover:text-black/70 transition-colors duration-300 underline decoration-black/30 hover:decoration-black/60"
                  >
                    hello@jardinbotanica.com
                  </a>
                  {' '}within 48 hours with your order number, unboxing photos/videos (outer carton + inner product), and a short note on what went wrong. Once approved, we'll replace the item (or refund if a replacement isn't available). There is no return fee for verified cases.
                </p>
                <p className="font-din-arabic text-black/80">
                  We currently don't accept returns for unused candles or body products; we prefer every product's journey to stay short and certain.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Product & Ingredients */}
            <AccordionItem
              value="product-ingredients"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Product & Ingredients
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  At Jardin Botanica we pair the finest botanicals with proven actives — science-backed, sensorial, and made to be reached for daily. Full INCI lists are published on each product page.
                </p>
                <p className="font-din-arabic text-black/80">
                  Our products are 100% vegan and we never test on animals.
                </p>
                <p className="font-din-arabic text-black/80">
                  If you have sensitive skin, please patch-test first. Discontinue use if irritation occurs and consult your physician.
                </p>
                <p className="font-din-arabic text-black/80">
                  Most formulas are best within 12 months of opening. Store them cool, dry, and away from direct sun — think shade in a greenhouse.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Candle Care */}
            <AccordionItem
              value="candle-care"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Candle Care
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  Let the first burn reach a full melt pool (approx. 2–3 hours) to prevent tunneling.
                </p>
                <p className="font-din-arabic text-black/80">
                  Trim the wick to ~5 mm before each burn and keep the candle away from drafts.
                </p>
                <p className="font-din-arabic text-black/80">
                  Limit each session to 3–4 hours and retire the candle when ~1 cm of wax remains.
                </p>
                <p className="font-din-arabic text-black/80">
                  If the flame is dancing wildly, the wick is simply asking for a trim.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Gifting */}
            <AccordionItem
              value="gifting"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Gifting
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  We can add your message — just leave a note at checkout and select one of our gift-wrap options (a small fee may apply).
                </p>
                <p className="font-din-arabic text-black/80">
                  If you're sending gifts to multiple addresses, place separate orders or email us for concierge help.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Bespoke Orders & Partnerships */}
            <AccordionItem
              value="bespoke-partnerships"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Bespoke Orders & Partnerships
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  For corporate gifting, hotels, and design studio collaborations, write to{' '}
                  <a
                    href="mailto:hello@jardinbotanica.com"
                    className="text-black hover:text-black/70 transition-colors duration-300 underline decoration-black/30 hover:decoration-black/60"
                  >
                    hello@jardinbotanica.com
                  </a>
                  {' '}with your brief, timeline, and quantities. Each partnership is approached individually — we'll guide you on possibilities, lead times, and minimums.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Sustainability */}
            <AccordionItem
              value="sustainability"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Sustainability
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  We use recyclable containers, mindful inks, and recyclable shipper boxes.
                </p>
                <p className="font-din-arabic text-black/80">
                  Refills are coming in 2026 — we're working hard on the details.
                </p>
                <p className="font-din-arabic text-black/80">
                  At end-of-life, rinse and recycle where possible. Candle jars make excellent pen cups and mini planters.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Accounts & Rewards */}
            <AccordionItem
              value="accounts-rewards"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Accounts & Rewards
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <p className="font-din-arabic text-black/80">
                  Guest checkout is welcome; accounts make tracking and reorders effortless.
                </p>
                <p className="font-din-arabic text-black/80">
                  Rewards are coming soon.
                </p>
                <p className="font-din-arabic text-black/80">
                  If a password refuses to cooperate, tap Forgot Password or email us and we'll reset it with you.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Safety & Allergy */}
            <AccordionItem
              value="safety-allergy"
              className="border-b border-black/10 px-0 py-3 transition-all duration-300 hover:border-black/20"
            >
              <AccordionTrigger className="font-american-typewriter text-black hover:no-underline py-3" style={{ fontSize: '1.125rem' }}>
                Safety & Allergy
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-2">
                <p className="font-din-arabic text-black/80">
                  For external use only. Avoid eye contact; rinse with water if it occurs.
                </p>
                <p className="font-din-arabic text-black/80">
                  Keep candles and oils away from children and pets.
                </p>
                <p className="font-din-arabic text-black/80">
                  If you are pregnant, breastfeeding, or under medical care, please consult your physician before use.
                </p>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </motion.div>

        {/* Contact Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 pt-12 border-t border-black/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-american-typewriter text-black mb-6" style={{ fontSize: '1.75rem' }}>
              Contact Us
            </h2>
            <p className="font-din-arabic text-black/80 mb-8 leading-relaxed">
              Write to{' '}
              <a
                href="mailto:hello@jardinbotanica.com"
                className="text-black hover:text-black/70 transition-colors duration-300 underline decoration-black/30 hover:decoration-black/60"
              >
                hello@jardinbotanica.com
              </a>
              {' '}for support, questions, or thoughts you'd like to share. We read every message, and if something feels off, we'll make it right.
            </p>
            <button
              className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              style={{ borderColor: '#D8D2C7' }}
              onClick={() => window.location.href = 'mailto:hello@jardinbotanica.com'}
            >
              Send us a message
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

