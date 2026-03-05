import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type HeroProps = {
  background: string | string[];
  autoplay?: boolean;
  interval?: number;
  overlayClassName?: string;
  minHeightClass?: string;
  className?: string;
  children?: React.ReactNode;
};

const Hero: React.FC<HeroProps> = ({
  background,
  autoplay = true,
  interval = 5000,
  overlayClassName,
  minHeightClass = 'min-h-[85vh] pt-32 pb-20',
  className = '',
  children,
}) => {
  const images = Array.isArray(background) ? background : [background];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [autoplay, images.length, interval]);

  const current = images[index];

  return (
    <section className={`relative ${minHeightClass} flex items-center justify-center overflow-hidden bg-black text-white ${className}`}>
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
        <img src={current} alt="hero background" className="w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
        <div className={`absolute inset-0 ${overlayClassName ?? 'bg-gradient-to-br from-black/70 via-[#0f1e38]/70 to-[#f68921]/35'}`} />
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        {children}
      </div>
    </section>
  );
};

export default Hero;
