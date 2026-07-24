import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { sendMessageToTelegram } from '../services/telegramService';
import { useLanguage } from '../context/LanguageContext';

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const address = formData.get('address') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;

    // 1. Construct and send the Order Notification (to Admin).
    // Always in Russian regardless of site language — this message is for
    // the shop owner, not the customer.
    const productList = cartItems
      .map(item => `${item.name} — ${item.size} — ${item.quantity}`)
      .join('\n');

    const orderMessage = `НОВЫЙ ЗАКАЗ — PUTTA

Товары:
${productList}

Итого: $${cartTotal}

Клиент:
Имя: ${name}
Телефон: ${phone}
Город: ${city}
Адрес: ${address}, ${postalCode}, ${country}`;

    const orderSent = await sendMessageToTelegram(orderMessage);

    if (!orderSent) {
      setSubmitError(t('checkout.submitError'));
      setIsSubmitting(false);
      return;
    }

    // 2. Construct and send the Confirmation Message.
    // Note: In this demo, we send to the same configured Chat ID as we don't collect Customer Telegram ID
    // — so this also lands in the admin's chat, hence Russian as well.
    const confirmationMessage = `PUTTA получил ваш заказ ✔
Мы свяжемся с вами в течение 10 минут.
Спасибо, что выбираете PUTTA.`;

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
          <h1 className="text-3xl font-bold text-white tracking-widest mb-4">{t('checkout.orderConfirmed')}</h1>
          <p className="text-neutral-400 mb-8">{t('checkout.thankYou')}</p>
          <Link to="/" className="bg-white text-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-neutral-200 transition-colors">
            {t('checkout.returnHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/shop" className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> {t('checkout.backToShop')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-bold text-white tracking-widest mb-8 border-b border-neutral-800 pb-4">{t('checkout.shippingDetails')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.fullName')}</label>
                <input name="fullName" required minLength={2} type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder={t('checkout.namePlaceholder')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.phoneNumber')}</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    pattern="[0-9+\-\s()]{7,20}"
                    title={t('checkout.phoneTitle')}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder={t('checkout.phonePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.city')}</label>
                  <input name="city" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder={t('checkout.cityPlaceholder')} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.deliveryAddress')}</label>
                <input name="address" required type="text" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors" placeholder={t('checkout.addressPlaceholder')} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.postalCode')}</label>
                  <input
                    name="postalCode"
                    required
                    type="text"
                    pattern="[A-Za-z0-9\-\s]{3,10}"
                    title={t('checkout.postalTitle')}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder={t('checkout.postalPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{t('checkout.country')}</label>
                  <select name="country" className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors appearance-none">
                    <option value="United States">{t('checkout.countries.us')}</option>
                    <option value="Canada">{t('checkout.countries.ca')}</option>
                    <option value="United Kingdom">{t('checkout.countries.gb')}</option>
                    <option value="Japan">{t('checkout.countries.jp')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-8">
                {submitError && (
                  <p className="text-red-500 text-sm mb-4">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
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
            <h2 className="text-sm font-bold text-white tracking-widest mb-8 border-b border-neutral-800 pb-4">{t('checkout.orderSummary')}</h2>

            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-800 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{item.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">{t('checkout.size')}: {item.size}</p>
                      <p className="text-xs text-neutral-500">{t('checkout.qty')}: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>{t('checkout.subtotalLabel')}</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>{t('checkout.shippingLabel')}</span>
                <span>{t('checkout.free')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-neutral-800 mt-4">
                <span>{t('checkout.total')}</span>
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
