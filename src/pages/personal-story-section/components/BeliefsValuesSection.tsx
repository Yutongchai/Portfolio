import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';

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
          className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center text-2xl shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]"
          style={{ backgroundColor: `${belief.color}20` }}
        >
          {belief.accent}
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
      title: "Engagement Through Experience",
      description: "Meaningful experiences create real connection.",
      letter: "E",
      color: "#12a28f",
      accent: "🟢",
      bgImage: import.meta.env.BASE_URL + "/Engagement.jpg"
    },
    {
      title: "Learning by Living",
      description: "Learning is most effective when it's lived, not lectured.",
      letter: "I",
      color: "#fcb22f",
      accent: "🟡",
      bgImage: import.meta.env.BASE_URL + "/Living.jpg"
    },
    {
      title: "Valued Teams Perform",
      description: "Teams perform better when every member feels seen.",
      letter: "T",
      color: "#0074b4",
      accent: "🔵",
      bgImage: import.meta.env.BASE_URL + "/Valued.jpg" // You can change this to /t.jpg if available
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0, isOver: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  return (
    <section
      ref={containerRef}
      className="py-24 px-4 overflow-hidden relative"
    >
      {/* MAIN SECTION BACKGROUND: Using /bg.jpg as requested */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      {/* Semi-transparent white overlay to keep content readable over main bg */}
      <div className="absolute inset-0 bg-white/90 z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-[#23242b] mb-4">
            Our Beliefs & <span className="text-[#e1620b]">Values</span>
          </h2>
          <p className="text-gray-500 font-medium">Built on experience, driven by connection.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32" style={{ perspective: "1200px" }}>
          {beliefs.map((belief, index) => (
            <TiltCard key={index} belief={belief} />
          ))}
        </div>

        {/* Foundation Phrase */}
        <div className="py-20 flex flex-col items-center border-y border-gray-100/50 my-20">
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
        <div className="mt-20">
          <div className="text-center mb-16 rounded-[2.5rem] px-6 py-12 shadow-2xl overflow-hidden relative" style={{ background: '#3a2c23' }}>
            {/* Sub-section can also have a faint bg image if desired */}
            <h3 className="relative z-10 text-sm font-black uppercase tracking-[0.4em] text-[#fcb22f] mb-4">Core Principles</h3>
            <p className="relative z-10 text-3xl font-bold text-white">
              The E I T O Fundamentals
            </p>
          </div>
          <ImageHoverScrollSection />
        </div>
      </div>
    </section>
  );
}

export default BeliefsValuesSection;