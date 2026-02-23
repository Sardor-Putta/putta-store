import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const product = PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <p>Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[50vh] lg:h-auto bg-neutral-900 overflow-hidden"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ArrowLeft size={24} />
          </button>
        </motion.div>

        {/* Details Section */}
        <div className="p-8 lg:p-24 flex flex-col justify-center bg-neutral-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-neutral-500 tracking-widest text-sm mb-4">{product.category}</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 uppercase">{product.name}</h1>
            <p className="text-2xl text-neutral-300 mb-8">${product.price}</p>
            
            <p className="text-neutral-400 leading-relaxed mb-12 max-w-md">
              {product.description}
              <br /><br />
              Engineered for durability and comfort. A staple piece for the modern wardrobe.
            </p>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-white tracking-widest">SELECT SIZE</span>
                <span className="text-xs text-neutral-500 underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center text-sm font-medium transition-all duration-200 border ${
                      selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-red-500 text-xs mt-2 h-4 opacity-0 animate-pulse">Please select a size</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-5 text-sm font-bold tracking-[0.2em] transition-all duration-300 ${
                selectedSize 
                  ? 'bg-white text-black hover:bg-neutral-200' 
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {selectedSize ? 'ADD TO CART' : 'SELECT A SIZE'}
            </button>

            <div className="mt-12 border-t border-neutral-900 pt-8 space-y-4">
              <div className="flex items-center space-x-4 text-xs text-neutral-500">
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>In Stock</span>
                <span>•</span>
                <span>Free Shipping Worldwide</span>
                <span>•</span>
                <span>30 Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;