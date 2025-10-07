import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const collections = [
  {
    id: 1,
    name: "Heritage Herbarium",
    subtitle: "Pressed botanical specimens from 1890",
    description: "A curated collection of preserved flora documenting botanical diversity across centuries",
    imageUrl: "https://images.unsplash.com/photo-1618468121353-aaa41d8fb2e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBpbGx1c3RyYXRpb24lMjB2aW50YWdlJTIwaGVyYnN8ZW58MXx8fHwxNzU2ODE1NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Exhibition"
  },
  {
    id: 2,
    name: "Victorian Specimens",
    subtitle: "Rare plant collection from colonial expeditions",
    description: "Discover exotic flora brought back from botanical expeditions of the Victorian era",
    imageUrl: "https://images.unsplash.com/photo-1578509725196-53444c549731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcGxhbnQlMjBzcGVjaW1lbiUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU2ODE1NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Private Tour"
  },
  {
    id: 3,
    name: "Antique Botanical Prints",
    subtitle: "Original illustrations and pressed flowers",
    description: "Hand-illustrated botanical studies and preserved flowers from renowned naturalists",
    imageUrl: "https://images.unsplash.com/photo-1693069313209-a9c8eca1eb1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwYm90YW5pY2FsJTIwcHJpbnRzJTIwcHJlc3NlZCUyMGZsb3dlcnN8ZW58MXx8fHwxNzU2ODE1NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Gift Shop"
  }
];

export function BotanicalCollections() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl tracking-tight mb-4">
            Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated botanical collections, each telling a unique story 
            of discovery, preservation, and natural beauty.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-white mb-6">
                <ImageWithFallback
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl tracking-wide">
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-500 tracking-wider uppercase">
                  {collection.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {collection.description}
                </p>
                <div className="pt-2">
                  <span className="text-sm tracking-widest uppercase border-b border-black/20 pb-1">
                    {collection.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center px-8 py-3 border border-black/20 hover:bg-black hover:text-white transition-all duration-300 tracking-wide">
            View All Collections
          </button>
        </motion.div>
      </div>
    </section>
  );
}