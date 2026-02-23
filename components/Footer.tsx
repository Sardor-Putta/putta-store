import React from 'react';

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
            <li><a href="#" className="hover:text-white transition-colors">Shop All</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Editorials</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium tracking-widest text-xs mb-6">SUPPORT</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} PUTTA STUDIOS. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-neutral-400">Instagram</a>
          <a href="#" className="hover:text-neutral-400">Twitter</a>
          <a href="#" className="hover:text-neutral-400">TikTok</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;