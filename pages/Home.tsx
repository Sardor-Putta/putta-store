import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/puttahero/1920/1080" 
            alt="Hero" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6"
          >
            SILENCE IS LOUD
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-neutral-300 text-lg md:text-xl tracking-widest mb-10 max-w-lg"
          >
            SEASON 01: GENESIS COLLECTION
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link 
              to="/shop" 
              className="group inline-flex items-center space-x-2 bg-white text-black px-8 py-4 text-sm font-bold tracking-widest hover:bg-neutral-200 transition-colors"
            >
              <span>SHOP NOW</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">LATEST ARRIVALS</h2>
          <Link to="/shop" className="text-sm text-neutral-400 hover:text-white transition-colors tracking-widest border-b border-transparent hover:border-white pb-1">
            VIEW ALL
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="py-12">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <img 
            src="https://picsum.photos/seed/puttaeditorial/1920/800" 
            alt="Editorial" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter">THE UNIFORM</h2>
              <p className="text-neutral-300 mb-8 tracking-widest">ENGINEERED FOR THE MODERN METROPOLIS</p>
              <Link to="/collections" className="text-white border border-white px-8 py-3 text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                EXPLORE CAMPAIGN
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;