import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-12">
            CONTACT US
          </h1>

          <div className="text-neutral-400 leading-relaxed space-y-6">
            <p>
              Questions about an order, sizing, or anything else? Reach out and our team will get back to you.
            </p>
            {/* TODO: replace with real support contact details before launch */}
            <p className="text-white font-bold tracking-widest text-sm">
              Contact details coming soon.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
