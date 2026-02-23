import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-12">
            WE ARE PUTTA.
          </h1>
          
          <div className="space-y-8 text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
            <p>
              Born in the void between luxury and utility. PUTTA represents a rejection of the unnecessary. We believe in the power of silence, structure, and form.
            </p>
            <p>
              Our garments are engineered for the modern individual who navigates the chaos of the city with calm confidence. We use premium materials, architectural cuts, and a monochromatic palette to create a uniform for the new era.
            </p>
            <p>
              We are not just a brand. We are a state of mind.
            </p>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900 p-8">
              <h3 className="text-white font-bold tracking-widest mb-4">CRAFTSMANSHIP</h3>
              <p className="text-neutral-500 text-sm">
                Every piece is constructed with meticulous attention to detail. From the weight of the cotton to the finish of the hardware, nothing is overlooked.
              </p>
            </div>
            <div className="bg-neutral-900 p-8">
              <h3 className="text-white font-bold tracking-widest mb-4">SUSTAINABILITY</h3>
              <p className="text-neutral-500 text-sm">
                We produce in limited quantities to minimize waste. Our materials are sourced responsibly, prioritizing longevity over trends.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;