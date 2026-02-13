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

  // play the background video backwards in a loop (and keep it muted)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let rafId = 0;
    let running = true;
    const speed = 1; // 1x reverse speed (seconds per second)

    const startReverse = () => {
      vid.pause();
      if (vid.duration) {
        try {
          vid.currentTime = vid.duration;
        } catch (e) {
          // ignore seek errors
        }
      }

      let last = performance.now();
      const step = (now: number) => {
        if (!running) return;
        const dt = (now - last) / 1000;
        last = now;
        try {
          const cur = vid.currentTime || 0;
          let next = cur - dt * speed;
          if (next <= 0) {
            // loop: jump back to end
            next = vid.duration || 0;
          }
          vid.currentTime = next;
        } catch (e) {
          // setting currentTime can throw if not seekable yet — ignore
        }
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
    };

    if (vid.readyState >= 1) startReverse();
    else vid.addEventListener('loadedmetadata', startReverse, { once: true });

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      vid.removeEventListener('loadedmetadata', startReverse as any);
    };
  }, []);

  return (
    <div ref={rootRef} className="mt-0 relative overflow-hidden">
      {/* Background video (public/EOTO.mp4) */}
      <video
        ref={videoRef}
        className="core-video-bg absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.45 }}
        src="/EITO.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <motion.div
        className="mb-6 px-6 py-6 overflow-visible relative z-10"
        style={{ y: smoothY, scale: curvedTextScale, opacity: curvedTextOpacity }}
      >
        <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto gap-4">
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#153462] whitespace-nowrap">CORE</h3>

          <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f68921] whitespace-nowrap">PRINCIPLES</h3>

          <div
            className="curved-text-container flex-1 flex justify-center"
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
      </motion.div>

      <ImageHoverScrollSection />
    </div>
  );
};

export default CorePrinciple;
