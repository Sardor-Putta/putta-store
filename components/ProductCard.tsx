import React from 'react';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault(); // Prevent navigation when clicking size
    e.stopPropagation();
    addToCart(product, size);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-neutral-900 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full px-4">
               <p className="text-white text-xs tracking-widest mb-4 font-bold">QUICK ADD</p>
               <div className="flex flex-wrap gap-2 justify-center">
                 {product.sizes.map(size => (
                   <button 
                     key={size} 
                     onClick={(e) => handleSizeClick(e, size)}
                     className="text-white text-xs border border-neutral-500 hover:border-white hover:bg-white hover:text-black px-3 py-2 transition-all duration-200 min-w-[40px]"
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-white tracking-wide uppercase group-hover:text-neutral-300 transition-colors">{product.name}</h3>
            <p className="text-xs text-neutral-500 mt-1">{product.category}</p>
          </div>
          <span className="text-sm text-neutral-300">${product.price}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;