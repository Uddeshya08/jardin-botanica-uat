import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import sensoralistImage from 'figma:asset/71a3ed929884384aa6617c6ae2f40a7724e33026.png';

const journalPosts = [
  {
    id: 1,
    title: "Above Us, Steorra Eau de Parfum: celestial literature",
    excerpt: "Discover the ancient techniques behind our essential oil extraction process, where time and patience create liquid poetry.",
    category: "Literature",
    date: "January 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1610618292314-e55c7ac33485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXRlcmF0dXJlJTIwc2hhZG93JTIwc2lsaG91ZXR0ZXxlbnwxfHx8fDE3NTY4OTUxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    title: "The story of Geranium Leaf Body Care",
    excerpt: "How our vintage laboratory equipment continues to shape contemporary fragrance making in an age of mass production.",
    category: "Lessons from the lab",
    date: "Five-minute read",
    imageUrl: "https://images.unsplash.com/photo-1601601319316-bace8ae2b548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBwcm9kdWN0cyUyMGxhYm9yYXRvcnklMjBncmVlbnxlbnwxfHx8fDE3NTY4OTUxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    title: "Sensorialist Literature",
    excerpt: "As nature transforms, so do our gardens. Exploring how seasonal changes influence our botanical collections and inspire new blends.",
    category: "Culture",
    date: "Thirty-minute read",
    imageUrl: "/assets/sensoralistImg.png"
  }
];

export function JournalSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 max-w-8xl mx-auto"
        >
          <h2 className="font-american-typewriter  text-3xl lg:text-4xl tracking-tight mb-6 text-black">
            From the Journal
          </h2>
        </motion.div>

        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {journalPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                {/* Image */}
              {/* Image */}
<motion.div
  className="aspect-[3/4] overflow-hidden mb-6"
>
  <motion.div
    whileHover={{ scale: 1.1 }} // smooth zoom only
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full h-full"
  >
    <ImageWithFallback
      src={post.imageUrl}
      alt={post.title}
      className="w-full h-full object-cover"
    />
  </motion.div>
</motion.div>

                
                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {/* Category */}
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                    viewport={{ once: true }}
                    className="font-din-arabic text-sm text-black/60 tracking-wide"
                  >
                    {post.category}
                  </motion.span>
                  
                  {/* Title */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                    className="font-american-typewriter text-xl leading-tight text-black group-hover:text-black/70 transition-colors duration-300"
                  >
                    {post.title}
                  </motion.h3>
                  
                  {/* Date/Read time */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.6 }}
                    viewport={{ once: true }}
                    className="font-din-arabic text-sm text-black/50"
                  >
                    {post.date}
                  </motion.p>
                </motion.div>
              </motion.article>
            ))}
          </div>
          
          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
            >
              View All
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}