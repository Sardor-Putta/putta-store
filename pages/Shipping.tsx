import React from 'react';
import { motion } from 'framer-motion';

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-12">
            SHIPPING &amp; RETURNS
          </h1>

          <div className="space-y-12 text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">SHIPPING</h2>
              <p className="mb-3">Free worldwide shipping on all orders.</p>
              <p className="mb-3">Orders are processed within 1–3 business days. Once dispatched, delivery typically takes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Domestic: 3–5 business days</li>
                <li>International: 7–14 business days</li>
              </ul>
              <p className="mt-3">You'll receive a confirmation with tracking details once your order ships.</p>
            </section>

            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">RETURNS</h2>
              <p className="mb-3">We accept returns within 30 days of delivery, provided items are unworn, unwashed, and in original packaging with tags attached.</p>
              <p className="mb-3">To start a return, contact us with your order details and reason for return. We'll confirm the return address and next steps.</p>
              <p>Refunds are issued to the original payment method once the returned item is received and inspected.</p>
            </section>

            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">EXCHANGES</h2>
              <p>Need a different size? Reach out and we'll arrange an exchange for you, subject to availability.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;
