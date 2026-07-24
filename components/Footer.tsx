import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold tracking-[0.2em] text-white mb-6">PUTTA</h2>
          <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium tracking-widest text-xs mb-6">{t('footer.explore')}</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link to="/shop" className="hover:text-white transition-colors">{t('footer.shopAll')}</Link></li>
            <li><Link to="/collections" className="hover:text-white transition-colors">{t('footer.collections')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium tracking-widest text-xs mb-6">{t('footer.support')}</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link to="/contact" className="hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">{t('footer.shippingReturns')}</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">{t('footer.sizeGuide')}</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">{t('footer.faq')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} PUTTA STUDIOS. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
