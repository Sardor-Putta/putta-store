import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold tracking-[0.2em] text-white mb-6">PUTTA</h2>
          <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
            Redefining modern luxury through silence and form. 
            Designed for the individual who speaks without words.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-medium tracking-widest text-xs mb-6">EXPLORE</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
            <li><Link to="/collections" className="hover:text-white transition-colors">Collections</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium tracking-widest text-xs mb-6">SUPPORT</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} PUTTA STUDIOS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;