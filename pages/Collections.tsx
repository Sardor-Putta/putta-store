import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';

const Collections: React.FC = () => {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-center"
        >
          ARCHIVE
        </motion.h1>
        <p className="text-neutral-500 text-center text-sm tracking-[0.3em] uppercase mb-16">
          Season 01: Genesis Collection
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase border transition-colors duration-300 ${
                activeCategory === category
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-neutral-500 text-sm tracking-widest mt-24">
            NO PIECES IN THIS CATEGORY YET
          </p>
        )}
      </div>
    </div>
  );
};

export default Collections;
