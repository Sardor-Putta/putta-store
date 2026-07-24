import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-12">
            {t('pages.contact.title')}
          </h1>

          <div className="text-neutral-400 leading-relaxed space-y-6">
            <p>
              {t('pages.contact.text')}
            </p>
            {/* TODO: replace with real support contact details before launch */}
            <p className="text-white font-bold tracking-widest text-sm">
              {t('pages.contact.comingSoon')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
