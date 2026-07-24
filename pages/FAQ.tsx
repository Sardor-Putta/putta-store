import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const FAQ: React.FC = () => {
  const { t, dict } = useLanguage();
  const items: { q: string; a: string }[] = dict.pages.faq.items;

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-12">
            {t('pages.faq.title')}
          </h1>

          <div className="space-y-10">
            {items.map((faq, idx) => (
              <div key={idx} className="border-b border-neutral-900 pb-8">
                <h2 className="text-white font-bold tracking-wide mb-3">{faq.q}</h2>
                <p className="text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
