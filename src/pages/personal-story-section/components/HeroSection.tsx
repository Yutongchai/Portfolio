import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PersonalInfo } from '../types';
import Image from '../../../components/AppImage';

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

const HeroSection = ({ personalInfo }: HeroSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.6]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-slate-50 to-blue-50">
      {/* Energetic gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>
      
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-32"
        style={{ opacity, y }}
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content with Slide-in Animation */}
          <motion.div 
            className="space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="space-y-6">
              {/* Large Bold Name - Primary Accent Color */}
              <motion.h1 
                className="text-6xl lg:text-8xl font-bold text-primary leading-none"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {personalInfo.name}
              </motion.h1>
              
              {/* Expressive Handwritten Subtitle */}
              <motion.p 
                className="text-3xl lg:text-4xl handwritten text-foreground/90"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {personalInfo.title}
              </motion.p>
              
              {/* Clean Body Text */}
              <motion.p 
                className="text-xl text-foreground/70 font-light"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {personalInfo.tagline}
              </motion.p>
            </div>
            
            {/* Accent Line Divider */}
            <motion.div 
              className="h-1 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            
            {/* Bio Text */}
            <motion.p 
              className="text-lg text-foreground/80 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {personalInfo.bio}
            </motion.p>
            
            {/* CTA Button with Energetic Gradient */}
            <motion.button
              className="relative px-8 py-4 font-semibold rounded-2xl overflow-hidden group transition-butter shadow-lg hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-electric" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-butter" />
              <span className="relative z-10 text-white">Let's Work Together</span>
            </motion.button>
          </motion.div>
          
          {/* Image with Scale-in Animation */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative group">
              {/* Energetic gradient glow effect */}
              <div className="absolute -inset-8 bg-gradient-electric rounded-3xl opacity-20 blur-2xl transform rotate-3 group-hover:rotate-6 group-hover:opacity-30 transition-butter" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
                <Image
                  src={personalInfo.image}
                  alt={personalInfo.alt}
                  className="w-full h-[500px] lg:h-[650px] object-cover transform group-hover:scale-105 transition-butter"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;