import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PersonalInfo } from '../types';
import SimpleRotatingText from './SimpleRotatingText';
import { supabase } from '../../../config/supabaseClient';
import { toSupabaseThumbnail } from '../../../utils/supabaseImageTransform';

interface HeroSectionProps {
  personalInfo?: PersonalInfo;
  preview?: boolean;
}

const defaultPersonalInfo: PersonalInfo = {
  name: "EITO Group",
  title: "Product / Experience Designer",
  tagline: "Building experiences that bring teams together",
  bio: "With a passion for creating meaningful connections, I specialize in designing team-building experiences that foster collaboration, growth, and lasting impact.",
  image: '/Portfolio/EITO.webp',
  alt: 'Portrait of EITO Group'
};

const HeroSection = ({ personalInfo: propPersonalInfo, preview = false }: HeroSectionProps) => {
  const personalInfo = propPersonalInfo || defaultPersonalInfo;

  // Static fallback images (from public/) — paint immediately so LCP fires early
  const FALLBACK_IMAGES = [
    '/CE.webp',
    '/connect.webp',
    '/csr.webp',
    '/Engagement.webp',
    '/Living.webp',
    '/LEGO.webp',
  ];

  // Background images — initialised with fallbacks so first image paints immediately
  const [backgroundImages, setBackgroundImages] = useState<string[]>(FALLBACK_IMAGES);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch hero images from database (delayed so local fallback paints as LCP first)
  useEffect(() => {
    // Delay the DB fetch by 3s — local fallback images are preloaded and will be
    // the LCP element. Supabase images replace them after the LCP window closes.
    const fetchTimer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('image_url')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Apply Image Transform to reduce hero image size (1200 wide, 70 quality)
          setBackgroundImages(data.map(img => toSupabaseThumbnail(img.image_url, 1200, 70)));
          // Don't reset index — let the current slide continue without a flash
        }
        // If no DB images, keep fallbacks — do nothing
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Keep fallbacks — do nothing
      }
    }, 3000);

    return () => clearTimeout(fetchTimer);
  }, []);

  useEffect(() => {
    if (backgroundImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  if (preview) {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-lg h-72 md:h-80">
        <div className="absolute inset-0">
          {backgroundImages.length > 0 && (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative h-full flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#fcb22f' }}>
              {personalInfo.name}
            </h1>
            <p className="text-sm md:text-base text-white font-medium">We Build Team Experiences</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => {
          const isCurrent = index === currentImageIndex;
          const isPrev = index === (currentImageIndex - 1 + backgroundImages.length) % backgroundImages.length;
          if (!isCurrent && !isPrev) return null;

          return (
            <motion.div
              key={image}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${image})`,
                willChange: 'opacity',
                transform: 'translateZ(0)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isCurrent ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            />
          );
        })}
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div 
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32"
      >
        <div className="flex flex-col items-center text-center">
          {/* Text Content — no opacity:0 initial so text is visible immediately (no LCP delay) */}
          <div className="space-y-6 sm:space-y-8 max-w-3xl">
            <div className="space-y-4 sm:space-y-6">
              {/* Large Bold Name */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
                style={{ color: '#fcb22f' }}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {personalInfo.name}
              </motion.h1>
              
              {/* Subtitle — plain div so it renders before React animations run */}
              <div className="text-3xl sm:text-4xl md:text-5xl handwritten text-foreground/90">
                <span className="font-bold" style={{ color: '#ffffff' }}>We Build Unforgettable Team Experiences — For </span>
                <SimpleRotatingText
                  texts={['People.', 'Culture.', 'Growth.']}
                  className="font-extrabold"
                  style={{ color: '#fcb22f' }}
                  interval={2000}
                />
              </div>
              
              {/* Body Text */}
              <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
                {personalInfo.tagline}
              </p>
            </div>
            
            {/* Accent Line Divider */}
            <motion.div 
              className="h-1 bg-primary rounded-full mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            {/* Bio Text */}
            <p className="text-lg sm:text-xl leading-relaxed text-white font-bold">
              {personalInfo.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;