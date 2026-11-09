import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, CameraOff, Download, Loader2 } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Live camera try-on. MediaPipe Pose (loaded from CDN on first use) finds shoulders,
 * hips and ankles; the garment cut-out is drawn over the mirrored video frame.
 * Everything runs in the browser — no video leaves the device.
 */

const MP_VERSION = '0.10.14';
const MP_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`;
const MP_MODEL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

type TryOnProduct = Product & { tryon: string };
type Pt = { x: number; y: number; v: number };

/** How each cut-out sits on the body. Measured from the images' alpha masks. */
const TOP_FIT: Record<string, { widthPerShoulder: number; shoulderAt: number }> = {
  Tops: { widthPerShoulder: 2.1, shoulderAt: 0.12 },
  Hoodies: { widthPerShoulder: 2.15, shoulderAt: 0.32 },
};
const BOTTOM_FIT = { widthPerHip: 2.3, waistAbove: 0.08, legStretch: 1.12 };

// MediaPipe pose landmark indices
const L_SHOULDER = 11, R_SHOULDER = 12, L_HIP = 23, R_HIP = 24, L_ANKLE = 27, R_ANKLE = 28;

let landmarkerPromise: Promise<any> | null = null;
const loadLandmarker = () => {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision: any = await import(/* @vite-ignore */ `${MP_BASE}/vision_bundle.mjs`);
      const fileset = await vision.FilesetResolver.forVisionTasks(`${MP_BASE}/wasm`);
      const make = (delegate: 'GPU' | 'CPU') =>
        vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MP_MODEL, delegate },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
      try {
        return await make('GPU');
      } catch {
        return await make('CPU');
      }
    })().catch(err => {
      landmarkerPromise = null; // allow a retry
      throw err;
    });
  }
  return landmarkerPromise;
};

const imageCache = new Map<string, HTMLImageElement>();
const getImage = (src: string) => {
  let img = imageCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    imageCache.set(src, img);
  }
  return img;
};

const TryOnCamera: React.FC = () => {
  const { t } = useLanguage();

  const { tops, bottoms } = useMemo(() => {
    const all = PRODUCTS.filter((p): p is TryOnProduct => Boolean(p.tryon));
    return {
      tops: all.filter(p => p.category !== 'Bottoms'),
      bottoms: all.filter(p => p.category === 'Bottoms'),
    };
  }, []);

  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'error'>('idle');
  const [error, setError] = useState('');
  const [personSeen, setPersonSeen] = useState(true);
  const [topId, setTopId] = useState<string | null>(tops[0]?.id ?? null);
  const [bottomId, setBottomId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef(0);
  const smoothRef = useRef<Record<number, Pt>>({});
  const seenRef = useRef(true);
  const selectionRef = useRef({ top: null as TryOnProduct | null, bottom: null as TryOnProduct | null });

  useEffect(() => {
    selectionRef.current = {
      top: tops.find(p => p.id === topId) ?? null,
      bottom: bottoms.find(p => p.id === bottomId) ?? null,
    };
  }, [topId, bottomId, tops, bottoms]);

  // warm the image cache so switching is instant
  useEffect(() => {
    [...tops, ...bottoms].forEach(p => getImage(p.tryon));
  }, [tops, bottoms]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(tr => tr.stop());
    streamRef.current = null;
    smoothRef.current = {};
    setStatus(s => (s === 'error' ? s : 'idle'));
  }, []);

  useEffect(() => stop, [stop]);

  const drawFrame = useCallback((landmarker: any) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.readyState >= 2 && video.videoWidth) {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // mirrored selfie view
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      let ts = performance.now();
      if (ts <= lastTsRef.current) ts = lastTsRef.current + 1;
      lastTsRef.current = ts;
      const result = landmarker.detectForVideo(video, ts);
      const lms = result?.landmarks?.[0];

      const seen = Boolean(lms);
      if (seen !== seenRef.current) {
        seenRef.current = seen;
        setPersonSeen(seen);
      }

      if (lms) {
        // mirrored pixel coords + light smoothing against jitter
        const pt = (i: number): Pt => {
          const raw = { x: (1 - lms[i].x) * w, y: lms[i].y * h, v: lms[i].visibility ?? 1 };
          const prev = smoothRef.current[i];
          const s = prev
            ? { x: prev.x + (raw.x - prev.x) * 0.5, y: prev.y + (raw.y - prev.y) * 0.5, v: raw.v }
            : raw;
          smoothRef.current[i] = s;
          return s;
        };
        const ls = pt(L_SHOULDER), rs = pt(R_SHOULDER);
        const lh = pt(L_HIP), rh = pt(R_HIP);
        const la = pt(L_ANKLE), ra = pt(R_ANKLE);
        const { top, bottom } = selectionRef.current;

        const drawAt = (img: HTMLImageElement, a: Pt, b: Pt, width: number, height: number, offsetY: number) => {
          const [l, r] = a.x <= b.x ? [a, b] : [b, a];
          const angle = Math.atan2(r.y - l.y, r.x - l.x);
          ctx.save();
          ctx.translate((a.x + b.x) / 2, (a.y + b.y) / 2);
          ctx.rotate(angle);
          ctx.drawImage(img, -width / 2, -offsetY, width, height);
          ctx.restore();
        };

        if (bottom && lh.v > 0.5 && rh.v > 0.5) {
          const img = getImage(bottom.tryon);
          if (img.complete && img.naturalWidth) {
            const hipDist = Math.hypot(rh.x - lh.x, rh.y - lh.y);
            const width = hipDist * BOTTOM_FIT.widthPerHip;
            const hipY = (lh.y + rh.y) / 2;
            const anklesSeen = la.v > 0.5 && ra.v > 0.5;
            const height = anklesSeen
              ? ((la.y + ra.y) / 2 - hipY) * BOTTOM_FIT.legStretch
              : width * (img.naturalHeight / img.naturalWidth);
            drawAt(img, lh, rh, width, height, height * BOTTOM_FIT.waistAbove);
          }
        }

        if (top && ls.v > 0.5 && rs.v > 0.5) {
          const img = getImage(top.tryon);
          const fit = TOP_FIT[top.category] ?? TOP_FIT.Tops;
          if (img.complete && img.naturalWidth) {
            const shoulderDist = Math.hypot(rs.x - ls.x, rs.y - ls.y);
            const width = shoulderDist * fit.widthPerShoulder;
            const height = width * (img.naturalHeight / img.naturalWidth);
            drawAt(img, ls, rs, width, height, height * fit.shoulderAt);
          }
        }
      }
    }
    rafRef.current = requestAnimationFrame(() => drawFrame(landmarker));
  }, []);

  const start = async () => {
    setError('');
    setStatus('loading');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('camera');
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        throw new Error('camera');
      }
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      let landmarker;
      try {
        landmarker = await loadLandmarker();
      } catch {
        throw new Error('model');
      }
      setStatus('running');
      drawFrame(landmarker);
    } catch (e: any) {
      streamRef.current?.getTracks().forEach(tr => tr.stop());
      streamRef.current = null;
      setError(e?.message === 'model' ? t('home.tryon.errorModel') : t('home.tryon.errorCamera'));
      setStatus('error');
    }
  };

  const snapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.download = 'putta-try-on.jpg';
    a.click();
  };

  if (tops.length === 0 && bottoms.length === 0) return null;

  const Thumb: React.FC<{ p: TryOnProduct | null; active: boolean; onClick: () => void }> = ({ p, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      title={p?.name ?? t('home.tryon.none')}
      className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#ecebe7] flex items-center justify-center p-1.5 border-2 transition-colors ${
        active ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
      }`}
    >
      {p ? (
        <img src={p.tryon} alt={p.name} loading="lazy" className="max-w-full max-h-full object-contain" />
      ) : (
        <span className="text-[10px] tracking-widest text-neutral-500 uppercase">{t('home.tryon.none')}</span>
      )}
    </button>
  );

  return (
    <section className="py-20 md:py-24 px-6 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t('home.tryon.title')}</h2>
          <p className="text-neutral-400 text-xs md:text-sm tracking-[0.2em] mt-3 uppercase">{t('home.tryon.subtitle')}</p>
        </div>

        <div className="relative w-full aspect-[3/4] md:aspect-video bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center">
          {/* kept in the DOM (not display:none) so mobile Safari keeps decoding frames */}
          <video ref={videoRef} playsInline muted className="absolute w-px h-px opacity-0 pointer-events-none" />
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-contain ${status === 'running' ? '' : 'hidden'}`}
          />

          {status !== 'running' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin text-white mb-4" size={28} />
                  <p className="text-neutral-400 text-xs tracking-widest uppercase">{t('home.tryon.loading')}</p>
                </>
              ) : (
                <>
                  {status === 'error' && <p className="text-red-400 text-sm mb-5 max-w-sm">{error}</p>}
                  <button
                    type="button"
                    onClick={start}
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors"
                  >
                    <Camera size={16} /> {t('home.tryon.start')}
                  </button>
                  <p className="text-neutral-500 text-[11px] mt-5 max-w-sm leading-relaxed">{t('home.tryon.hint')}</p>
                  <p className="text-neutral-600 text-[10px] mt-2 max-w-sm">{t('home.tryon.privacy')}</p>
                </>
              )}
            </div>
          )}

          {status === 'running' && (
            <>
              {!personSeen && (
                <div className="absolute top-4 inset-x-0 flex justify-center">
                  <span className="bg-black/70 text-white text-[11px] tracking-wider px-4 py-2 rounded-full">
                    {t('home.tryon.noPerson')}
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={snapshot}
                  aria-label={t('home.tryon.snapshot')}
                  className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200"
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  onClick={stop}
                  aria-label={t('home.tryon.stop')}
                  className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                >
                  <CameraOff size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {tops.length > 0 && (
            <div>
              <p className="text-neutral-500 text-[10px] tracking-[0.25em] uppercase mb-2">{t('home.tryon.tops')}</p>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                <Thumb p={null} active={topId === null} onClick={() => setTopId(null)} />
                {tops.map(p => (
                  <Thumb key={p.id} p={p} active={topId === p.id} onClick={() => setTopId(p.id)} />
                ))}
              </div>
            </div>
          )}
          {bottoms.length > 0 && (
            <div>
              <p className="text-neutral-500 text-[10px] tracking-[0.25em] uppercase mb-2">{t('home.tryon.bottoms')}</p>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                <Thumb p={null} active={bottomId === null} onClick={() => setBottomId(null)} />
                {bottoms.map(p => (
                  <Thumb key={p.id} p={p} active={bottomId === p.id} onClick={() => setBottomId(p.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TryOnCamera;
