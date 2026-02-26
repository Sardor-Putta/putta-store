import React from 'react';
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
         <div className="text-center text-white text-2xl">
  Collections Coming Soon
</div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
