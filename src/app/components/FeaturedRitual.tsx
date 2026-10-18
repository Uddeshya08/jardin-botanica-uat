import { useNewsletterSubscription } from "@lib/hooks/use-newsletter-subscription"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

export function FeaturedRitual() {
  const [isPressed, setIsPressed] = useState(false)
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false)
  const { email, setEmail, message, isSuccess, isPending, handleSubmit } =
    useNewsletterSubscription()

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: "#edede2" }}>
      <div className="flex flex-col-reverse md:flex-row">
        {/* Content - Left Side (40% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-2/5 flex flex-col justify-center px-6 py-8 md:pl-20 md:pr-16 md:py-17"
        >
          {/* Main Title - The Botanist's Hand Ritual */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 md:mb-8 text-black leading-tight"
          >
            The Botanist's Hand Ritual
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8 md:mb-12"
          >
            Clean that isn't squeaky; softness that isn't sticky.
            <br />A considered approach to hand care that brings together gentle exfoliation and
            lightweight nourishment in one everyday ritual.
          </motion.p>

          {/* Early access signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-md"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isEmailFormOpen ? (
                <motion.button
                  key="early-access-button"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEmailFormOpen(true)}
                  className="border border-black/30 bg-transparent px-6 py-3 font-din-arabic text-sm tracking-wide text-black transition-colors duration-300 hover:bg-black hover:text-white md:px-8 md:text-base"
                >
                  Get Early Access
                </motion.button>
              ) : (
                <motion.form
                  key="early-access-form"
                  initial={{ opacity: 0, width: "11rem" }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: "11rem" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onSubmit={handleSubmit}
                  className="origin-left overflow-hidden"
                >
                  <div className="flex w-full min-w-[18rem] border border-black/30 bg-transparent focus-within:border-black">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      aria-label="Email address for early access"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 font-din-arabic text-sm text-black outline-none placeholder:text-black/45 disabled:opacity-60 md:px-5 md:text-base"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="shrink-0 border-l border-black/30 bg-black px-4 py-3 font-din-arabic text-sm tracking-wide text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60 md:px-6"
                    >
                      {isPending ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="status"
                        className={`mt-3 font-din-arabic text-sm ${
                          isSuccess ? "text-[#52644a]" : "text-red-700"
                        }`}
                      >
                        {message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Image - Right Side (60% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative w-full md:w-[60%]"
        >
          {/* Fixed-size container */}
          <div className="h-[40vh] md:h-[60vh] overflow-hidden">
            {/* Image zooms inside container */}
            <motion.img
              src="/assets/handwashImg.png"
              alt="Jardin Botanica handwash with natural bristle brush"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              animate={{ scale: isPressed ? 1.03 : 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
