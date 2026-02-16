import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import BGvideo from '/EITO.mp4';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';

const CorePrinciple: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'center center']
  });

  // Animation values for the whole content block
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, -20, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const smoothY = useSpring(contentY, { stiffness: 100, damping: 20 });

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

  // Video playback logic stays the same
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tryReverse = async () => {
      try {
        if (vid.readyState < 1) {
          await new Promise<void>((res) => vid.addEventListener('loadedmetadata', () => res(), { once: true }));
        }
        vid.currentTime = vid.duration || 0;
        vid.muted = true;
        vid.playbackRate = -1;
        await vid.play();
      } catch (err) {
        vid.playbackRate = 1;
        vid.src = BGvideo;
        await vid.play().catch(() => { });
      }
    };
    void tryReverse();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#153462]">
      {/* Background Video - Slightly higher opacity for Brutalist contrast */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.5, willChange: 'transform, opacity' }}
        src={BGvideo}
        muted
        loop
        playsInline
        preload="auto"
      />

      <motion.div
        className="py-24 px-6 relative z-10"
        style={{ y: smoothY, scale: contentScale, opacity: contentOpacity }}
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* BRUTALIST HEADING ROW */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              {/* The Hard Shadow for the text */}
              <div className="absolute inset-0 bg-[#f68921] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />

              <div className="relative bg-white border-4 border-[#153462] px-10 py-4">
                <h3 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-[#153462]">
                  CORE <span className="text-[#f68921]">PRINCIPLES</span>
                </h3>
              </div>
            </div>
          </div>

          {/* SWINGING TEXT CONTAINER - Now styled as a "Sticker" */}
          <div className="w-full flex justify-center mt-6">
            <div
              className="relative group cursor-pointer max-w-2xl w-full"
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
              {/* Box framing the swinging SVG */}
              <div className="absolute inset-0 bg-[#fcb22f] translate-x-2 translate-y-2" />
              <div className="relative bg-white border-4 border-[#153462] p-4 flex justify-center overflow-hidden">
                <svg viewBox="0 0 800 160" width="100%" height="120px" style={{ maxWidth: '600px' }}>
                  <path id="curved-path" fill="transparent" stroke="transparent" d="M 30,100 Q 400,100 770,100" />
                  <text className="fill-[#153462] font-black uppercase italic text-4xl md:text-5xl">
                    <textPath href="#curved-path" startOffset="50%" textAnchor="middle">
                      <tspan dy="-10">The EITO Fundamentals</tspan>
                    </textPath>
                  </text>
                </svg>

                {/* Decorative Brutalist "Tape" in corners */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#153462] translate-x-4 -translate-y-4 rotate-45" />
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#f68921] -translate-x-4 translate-y-4 rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Overlay for extra Brutalist texture over the video */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(#153462 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <ImageHoverScrollSection />
    </div>
  );
};

export default CorePrinciple;