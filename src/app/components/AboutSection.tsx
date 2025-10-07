import React from 'react';
import { motion } from 'motion/react';

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl tracking-tight mb-8">
              A Living Museum
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
              <p className="text-xl mb-6">
                Since 1867, Jardin Botanica has been a sanctuary for botanical research, 
                education, and the preservation of plant heritage from around the world.
              </p>
              <p className="mb-6">
                Our Victorian-era conservatories house over 10,000 species of plants, 
                many of which are rare or endangered. Each greenhouse tells a different 
                story - from tropical rainforests to arid deserts, from medicinal herbs 
                to exotic orchids.
              </p>
              <p>
                We believe that in connecting with nature's beauty and complexity, 
                we connect with something essential about ourselves. Every visit is an 
                invitation to slow down, observe, and rediscover wonder in the natural world.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-3xl mb-2">10,000+</div>
              <div className="text-sm tracking-widest text-gray-500 uppercase">Plant Species</div>
            </div>
            <div>
              <div className="text-3xl mb-2">156</div>
              <div className="text-sm tracking-widest text-gray-500 uppercase">Years of Heritage</div>
            </div>
            <div>
              <div className="text-3xl mb-2">15</div>
              <div className="text-sm tracking-widest text-gray-500 uppercase">Historic Conservatories</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}