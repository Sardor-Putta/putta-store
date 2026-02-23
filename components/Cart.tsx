import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-neutral-950 border-l border-neutral-800 z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
              <h2 className="text-xl font-bold tracking-widest text-white">CART ({cartItems.length})</h2>
              <button onClick={toggleCart} className="text-neutral-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-950">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                  <p className="tracking-widest text-sm">YOUR CART IS EMPTY</p>
                  <button onClick={toggleCart} className="text-white border-b border-white pb-1 text-xs tracking-widest hover:text-neutral-300 hover:border-neutral-300 transition-all">
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 animate-fade-in">
                    <div className="w-24 h-32 bg-neutral-900 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-white tracking-wide uppercase pr-4">{item.name}</h3>
                          <p className="text-sm text-white">${item.price * item.quantity}</p>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 mb-3">SIZE: {item.size}</p>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-neutral-800 rounded-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs text-white w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-xs text-neutral-500 hover:text-red-500 transition-colors self-start flex items-center gap-1 mt-2"
                      >
                        <Trash2 size={12} /> REMOVE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-800 bg-neutral-950">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-neutral-400 tracking-widest">SUBTOTAL</span>
                  <span className="text-xl font-bold text-white">${cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;