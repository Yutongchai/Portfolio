import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { TextGenerateEffect } from '../../../components/ui/TextGenerateEffect';

const EnergeticHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const floatingOrbs = [
    {
      size: 'w-96 h-96',
      gradient: 'from-primary/30 via-secondary/30 to-primary/40',
      position: 'top-20 -left-48',
      delay: 0,
    },
    {
      size: 'w-[500px] h-[500px]',
      gradient: 'from-secondary/30 via-tertiary/30 to-secondary/40',
      position: 'top-1/3 -right-64',
      delay: 0.2,
    },
    {
      size: 'w-80 h-80',
      gradient: 'from-tertiary/30 via-primary/30 to-tertiary/40',
      position: 'bottom-32 left-1/4',
      delay: 0.4,
    },
    {
      size: 'w-72 h-72',
      gradient: 'from-accent/20 via-primary/20 to-accent/30',
      position: 'bottom-20 right-1/4',
      delay: 0.6,
    },
  ];

  return (
    <div ref={ref} className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingOrbs.map((orb, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: orb.delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`absolute ${orb.size} ${orb.position} rounded-full bg-gradient-to-br ${orb.gradient} blur-3xl animate-float`}
            style={{
              animationDelay: `${orb.delay}s`,
              animationDuration: `${4 + index}s`
            }}
          />
        ))}

        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-6 text-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 mb-6 sm:mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-electric rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-butter" />
              <div className="relative glass px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2">
            {/*     <Icon name="Sparkles" size={18} className="text-primary animate-pulse-glow" />
               */}
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 sm:mb-6 leading-tight"
          >
            <TextGenerateEffect 
              words="Build Culture. Create Impact. Celebrate Growth."
              className="animate-bounce-in text-primary"
            />
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const projectsSection = document.getElementById('projects-section');
                projectsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-butter"
            >
              <div className="absolute inset-0 bg-gradient-electric animate-gradient" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-butter" />
              <span className="relative z-10 text-white">Explore Projects</span>
              <motion.div
                className="relative z-10"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Icon name="ArrowDown" size={20} className="text-white" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
      </motion.div>
    </div>
  );
};

export default EnergeticHero;
