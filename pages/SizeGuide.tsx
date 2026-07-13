import React from 'react';
import { motion } from 'framer-motion';

const TOP_SIZES = [
  { size: 'S', chest: '38–40"', length: '27"' },
  { size: 'M', chest: '40–42"', length: '28"' },
  { size: 'L', chest: '42–44"', length: '29"' },
  { size: 'XL', chest: '44–46"', length: '30"' },
  { size: 'XXL', chest: '46–48"', length: '31"' },
];

const BOTTOM_SIZES = [
  { size: 'S', waist: '28–30"', inseam: '30"' },
  { size: 'M', waist: '30–32"', inseam: '30"' },
  { size: 'L', waist: '32–34"', inseam: '31"' },
  { size: 'XL', waist: '34–36"', inseam: '31"' },
];

const SizeGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
            SIZE GUIDE
          </h1>
          <p className="text-neutral-500 mb-12">
            PUTTA runs true to an oversized fit. Measurements below are approximate — for a more relaxed look, size up.
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-6">TOPS &amp; HOODIES</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-400">
                  <thead>
                    <tr className="border-b border-neutral-800 text-white">
                      <th className="py-3 pr-6">Size</th>
                      <th className="py-3 pr-6">Chest</th>
                      <th className="py-3">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_SIZES.map(row => (
                      <tr key={row.size} className="border-b border-neutral-900">
                        <td className="py-3 pr-6 text-white">{row.size}</td>
                        <td className="py-3 pr-6">{row.chest}</td>
                        <td className="py-3">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold tracking-widest text-sm mb-6">BOTTOMS</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-400">
                  <thead>
                    <tr className="border-b border-neutral-800 text-white">
                      <th className="py-3 pr-6">Size</th>
                      <th className="py-3 pr-6">Waist</th>
                      <th className="py-3">Inseam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BOTTOM_SIZES.map(row => (
                      <tr key={row.size} className="border-b border-neutral-900">
                        <td className="py-3 pr-6 text-white">{row.size}</td>
                        <td className="py-3 pr-6">{row.waist}</td>
                        <td className="py-3">{row.inseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="text-neutral-500 text-sm">
              Still unsure? Ask the PUTTA AI Stylist for a size recommendation based on your height and weight.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SizeGuide;
