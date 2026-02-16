import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageHeader from '../../../components/PageHeader';
import './BeliefsValuesSection.css';

// --- Types ---
type Belief = {
  title: string;
  description: string;
  letter: string;
  color: string;
  accentColor: string;
  bgImage?: string;
};

type TiltCardProps = {
  belief: Belief;
  index: number;
};

// --- Neo-Brutalist Tilt Card ---
const TiltCard: React.FC<TiltCardProps> = ({ belief, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Snappy rotation matching the "sticker" vibe
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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
      className="group relative h-[360px] cursor-pointer"
    >
      {/* THE HARD SHADOW (Background Offset) */}
      <div
        className="absolute inset-0 translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5"
        style={{ backgroundColor: '#153462' }}
      />

      {/* THE MAIN CARD BODY */}
      <div className="relative h-full border-4 border-[#153462] bg-white overflow-hidden flex flex-col">

        {/* Top Image Block (Visual Anchor) */}
        <div className="h-36 border-b-4 border-[#153462] relative overflow-hidden bg-slate-200">
          {belief.bgImage && (
            <img
              src={belief.bgImage}
              alt={belief.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
            />
          )}
          {/* Color Overlay Sticker */}
          <div
            className="absolute top-4 left-4 border-2 border-[#153462] px-3 py-1 font-black text-xs uppercase italic shadow-[2px_2px_0px_0px_#153462]"
            style={{ backgroundColor: belief.accentColor }}
          >
            {belief.letter}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col flex-grow bg-white">
          <h3 className="text-2xl font-black text-[#153462] uppercase italic tracking-tighter mb-3">
            {belief.title} <span style={{ color: belief.accentColor }}>_</span>
          </h3>

          <p className="text-[#153462] font-bold leading-tight text-base mb-4">
            {belief.description}
          </p>


        </div>
      </div>
    </motion.div>
  );
};

const BeliefsValuesSection = () => {
  const beliefs: Belief[] = [
    {
      title: "PLAY",
      description: "Where fun turns into meaningful teamwork",
      letter: "1",
      color: "#153462",
      accentColor: "#12a28f",
      bgImage: "/Engagement.jpg"
    },
    {
      title: "LEARN",
      description: "Where experiences turn into long-term growth",
      letter: "2",
      color: "#153462",
      accentColor: "#fcb22f",
      bgImage: "/Living.jpg"
    },
    {
      title: "LEAD",
      description: "Where teams turn into tomorrow's leaders",
      letter: "3",
      color: "#153462",
      accentColor: "#0074b4", // Blue
      bgImage: "/Valued.jpg"
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id="beliefs-values" ref={containerRef} className="py-16 md:py-24 px-4 md:px-6 bg-[#FFEBD2] overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Brutalist Section Header */}
        <div className="mb-12 md:mb-20">
          <div className="inline-block border-4 border-[#153462] bg-[#f68921] px-4 py-1 md:px-6 md:py-2 mb-4 md:mb-6 rotate-[-2deg] shadow-[4px_4px_0px_0px_#153462]">
            <span className="text-white font-black uppercase tracking-widest text-xs md:text-sm">The Philosophy</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-[#153462] uppercase italic tracking-tighter leading-[0.9] md:leading-[0.85]">
            Our Beliefs & <br />
            <span className="text-[#f68921] underline decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Values_</span>
          </h2>
        </div>

        {/* Cards Grid - Now Scrolls on Mobile */}
        <div className="
          flex flex-nowrap md:grid md:grid-cols-3 
          gap-8 md:gap-16 
          overflow-x-auto md:overflow-visible 
          pb-12 md:pb-0 
          snap-x snap-mandatory 
          scrollbar-hide
        ">
          {beliefs.map((belief, index) => (
            <div key={index} className="min-w-[85vw] md:min-w-0 snap-center">
              <TiltCard belief={belief} index={index} />
            </div>
          ))}
        </div>

        {/* Foundation Phrase - Scaled for Mobile */}
        <div className="flex flex-col items-center mt-20 md:mt-40">
          <div className="relative group w-full max-w-4xl">
            {/* The "Shadow" Box */}
            <div className="absolute inset-0 bg-[#153462] translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 rounded-2xl md:rounded-3xl" />

            <motion.div
              whileHover={{ scale: 1.01, rotate: -1 }}
              className="relative bg-[#fcb22f] border-4 md:border-8 border-[#153462] p-8 md:p-20 rounded-2xl md:rounded-3xl text-center"
            >
              <p className="text-3xl md:text-7xl font-black text-[#153462] uppercase italic tracking-tighter leading-[1.1] md:leading-none">
                That belief is the <br />
                <span className="bg-white px-4 md:px-6 my-2 md:my-4 inline-block border-2 md:border-4 border-[#153462] transform -rotate-2 text-2xl md:text-6xl">
                  FOUNDATION
                </span> <br />
                of everything we do.
              </p>
            </motion.div>
          </div>
        </div>

      </div>

      {/* CSS to hide scrollbars while keeping functionality */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default BeliefsValuesSection;