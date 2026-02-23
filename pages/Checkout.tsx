import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { sendMessageToTelegram } from '../services/telegramService';

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const address = formData.get('address') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;

    // 1. Construct and send the Order Notification (to Admin)
    const productList = cartItems
      .map(item => `${item.name} — ${item.size} — ${item.quantity}`)
      .join('\n');

    const orderMessage = `NEW ORDER — PUTTA

Products:
${productList}

Total: $${cartTotal}

Customer:
Name: ${name}
Phone: ${phone}
City: ${city}
Address: ${address}, ${postalCode}, ${country}`;

    await sendMessageToTelegram(orderMessage);

    // 2. Construct and send the Confirmation Message (to Customer)
    // Note: In this demo, we send to the same configured Chat ID as we don't collect Customer Telegram ID.
    const confirmationMessage = `PUTTA received your order ✔
We will contact you within 10 minutes.
Thank you for choosing PUTTA.`;

    await sendMessageToTelegram(confirmationMessage);
    
    clearCart();
    setIsSubmitting(false);
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle size={64} className="text-white mb-6 mx-auto" />
          <h1 className="text-3xl font-bold text-white tracking-widest mb-4">ORDER CONFIRMED</h1>
          <p className="text-neutral-400 mb-8">Thank you for your purchase. Your order is being processed.</p>
          <Link to="/" className="bg-white text-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-neutral-200 transition-colors">
            RETURN HOME
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/shop" className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> BACK TO SHOP
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-bold text-white tracking-widest mb-8 border-b border-neutral-800 pb-4">SHIPPING DETAILS</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 tracking-wide">FULL NAME</label>
                <input name="fullName" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder="John Doe" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">PHONE NUMBER</label>
                  <input name="phone" required type="tel" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">CITY</label>
                  <input name="city" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder="New York" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 tracking-wide">DELIVERY ADDRESS</label>
                <input name="address" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder="123 Street Name, Apt 4B" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">POSTAL CODE</label>
                  <input name="postalCode" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder="10001" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">COUNTRY</label>
                  <select name="country" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors appearance-none">
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral-900 p-8 h-fit"
          >
            <h2 className="text-sm font-bold text-white tracking-widest mb-8 border-b border-neutral-800 pb-4">ORDER SUMMARY</h2>
            
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-800 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{item.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">SIZE: {item.size}</p>
                      <p className="text-xs text-neutral-500">QTY: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-neutral-800 mt-4">
                <span>TOTAL</span>
                <span>${cartTotal}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;