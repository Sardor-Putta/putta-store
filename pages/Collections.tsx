import React from 'react';
import { COLLECTIONS } from '../constants';
import { motion } from 'framer-motion';

const Collections: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-16 text-center"
        >
          ARCHIVE
        </motion.h1>

        <div className="space-y-24">
          {COLLECTIONS.map((collection, index) => (
            <motion.div 
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="relative aspect-[16/9] overflow-hidden mb-6">
                <img 
                  src={collection.image} 
                  alt={collection.title} 
                  className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-800 pb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest mb-2">{collection.title}</h2>
                  <p className="text-neutral-500 max-w-md">{collection.description}</p>
                </div>
                <button className="mt-4 md:mt-0 text-white text-sm tracking-[0.2em] hover:text-neutral-400 transition-colors">
                  VIEW LOOKBOOK
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;