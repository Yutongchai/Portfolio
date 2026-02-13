import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';

const CorePrinciple: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'center center']
  });

  const curvedTextY = useTransform(scrollYProgress, [0, 0.5, 1], [100, -20, 0]);
  const curvedTextScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
  const curvedTextOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const smoothY = useSpring(curvedTextY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest > 0.3 && latest < 0.7) {
        const curveAmount = 20 + Math.sin(latest * Math.PI * 4) * 30;
        gsap.to('#curved-path', {
          attr: { d: `M 30,100 Q 400,${100 - curveAmount} 770,100` },
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Try native reverse playback (fast path). If unsupported, fall back to a
  // reversed video file or finally regular forward playback. This avoids the
  // RAF-driven manual seeks which cause high CPU and jank.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let cancelled = false;

    const tryReverse = async () => {
      try {
        // wait for metadata so we can seek to the end
        if (vid.readyState < 1) {
          await new Promise<void>((res) => vid.addEventListener('loadedmetadata', () => res(), { once: true }));
        }
        // position at end and attempt negative playbackRate
        try {
          vid.currentTime = vid.duration || 0;
        } catch (e) {
          // ignore
        }
        vid.muted = true;
        vid.playbackRate = -1;
        await vid.play();
        return;
      } catch (err) {
        // Negative playbackRate not supported in many browsers. Try a reversed
        // file if you have one at /EITO-reversed.mp4 (best long-term fix).
        try {
          vid.playbackRate = 1;
          vid.src = '/EITO.mp4';
          await vid.play();
          return;
        } catch (err2) {
          // Final fallback: play forward normally (smooth, avoids jank).
          try {
            vid.playbackRate = 1;
            await vid.play();
          } catch (e) {
            // ignore play errors
          }
        }
      }
    };

    void tryReverse();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={rootRef} className="mt-0 relative overflow-hidden">
      {/* Background video (public/EOTO.mp4) */}
      <video
        ref={videoRef}
        className="core-video-bg absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.45, willChange: 'transform, opacity' }}
        src="/EITO.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <motion.div
        className="mb-6 px-6 py-12 overflow-visible relative z-10"
        style={{ y: smoothY, scale: curvedTextScale, opacity: curvedTextOpacity }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* First row: big heading */}
          <div className="w-full flex items-center justify-center gap-6 pt-8">
            <h3 className="text-4xl md:text-6xl lg:text-5xl font-black uppercase tracking-tight text-[#153462] whitespace-nowrap">CORE</h3>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f68921] whitespace-nowrap">PRINCIPLES</h3>
          </div>

          {/* Second row: curved swinging text centered below the heading */}
          <div className="w-full flex justify-center mt-6">
            <div
              className="curved-text-container flex-1 flex justify-center max-w-3xl"
              onMouseEnter={() => {
                gsap.killTweensOf('#curved-path');
                gsap.to('#curved-path', {
                  attr: { d: 'M 30,100 Q 400,40 770,100' },
                  ease: 'elastic.out(1.4, 0.4)',
                  duration: 0.8
                });
              }}
              onMouseLeave={() => {
                gsap.killTweensOf('#curved-path');
                gsap.to('#curved-path', {
                  attr: { d: 'M 30,100 Q 400,100 770,100' },
                  ease: 'elastic.out(1.8, 0.2)',
                  duration: 1.5
                });
              }}
            >
              <svg viewBox="0 0 800 160" width="100%" height="160px" style={{ maxWidth: '800px' }}>
                <path id="curved-path" className="curved-path" d="M 30,100 Q 400,100 770,100" />
                <text className="curved-text">
                  <textPath href="#curved-path" startOffset="50%" textAnchor="middle">
                    <tspan dy="-18">The E I T O Fundamentals</tspan>
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <ImageHoverScrollSection />
    </div>
  );
};

export default CorePrinciple;
