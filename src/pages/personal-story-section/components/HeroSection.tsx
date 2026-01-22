import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PersonalInfo } from '../types';
import { useContent } from '../../../contexts/ContentContext';
import InlineTextEditor from '../../../components/admin/InlineTextEditor';
import RotatingText from './RotatingText';

interface HeroSectionProps {
  personalInfo?: PersonalInfo;
}

const HeroSection = ({ personalInfo: propPersonalInfo }: HeroSectionProps) => {
  const { content, updatePersonal } = useContent();
  const personalInfo = propPersonalInfo || content.personal;
  
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.6]);

  // Background image slideshow
  const backgroundImages = [
    '/Portfolio/_JIN3046.jpg',
    '/Portfolio/different.jpg',
    '/Portfolio/collage.jpg',
    '/Portfolio/mainPic.jpg',
    '/Portfolio/training.jpg',
    '/Portfolio/discuss.jpg',
    '/Portfolio/teamwork.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <motion.div 
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32"
        style={{ opacity, y }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Text Content Centered */}
          <motion.div 
            className="space-y-6 sm:space-y-8 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Large Bold Name - Primary Accent Color */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
                style={{ color: '#fcb22f' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <InlineTextEditor
                  value={personalInfo.name}
                  onChange={(value) => updatePersonal({ name: value })}
                  label="Name"
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
                  style={{ color: '#e1620b' }}
                />
              </motion.h1>
              
              {/* Expressive Handwritten Subtitle */}
              <motion.div 
                className="text-3xl sm:text-4xl md:text-5xl handwritten text-foreground/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="font-bold" style={{ color: '#ffffff' }}>We Build Unforgettable Team Experiences — For </span>
                <RotatingText
                  texts={['People.', 'Culture.', 'Growth.']}
                  mainClassName="inline-flex font-extrabold"
                  style={{ color: '#fcb22f' }}
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </motion.div>
              
              {/* Clean Body Text */}
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-foreground/70 font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <InlineTextEditor
                  value={personalInfo.tagline}
                  onChange={(value) => updatePersonal({ tagline: value })}
                  label="Tagline"
                  className="text-lg sm:text-xl md:text-2xl text-foreground/70 font-light leading-relaxed"
                />
              </motion.p>
            </div>
            
            {/* Accent Line Divider */}
            <motion.div 
              className="h-1 bg-primary rounded-full mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            
            {/* Bio Text */}
            <motion.p 
              className="text-lg sm:text-xl leading-relaxed text-white font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <InlineTextEditor
                value={personalInfo.bio}
                onChange={(value) => updatePersonal({ bio: value })}
                multiline
                label="Bio"
                className="text-lg sm:text-xl leading-relaxed text-white font-bold"
              />
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;