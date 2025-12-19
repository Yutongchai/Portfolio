import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ParallaxBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '70%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div ref={ref} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs with warm colors */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-30"
        style={{ 
          y: y1,
          background: 'radial-gradient(circle, rgba(227, 83, 54, 0.3), transparent)',
        }}
      />
      <motion.div
        className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
        style={{ 
          y: y2,
          background: 'radial-gradient(circle, rgba(153, 136, 161, 0.3), transparent)',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full opacity-20"
        style={{ 
          y: y3,
          background: 'radial-gradient(circle, rgba(138, 43, 14, 0.2), transparent)',
        }}
      />
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32 border-4 border-primary/20 rounded-2xl"
        style={{ 
          rotate,
          y: y2,
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-secondary/10 rounded-full"
        style={{ 
          y: y3,
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.3]),
        }}
      />
      {/* Subtle color block accents */}
      <div className="absolute top-0 left-0 w-1/3 h-64 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-96 bg-gradient-to-tl from-secondary/5 to-transparent" />
    </div>
  );
};

export default ParallaxBackground;