import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface Offering {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor?: string;
}

interface OfferingsGridProps {
  offerings: Offering[];
}

const OfferingsGrid: React.FC<OfferingsGridProps> = ({ offerings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
      {offerings.map((offering, index) => (
        <GlassCard key={offering.id} offering={offering} index={index} />
      ))}
    </div>
  );
};

function GlassCard({ offering, index }: { offering: Offering; index: number }) {
  // Convert hex color to gradient if provided
  const gradientColor = offering.accentColor
    ? `from-[${offering.accentColor}] to-[${offering.accentColor}]/80`
    : 'from-[#fcb22f] to-[#fcb22f]/80';

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: {
          duration: 0.3,
        },
      }}
      className="group relative flex flex-col h-full p-8 rounded-3xl overflow-hidden"
    >
      {/* Light Glass Background */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.12),_0_5px_15px_rgba(0,0,0,0.08)] group-hover:bg-white/80 group-hover:border-white/60 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.18),_0_10px_25px_rgba(0,0,0,0.12)]" />

      {/* Gradient Glow Effect on Hover */}
      <div
        className="absolute -inset-px opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500 rounded-3xl"
        style={{
          background: `linear-gradient(to bottom right, ${offering.accentColor ?? '#fcb22f'}, ${offering.accentColor ?? '#fcb22f'}90)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon Container */}
        <div
          className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25),_0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),_0_6px_18px_rgba(0,0,0,0.2)] transition-all duration-300"
          style={{
            background: `linear-gradient(to bottom right, ${offering.accentColor ?? '#fcb22f'}, ${offering.accentColor ?? '#fcb22f'}dd)`,
          }}
        >
          <div className="text-white [&>img]:brightness-0 [&>img]:invert">
            {offering.icon}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 transition-colors">
          {offering.title}
        </h3>

        <p className="text-sm leading-relaxed text-slate-600 mb-8 flex-grow group-hover:text-slate-800 transition-colors">
          {offering.description}
        </p>
      </div>
    </motion.div>
  );
}

export default OfferingsGrid;
