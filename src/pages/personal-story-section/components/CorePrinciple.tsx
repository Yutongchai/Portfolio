import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';

const CorePrinciple: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'center center']
  });

  // Content Motion
  const curvedTextY = useTransform(scrollYProgress, [0, 0.5, 1], [100, -20, 0]);
  const curvedTextScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
  const curvedTextOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const smoothY = useSpring(curvedTextY, { stiffness: 100, damping: 20 });

  // Background Parallax
  const bgY1 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

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

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#fcfaf8] pt-24 pb-12">
      {/* --- PREMIUM ATMOSPHERIC BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

        {/* Navy/Teal Mesh */}
        <motion.div
          style={{
            y: bgY1,
            background: 'radial-gradient(circle, #153462 0%, #12a28f 100%)',
            width: '800px', height: '800px', top: '-200px', right: '-100px',
            filter: 'blur(140px)', opacity: 0.15
          }}
          className="absolute rounded-full"
        />

        {/* Gold/Orange Mesh */}
        <motion.div
          style={{
            y: bgY2,
            background: 'radial-gradient(circle, #fcb22f 0%, #f68921 100%)',
            width: '600px', height: '600px', bottom: '-100px', left: '-100px',
            filter: 'blur(120px)', opacity: 0.1
          }}
          className="absolute rounded-full"
        />

        {/* Noise Texture for Depth */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, mixBlendMode: 'overlay' }}></div>

        {/* Subtle Structural Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#153462 1px, transparent 1px), linear-gradient(90deg, #153462 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div
        className="mb-6 px-6 py-12 overflow-visible relative z-10"
        style={{ y: smoothY, scale: curvedTextScale, opacity: curvedTextOpacity }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="w-full flex items-center justify-center gap-6 pt-14">
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#153462] whitespace-nowrap">CORE</h3>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#f68921] whitespace-nowrap">PRINCIPLES</h3>
          </div>

          {/* Curved Text Section */}
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
                <path id="curved-path" fill="none" d="M 30,100 Q 400,100 770,100" />
                <text className="font-bold uppercase tracking-[0.2em] fill-[#103C61]/60 text-[40px]">
                  <textPath href="#curved-path" startOffset="50%" textAnchor="middle">
                      <tspan dy="-28">The E I T O Fundamentals</tspan>
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Principles Grid Section */}
      <div className="relative z-20">
        <ImageHoverScrollSection />
      </div>
    </div>
  );
};

export default CorePrinciple;