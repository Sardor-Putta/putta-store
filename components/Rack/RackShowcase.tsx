import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

type RackProduct = Product & { rack: NonNullable<Product['rack']> };

/** Garment height on the rack (desktop px). Mobile scales it down via CSS. */
const HEIGHT_BY_CATEGORY: Record<string, number> = {
  Tops: 220,
  Hoodies: 250,
  Bottoms: 330,
  Accessories: 140,
};

const SPRING = { type: 'spring', stiffness: 260, damping: 26 } as const;

/** Order on the rail — mixes colours and types so neighbours contrast. Unlisted rack products go last. */
const RACK_ORDER = ['1', '2', '5', '3', '10', '4', '9', '8', '11'];

const useIsDesktop = () => {
  const query = '(min-width: 768px)';
  const [match, setMatch] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return match;
};

const Hook: React.FC = () => (
  <svg width="22" height="32" viewBox="0 0 22 32" fill="none" aria-hidden className="block mx-auto">
    <path
      d="M11 32 V19 C11 15 4 14 4 8.5 C4 4 7.4 1.5 11 1.5 C14.6 1.5 18 4 18 7.5"
      stroke="#7d7d7d"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const RackShowcase: React.FC = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const isDesktop = useIsDesktop();
  const sideWidth = isDesktop ? 46 : 30;

  const items = useMemo(
    () => {
      const rank = (id: string) => {
        const r = RACK_ORDER.indexOf(id);
        return r === -1 ? RACK_ORDER.length : r;
      };
      return PRODUCTS.filter((p): p is RackProduct => Boolean(p.rack)).sort(
        (a, b) => rank(a.id) - rank(b.id)
      );
    },
    []
  );

  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [size, setSize] = useState<string | null>(null);

  const open = (i: number) => {
    setSelected(i);
    setSide('front');
    setSize(null);
    setHovered(null);
  };
  const close = useCallback(() => setSelected(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setSelected(cur => (cur === null ? cur : (cur + dir + items.length) % items.length));
      setSide('front');
      setSize(null);
    },
    [items.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close, step]);

  if (items.length === 0) return null;

  const current = selected !== null ? items[selected] : null;

  const onSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) step(1);
    else if (info.offset.x > 60) step(-1);
  };

  return (
    <section className="relative bg-[#ecebe7] text-neutral-950 py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home.rack.title')}</h2>
        <p className="text-neutral-500 text-xs md:text-sm tracking-[0.2em] mt-3 uppercase">
          {t('home.rack.subtitle')}
        </p>
      </div>

      <div className="relative h-[560px] md:h-[640px]">
        {/* ---------- Rack ---------- */}
        <motion.div
          animate={{
            filter: current ? 'blur(7px)' : 'blur(0px)',
            opacity: current ? 0.35 : 1,
          }}
          transition={{ duration: 0.45 }}
          className="h-full overflow-x-auto overflow-y-hidden md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory md:snap-none"
          aria-hidden={current ? true : undefined}
        >
          <div className="relative mx-auto w-max min-w-full px-10 md:px-16 pt-14 flex justify-center">
            {/* rail */}
            <div className="absolute left-4 right-4 md:left-[6%] md:right-[6%] top-[58px] h-[3px] rounded-full bg-gradient-to-b from-neutral-400 via-neutral-300 to-neutral-500 shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
              <span className="absolute -left-1 -top-[3px] w-2.5 h-2.5 rounded-full bg-neutral-500" />
              <span className="absolute -right-1 -top-[3px] w-2.5 h-2.5 rounded-full bg-neutral-500" />
            </div>

            <div className="relative flex items-start">
              {items.map((p, i) => {
                const h = HEIGHT_BY_CATEGORY[p.category] ?? 240;
                const isSelected = selected === i;
                const facing = hovered === i;
                return (
                  <motion.div
                    key={p.id}
                    className="relative snap-center"
                    style={{ zIndex: facing ? 50 : 10 + i }}
                  >
                    {/* idle sway */}
                    <motion.div
                      style={{ transformOrigin: '50% 0%' }}
                      animate={{ rotate: [-0.8, 0.8, -0.8] }}
                      transition={{ duration: 4 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => open(i)}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        style={{ transformOrigin: '50% 0%' }}
                        animate={{ y: facing ? -8 : 0 }}
                        whileTap={{ scale: 0.98 }}
                        transition={SPRING}
                        className="block cursor-pointer focus:outline-none"
                        aria-label={p.name}
                      >
                        <Hook />
                        {/* width animates between a thin side slice and the full garment */}
                        <motion.div
                          initial={false}
                          animate={{ width: facing ? 'auto' : sideWidth }}
                          transition={SPRING}
                          className="-mt-1.5 flex justify-center [perspective:1400px] [--s:0.72] md:[--s:1]"
                          style={{ height: `calc(${h}px * var(--s))` }}
                        >
                          {isSelected ? (
                            // invisible twin keeps the slot on the rack while the piece is in focus
                            <img src={p.rack.front} alt="" aria-hidden className="h-full w-auto max-w-none shrink-0 invisible" />
                          ) : (
                            <motion.img
                              layoutId={`rack-img-${p.id}`}
                              src={p.rack.front}
                              alt={p.name}
                              loading="lazy"
                              draggable={false}
                              initial={false}
                              animate={{
                                rotateY: facing ? 0 : 72,
                                filter: facing
                                  ? 'brightness(1) drop-shadow(0px 16px 14px rgba(0,0,0,0.3))'
                                  : 'brightness(0.82) drop-shadow(0px 8px 8px rgba(0,0,0,0.22))',
                              }}
                              transition={SPRING}
                              className="h-full w-auto max-w-none shrink-0 select-none"
                            />
                          )}
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="md:hidden absolute bottom-4 inset-x-0 text-center text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
            {t('home.rack.hint')}
          </p>
        </motion.div>

        {/* ---------- Focus view ---------- */}
        <AnimatePresence>
          {current && (
            <motion.div
              key="focus"
              className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => {
                if (e.target === e.currentTarget) close();
              }}
            >
              <button
                type="button"
                onClick={close}
                aria-label={t('home.rack.close')}
                className="absolute top-2 right-4 md:right-10 p-2 text-neutral-600 hover:text-black transition-colors"
              >
                <X size={22} />
              </button>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t('home.rack.prev')}
                    className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-neutral-400/70 flex items-center justify-center text-neutral-700 hover:bg-black hover:text-white hover:border-black transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t('home.rack.next')}
                    className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-neutral-400/70 flex items-center justify-center text-neutral-700 hover:bg-black hover:text-white hover:border-black transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <motion.div
                className="h-[260px] md:h-[340px] flex items-end justify-center cursor-grab active:cursor-grabbing [perspective:1600px]"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onSwipe}
              >
                {/* flip card: front face carries the shared layout animation, back face sits behind it */}
                <motion.div
                  key={current.id}
                  className="relative h-full [transform-style:preserve-3d]"
                  initial={false}
                  animate={{ rotateY: side === 'back' ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: [0.45, 0, 0.2, 1] }}
                >
                  <motion.img
                    layoutId={`rack-img-${current.id}`}
                    src={current.rack.front}
                    alt={current.name}
                    draggable={false}
                    transition={SPRING}
                    className="h-full w-auto max-w-[80vw] object-contain select-none [backface-visibility:hidden] drop-shadow-[0_24px_24px_rgba(0,0,0,0.3)]"
                  />
                  {current.rack.back && (
                    <div className="absolute inset-0 flex justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <img
                        src={current.rack.back}
                        alt=""
                        aria-hidden
                        draggable={false}
                        className="h-full w-auto max-w-[80vw] object-contain select-none drop-shadow-[0_24px_24px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                key={`info-${current.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="mt-6 flex flex-col items-center text-center"
              >
                <h3 className="text-sm md:text-base font-bold tracking-[0.18em] uppercase">{current.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 tracking-widest">${current.price}</p>

                {current.rack.back && (
                  <div className="mt-4 flex rounded-full border border-neutral-400/70 p-0.5 text-[10px] tracking-[0.2em]">
                    {(['front', 'back'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSide(s)}
                        className={`px-4 py-1.5 rounded-full transition-colors ${
                          side === s ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        {t(`home.rack.${s}`)}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {current.sizes.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`min-w-[40px] h-9 px-2 rounded-full border text-[11px] tracking-wider transition-colors ${
                        size === s
                          ? 'bg-black text-white border-black'
                          : 'border-neutral-400/70 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!size}
                  onClick={() => size && addToCart(current, size)}
                  className="mt-5 w-64 py-3 rounded-full text-[11px] font-bold tracking-[0.2em] transition-colors bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
                >
                  {size ? t('productDetail.addToCart') : t('productDetail.selectASize')}
                </button>

                <Link
                  to={`/product/${current.id}`}
                  className="mt-3 text-[10px] tracking-[0.25em] text-neutral-500 hover:text-black border-b border-neutral-400 hover:border-black pb-0.5 transition-colors"
                >
                  {t('home.rack.details')}
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RackShowcase;
