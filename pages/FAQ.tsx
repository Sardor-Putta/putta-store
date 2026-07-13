import React from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  {
    question: 'How do I place an order?',
    answer: 'Add items to your cart, select a size, and check out with your shipping details. Our team will reach out shortly after to confirm your order and arrange payment.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Domestic orders arrive in 3–5 business days, international orders in 7–14 business days, after 1–3 business days of processing. Shipping is free worldwide.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 30 days of delivery for unworn, unwashed items with tags attached. See our Shipping & Returns page for full details.',
  },
  {
    question: 'How do I choose the right size?',
    answer: 'Check the size selector on each product page, or ask our AI Stylist for a recommendation based on your height and weight.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'Yes — contact us as soon as possible after checkout. Once an order has shipped, changes are no longer possible.',
  },
];

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-12">
            FAQ
          </h1>

          <div className="space-y-10">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-neutral-900 pb-8">
                <h2 className="text-white font-bold tracking-wide mb-3">{faq.question}</h2>
                <p className="text-neutral-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
