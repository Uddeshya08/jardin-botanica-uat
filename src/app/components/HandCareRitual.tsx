"use client"

import React from "react"
import { motion } from "motion/react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

export function HandCareRitualSection() {
  const ritualSteps = [
    {
      step: "01",
      title: "Cleanse",
      description:
        "Begin with the Tea Exfoliant Rinse, a botanical hand wash infused with fine exfoliating grains and the scent of black tea. Work into a light lather, allowing the texture to polish and refresh the skin.",
      botanical: "",
    },
    {
      step: "02",
      title: "Dry",
      description:
        "Pat hands dry with a soft towel. Avoid vigorous rubbing, which can deplete natural moisture and dull the skin's surface.",
      botanical: "",
    },
    {
      step: "03",
      title: "Nourish",
      description:
        "Follow with the Soft Orris Hand Lotion. Massage from fingertips to wrists, focusing on knuckles and dry areas. The orris root and mango butter infusion in our blend promises lasting softness — no matter how dry the hands.",
      botanical: "",
    },
    {
      step: "04",
      title: "Continue",
      description:
        "Repeat as you move through the day. Let touch, texture, and scent remind you that even the simplest moments of your daily life can become acts of care and indulgence.",
      botanical: "",
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mb-24 lg:mb-32"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="font-din-arabic text-black/50 text-xs mb-4" style={{ letterSpacing: "0.2em" }}>
            THE RITUAL
          </p>

          <h1 className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl mb-6" style={{ letterSpacing: "0.05em" }}>
            A daily hand care ritual
          </h1>

          <p
            className="font-din-arabic text-black/70 leading-relaxed max-w-2xl mx-auto"
            style={{ letterSpacing: "0.1em" }}
          >
            A quiet moment between tasks, this ritual restores balance and brings comfort to the skin through deliberate care and evocative scent — a small act of renewal woven into the rhythm of your day.
          </p>
        </motion.div>

        {/* Ritual Steps - Vertical Layout */}
        <div className="space-y-12 lg:space-y-16">
          {ritualSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative pb-6 sm:pb-12"
            >
              {/* Connector Line - Not for last item */}
              {index < ritualSteps.length - 1 && (
                <div className="absolute left-[1.25rem] top-14 bottom-[-2.5rem] w-px bg-gradient-to-b from-black/15 via-black/10 to-transparent hidden sm:block" />
              )}

              <div className="flex items-start gap-8 lg:gap-12">
                {/* Step Number with Circle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="flex-shrink-0 relative z-10"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-black/10 bg-[#e3e3d8] flex items-center justify-center group-hover:border-black/30 transition-colors duration-300">
                    <span
                      className="font-american-typewriter text-sm text-black/40 group-hover:text-black/60 transition-colors duration-300"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {step.step}
                    </span>
                  </div>
                </motion.div>
                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="font-american-typewriter text-xl lg:text-2xl mb-4" style={{ letterSpacing: "0.05em" }}>
                    {step.title}
                  </h3>

                  <p className="font-din-arabic text-black/70 leading-relaxed max-w-2xl" style={{ letterSpacing: "0.1em" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Image Feature */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 lg:mt-20 relative"
        >
          <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1670022001619-d1705efc8eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMHJpdHVhbCUyMHdhdGVyJTIwYm90YW5pY2FsfGVufDF8fHx8MTc2MjAwODc4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Hand care ritual"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlay Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-8 lg:p-12">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="font-din-arabic text-white/80 text-xs absolute top-8 right-8 lg:top-12 lg:right-12"
                style={{ letterSpacing: "0.2em" }}
              >
                NOTE FROM THE BOTANIST'S LAB
              </motion.p>
              <div className="flex items-center justify-center h-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="font-american-typewriter text-white text-xl lg:text-3xl text-center max-w-3xl"
                  style={{ letterSpacing: "0.05em" }}
                >
                  "Care for your hands as you would care for your garden — with patience, attention, and reverence."
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

