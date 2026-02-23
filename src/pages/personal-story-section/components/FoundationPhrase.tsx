import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const FoundationPhrase: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  const [mouse, setMouse] = React.useState({ x: 0, y: 0, isOver: false });

  return (
    <section ref={ref} className="py-12 flex flex-col items-center my-8">
      <p className="text-4xl sm:text-6xl font-black text-center text-[#ffffff] leading-tight">
        That belief is the <br />
        <span className="relative inline-block mt-4">
          {mouse.isOver && (
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, #fcb22f66 0%, transparent 100%)`,
              }}
            />
          )}
          <motion.span
            style={{
              y: smoothY,
              scale,
              opacity,
              rotate: '-15deg',
              backgroundColor: '#fcb22f',
            }}
            className="px-8 py-2 rounded-2xl text-white shadow-xl relative z-10"
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, isOver: true });
            }}
            onMouseLeave={() => setMouse((m) => ({ ...m, isOver: false }))}
          >
            FOUNDATION
          </motion.span>
        </span>
        <br />
        <span className="opacity-90">of everything we do.</span>
      </p>
    </section>
  );
};

export default FoundationPhrase;
