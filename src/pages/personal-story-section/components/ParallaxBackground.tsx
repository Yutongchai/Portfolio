import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient background - continuous */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />

      {/* Large animated EITO color orbs - continuous scroll */}
      <motion.div
        className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
        style={{ 
          y: y1,
          background: 'radial-gradient(circle, #12a28f 0%, transparent 70%)',
        }}
      />
      
      <motion.div
        className="absolute top-1/4 -right-60 w-[700px] h-[700px] rounded-full blur-3xl opacity-15"
        style={{ 
          y: y2,
          background: 'radial-gradient(circle, #0074b4 0%, transparent 70%)',
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ 
          y: y3,
          background: 'radial-gradient(circle, #fcb22f 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -right-40 w-[650px] h-[650px] rounded-full blur-3xl opacity-15"
        style={{ 
          y: y1,
          background: 'radial-gradient(circle, #ee424c 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-[750px] h-[750px] rounded-full blur-3xl opacity-10"
        style={{ 
          y: y2,
          background: 'radial-gradient(circle, #12a28f 0%, transparent 70%)',
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-40 h-40 border-2 border-[#12a28f]/20 rounded-3xl"
        style={{ 
          rotate: rotate1,
          y: y2,
        }}
      />
      
      <motion.div
        className="absolute top-2/3 left-1/4 w-32 h-32 border-2 border-[#ee424c]/20 rounded-2xl"
        style={{ 
          rotate: rotate2,
          y: y3,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-[#0074b4]/10 rounded-full"
        style={{ 
          y: y1,
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.5]),
        }}
      />

      {/* Grid overlay for tech feel - subtle */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(18,162,143,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(18,162,143,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Gradient overlays for smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
};

export default ParallaxBackground; 