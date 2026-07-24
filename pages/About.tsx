import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-12">
            {t('about.title')}
          </h1>

          <div className="space-y-8 text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900 p-8">
              <h3 className="text-white font-bold tracking-widest mb-4">{t('about.craftsmanshipTitle')}</h3>
              <p className="text-neutral-500 text-sm">
                {t('about.craftsmanshipText')}
              </p>
            </div>
            <div className="bg-neutral-900 p-8">
              <h3 className="text-white font-bold tracking-widest mb-4">{t('about.sustainabilityTitle')}</h3>
              <p className="text-neutral-500 text-sm">
                {t('about.sustainabilityText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
