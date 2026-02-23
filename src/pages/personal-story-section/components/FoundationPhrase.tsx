import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

const FoundationPhrase: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const yScroll = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const smoothY = useSpring(yScroll, { stiffness: 100, damping: 20 });

  const [mouse, setMouse] = React.useState({ x: 0, y: 0, isOver: false });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 25 }
    }
  };

  return (
    <motion.section 
      ref={ref} 
      className="py-12 flex flex-col items-center my-4" 
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="text-4xl sm:text-6xl font-black text-center text-[#ffffff] leading-[1.1]">
        {/* Top line */}
        <motion.p variants={itemVariants}>That belief is the</motion.p>
        
        {/* The Badge - mt-6 and mb-6 for smaller, tighter distance */}
        <div className="relative inline-block mt-6 mb-6"> 
          {mouse.isOver && (
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: `radial-gradient(350px circle at ${mouse.x}px ${mouse.y}px, #fcb22f55 0%, transparent 100%)`,
              }}
            />
          )}
          <motion.span
            variants={itemVariants}
            style={{
              y: smoothY,
              backgroundColor: '#fcb22f',
              rotate: '-3deg'
            }}
            whileHover={{ scale: 1.05, rotate: '0deg' }}
            whileTap={{ scale: 0.98 }}
            // Continuous Pulse Animation
            animate={{ 
              boxShadow: [
                "0px 5px 15px rgba(252, 178, 47, 0.4)", 
                "0px 5px 35px rgba(252, 178, 47, 0.8)", 
                "0px 5px 15px rgba(252, 178, 47, 0.4)"
              ] 
            }}
            transition={{ 
              boxShadow: { 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }
            }}
            className="px-10 py-3 rounded-2xl text-white shadow-2xl relative z-10 cursor-default inline-block border border-white/20"
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, isOver: true });
            }}
            onMouseLeave={() => setMouse((m) => ({ ...m, isOver: false }))}
          >
            FOUNDATION
          </motion.span>
        </div>

        {/* Bottom line */}
        <motion.p variants={itemVariants} className="opacity-90">
          of everything we do.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default FoundationPhrase;