import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Shipping: React.FC = () => {
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
            {t('pages.shipping.title')}
          </h1>

          <div className="space-y-12 text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">{t('pages.shipping.shippingHeading')}</h2>
              <p className="mb-3">{t('pages.shipping.freeShippingText')}</p>
              <p className="mb-3">{t('pages.shipping.processedText')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('pages.shipping.domestic')}</li>
                <li>{t('pages.shipping.international')}</li>
              </ul>
              <p className="mt-3">{t('pages.shipping.confirmationText')}</p>
            </section>

            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">{t('pages.shipping.returnsHeading')}</h2>
              <p className="mb-3">{t('pages.shipping.returnsText1')}</p>
              <p className="mb-3">{t('pages.shipping.returnsText2')}</p>
              <p>{t('pages.shipping.refundsText')}</p>
            </section>

            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">{t('pages.shipping.exchangesHeading')}</h2>
              <p>{t('pages.shipping.exchangesText')}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;
