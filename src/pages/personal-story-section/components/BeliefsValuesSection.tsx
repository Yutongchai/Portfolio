import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';
import PageHeader from '../../../components/PageHeader';
import './BeliefsValuesSection.css';

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

// Accent: three-line 'stripes' (like adidas) using footer stripe colors
const LinesAccent: React.FC = () => {
  const stripeColors = ['#f68921', '#79989f', '#18616e'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, transform: 'rotate(-18deg)', alignItems: 'center' }}>
      <span style={{ display: 'block', width: 16, height: 3, background: stripeColors[0], borderRadius: 2 }} />
      <span style={{ display: 'block', width: 20, height: 3, background: stripeColors[1], borderRadius: 2 }} />
      <span style={{ display: 'block', width: 24, height: 3, background: stripeColors[2], borderRadius: 2 }} />
    </div>
  );
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
      className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl"
    >
      {/* 1. The Background Image Layer */}
      {belief.bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${belief.bgImage}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}

      {/* 2. Glassmorphism Overlay (Ensures readability) */}
      <div className="absolute inset-0 bg-white/80 group-hover:bg-white/70 transition-colors duration-500" />

      {/* 3. Watermark Letter */}
      <div
        className="absolute -right-4 -bottom-10 text-[12rem] font-black opacity-[0.05] group-hover:opacity-10 group-hover:-translate-y-8 transition-all duration-700 pointer-events-none"
        style={{ color: belief.color, transform: "translateZ(30px)" }}
      >
        {belief.letter}
      </div>

      {/* 4. Content Layer */}
      <div className="relative z-10 p-10 h-full flex flex-col" style={{ transform: "translateZ(75px)" }}>
        <div
          className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]"
          style={{ backgroundColor: `${belief.color}20` }}
        >
          <LinesAccent />
        </div>

        <h3 className="text-2xl font-extrabold text-[#23242b] mb-4 group-hover:text-[#e1620b] transition-colors">
          {belief.title}
        </h3>

        <p className="text-gray-600 leading-relaxed font-medium mb-auto">
          {belief.description}
        </p>

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
      color: "#12a28f",
      accent: "🟢",
      bgImage: import.meta.env.BASE_URL + "/Engagement.jpg"
    },
    {
      title: "LEARN",
      description: "Where experiences turn into growth",
      letter: "I",
      color: "#fcb22f",
      accent: "🟡",
      bgImage: import.meta.env.BASE_URL + "/Living.jpg"
    },
    {
      title: "LEAD",
      description: "Where teams turn into leaders",
      letter: "T",
      color: "#0074b4",
      accent: "🔵",
      bgImage: import.meta.env.BASE_URL + "/Valued.jpg" // You can change this to /t.jpg if available
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

  const curvedTextY = useTransform(curvedTextScroll, [0, 0.5, 1], [100, -20, 0]);
  const curvedTextScale = useTransform(curvedTextScroll, [0, 0.5, 1], [0.8, 1.1, 1]);
  const curvedTextOpacity = useTransform(curvedTextScroll, [0, 0.5, 1], [0, 1, 1]);

  useEffect(() => {
    const unsubscribe = curvedTextScroll.on("change", (latest) => {
      if (latest > 0.3 && latest < 0.7) {
        const curveAmount = 20 + Math.sin(latest * Math.PI * 4) * 30;
        gsap.to("#curved-path", {
          attr: { d: `M 30,100 Q 400,${100 - curveAmount} 770,100` },
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    return () => unsubscribe();
  }, [curvedTextScroll]);

  return (
    <section
      id="beliefs-values"
      ref={containerRef}
      className="py-24 px-4 overflow-hidden relative"
    >
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#f5f7fa] via-[#FFEBD2] to-white z-0"
        style={{
          // keep gradient visually static and on its own layer
          backgroundAttachment: 'fixed',
          willChange: 'transform,opacity',
          transform: 'translateZ(0)',
          pointerEvents: 'none'
        }}
      >
        {/* Static floating shapes (animations disabled for smooth scrolling) */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Teal Blob - Top Left */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
            style={{ backgroundColor: '#12a28f', animation: 'none', willChange: 'transform' }}
          />
          {/* Gold Blob - Top Right */}
          <div
            className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: '#fcb22f', animation: 'none', willChange: 'transform' }}
          />
          {/* Blue Blob - Middle */}
          <div
            className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full opacity-8 blur-3xl"
            style={{ backgroundColor: '#0074b4', animation: 'none', willChange: 'transform' }}
          />
          {/* Orange Blob - Bottom Left */}
          <div
            className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: '#f68921', animation: 'none', willChange: 'transform' }}
          />
          {/* Navy Blob - Bottom Right */}
          <div
            className="absolute -bottom-20 -right-10 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: '#153462', animation: 'none', willChange: 'transform' }}
          />

          {/* Geometric pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #23242b 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
              backgroundAttachment: 'fixed'
            }}
          />
        </div>
      </div>

      {/* Light overlay for content readability (promoted to its own layer; avoid costly backdrop blur) */}
      <div
        className="absolute inset-0 bg-white/40 z-0"
        style={{ willChange: 'opacity, transform', transform: 'translateZ(0)', pointerEvents: 'none' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <PageHeader
          title={(
            <>
              Our Beliefs & <span className="text-[#fcb22f]">Values</span>
            </>
          )}
          subtitle={"Real experiences. Real connections. Real growth."}
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32" style={{ perspective: "1200px" }}>
          {beliefs.map((belief, index) => (
            <TiltCard key={index} belief={belief} />
          ))}
        </div>

        {/* Foundation Phrase */}
        <div className="py-6 flex flex-col items-center">
          <p className="text-4xl sm:text-6xl font-black text-center text-[#23242b] leading-tight">
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
                  rotate: "-15deg", // Set your desired tilt degree here
                  backgroundColor: '#fcb22f',
                }}
                className="px-8 py-2 rounded-2xl text-white shadow-xl relative z-10"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, isOver: true });
                }}
                onMouseLeave={() => setMouse(m => ({ ...m, isOver: false }))}
              >
                FOUNDATION
              </motion.span>
            </span>
            <br />
            <span className="opacity-90">of everything we do.</span>
          </p>
        </div>

        {/* Fundamentals Section */}
        <div className="mt-12" ref={curvedTextRef}>
          <motion.div
            className="mb-6 px-6 py-6 overflow-visible relative"
            style={{
              y: curvedTextY,
              scale: curvedTextScale,
              opacity: curvedTextOpacity
            }}
          >
            {/* Horizontal Layout: CORE - Curved Text - PRINCIPLES */}
            <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto gap-4">
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#153462] whitespace-nowrap">CORE</h3>


              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f68921] whitespace-nowrap">PRINCIPLES</h3>
              {/* SVG Curved Text Effect */}
              <div
                className="curved-text-container flex-1 flex justify-center"
                onMouseEnter={() => {
                  gsap.killTweensOf("#curved-path");
                  gsap.to("#curved-path", {
                    attr: { d: "M 30,100 Q 400,40 770,100" },
                    ease: "elastic.out(1.4, 0.4)",
                    duration: 0.8
                  });
                }}
                onMouseLeave={() => {
                  gsap.killTweensOf("#curved-path");
                  gsap.to("#curved-path", {
                    attr: { d: "M 30,100 Q 400,100 770,100" },
                    ease: "elastic.out(1.8, 0.2)",
                    duration: 1.5
                  });
                }}
              >
                <svg viewBox="0 0 800 160" width="100%" height="160px" style={{ maxWidth: '800px' }}>
                  <path id="curved-path" className="curved-path" d="M 30,100 Q 400,100 770,100" />
                  <text className="curved-text">
                    <textPath href="#curved-path" startOffset="50%" textAnchor="middle">
                      <tspan dy="-18">The E I T O Fundamentals</tspan>
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </motion.div>
          <ImageHoverScrollSection />
        </div>
      </div>
    </section>
  );
}

export default BeliefsValuesSection;