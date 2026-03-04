import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';
import ScrollableCards from '../../../components/ui/ScrollableCards';
import FoundationPhrase from './FoundationPhrase';
import './BeliefsValuesSection.css';
import Engagement from '../../../assets/Engagement.webp';
import Living from '../../../assets/learn.webp';
import Valued from '../../../assets/Valued.webp';

// --- Types ---
type Belief = {
  title: string;
  description: string;
  letter: string;
  color: string;
  accent: React.ReactNode;
  bgImage?: string; // Added image property
};

type TiltCardProps = {
  belief: Belief;
};

// --- 3D Tilt Card with Image Background ---
const TiltCard: React.FC<TiltCardProps> = ({ belief }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative h-[360px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl bg-white"
    >
      {/* 1. Top media band for image (keeps picture visible but not overwhelming) */}
      {belief.bgImage ? (
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden">
          <img
            src={belief.bgImage}
            alt={belief.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-gray-100" />
      )}

      {/* subtle dark overlay over entire card for improved contrast */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/35 transition-colors duration-500" />

      {/* 3. Watermark Letter — smaller so it doesn't overpower the title */}
      <div
        className="absolute right-6 bottom-6 text-[6.5rem] font-black opacity-[0.04] group-hover:opacity-10 transition-all duration-700 pointer-events-none"
        style={{ color: belief.color, transform: "translateZ(30px)" }}
      >
        {belief.letter}
      </div>

      {/* 4. Content Layer — positioned below the media band */}
      <div className="relative z-10 flex flex-col justify-between h-full" style={{ transform: "translateZ(75px)" }}>
        <div className="p-8 pt-[55%] md:pt-[52%]">{/* padding-top reserve for media */}
          <div
            className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-2xl shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]"
            style={{ backgroundColor: `${belief.color}` }}
          >
            {belief.accent}
          </div>

          <h3
            className="text-3xl md:text-4xl font-extrabold text-white mb-3 group-hover:text-[#e1620b] transition-colors"
            style={{ textShadow: '0 8px 20px rgba(0,0,0,0.55)' }}
          >
            {belief.title}
          </h3>

          <p
            className="text-base md:text-lg text-white/90 leading-relaxed font-medium mb-6 max-w-prose"
            style={{ textShadow: '0 6px 14px rgba(0,0,0,0.45)' }}
          >
            {belief.description}
          </p>
        </div>

        <div className="p-8 pt-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            style={{ color: belief.color }}
          >
            View Details
            <span className="w-8 h-8 rounded-full flex items-center justify-center border border-current">↗</span>
          </motion.div>
        </div>
      </div>

      {/* Animated accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 h-2 w-0 group-hover:w-full transition-all duration-700"
        style={{ backgroundColor: belief.color }}
      />
    </motion.div>
  );
};

const BeliefsValuesSection = () => {
  // Added your requested image paths here
  const beliefs: Belief[] = [
    {
      title: "PLAY",
      description: "Where fun turns into teamwork",
      letter: "E",
      color: "#c3e1dc",
      accent: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="20" height="3" rx="1.5" fill="#153462" />
          <rect x="6" y="14.5" width="20" height="3" rx="1.5" fill="#79989f" />
          <rect x="6" y="21" width="20" height="3" rx="1.5" fill="#f68921" />
        </svg>
      ),
      bgImage: Engagement,
    },
    {
      title: "LEARN",
      description: "Where experiences turn into growth",
      letter: "I",
      color: "#e1c89d",
      accent: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="20" height="3" rx="1.5" fill="#153462" />
          <rect x="6" y="14.5" width="20" height="3" rx="1.5" fill="#79989f" />
          <rect x="6" y="21" width="20" height="3" rx="1.5" fill="#f68921" />
        </svg>
      ),
      bgImage: Living,
    },
    {
      title: "LEAD",
      description: "Where teams turn into leaders",
      letter: "T",
      color: "#abc9d9",
      accent: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="20" height="3" rx="1.5" fill="#153462" />
          <rect x="6" y="14.5" width="20" height="3" rx="1.5" fill="#79989f" />
          <rect x="6" y="21" width="20" height="3" rx="1.5" fill="#f68921" />
        </svg>
      ),
      bgImage: Valued,
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);

  const curvedTextRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0, isOver: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const { scrollYProgress: curvedTextScroll } = useScroll({
    target: curvedTextRef,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  return (

    <section
      id="beliefs-values"
      ref={containerRef}
      /* We use a gradient that transitions from light beige to the dark charcoal of your images */
      className="py-16 px-4 relative transition-colors"
      style={{
        background: `linear-gradient(to bottom, #f5f7fa 0%, #FFEBD2 40%, #020202 90%)`
      }}
    >
      {/* 1. ANIMATED BLOBS (Kept for the top half) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#12a28f' }} />
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#fcb22f' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Styled to match "THE EITO FUNDAMENTALS" look */}
        <div className="text-center mb-20 pt-12">
          <h1 className="text-5xl md:text-6xl font-black text-[#23242b]">
            Our Beliefs & <span className="text-[#f68921]">Values</span>
          </h1>
        </div>

        {/* Cards Grid - Now sitting on the deepening background */}
        <div style={{ perspective: "1200px" }} className="mb-24">
          <ScrollableCards desktopColumns={3} gap={8} className="">
            {beliefs.map((belief, index) => (
              <TiltCard key={index} belief={belief} />
            ))}
          </ScrollableCards>
        </div>

        {/* This creates the visual "Floor" before the next section */}
        <FoundationPhrase />
      </div>
    </section>
  );
}

export default BeliefsValuesSection;