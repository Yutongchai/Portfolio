import React from 'react';
import { motion } from 'framer-motion';
import { CoreValue } from '../types';

interface CoreValuesSectionProps {
  values: CoreValue[];
}

const COLORS = [
  '#12a28f', // TEAL
  '#695da5', // PURPLE
  '#f68921', // ORANGE
  '#ee424c', // CORAL
  '#fcb22f', // GOLD
];

const CoreValuesSection = ({ values }: CoreValuesSectionProps) => {
  return (
    <section className="relative py-24 overflow-hidden bg-[#FFEBD2]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Section Heading with the EITO vibe */}
        <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-[#153462] uppercase italic tracking-tighter">
                Our DNA <span className="text-[#f68921]">_</span>
            </h2>
            <div className="w-24 h-3 bg-[#fcb22f] mx-auto mt-2 border-2 border-[#153462] rounded-full" />
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {values?.map((value, idx) => {
            const cardColor = COLORS[idx % COLORS.length];
            
            return (
              <motion.div
                key={value?.id}
                whileHover={{ 
                    scale: 1.05, 
                    rotate: idx % 2 === 0 ? -3 : 3,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                className="group relative"
              >
                {/* The "Shadow" / Offset Background */}
                <div className="absolute inset-0 bg-[#153462] rounded-[2rem] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                
                {/* The Main Card */}
                <div className="relative bg-white border-4 border-[#153462] rounded-[2rem] p-8 h-full flex flex-col items-center text-center transition-colors">
                  
                  {/* Icon/Emoji Container */}
                  <div 
                    className="w-16 h-16 rounded-2xl border-4 border-[#153462] flex items-center justify-center text-4xl mb-6 shadow-[4px_4px_0px_0px_#153462] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all"
                    style={{ backgroundColor: cardColor }}
                  >
                    {value?.emoji}
                  </div>

                  <h3 className="text-xl font-black text-[#153462] uppercase mb-3 italic tracking-tight">
                    {value?.title}
                  </h3>
                  
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    {value?.description}
                  </p>

                  {/* Decorative dots in the corner like a ticket/sticker */}
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#153462] opacity-20" />
                    <div className="w-2 h-2 rounded-full bg-[#153462] opacity-20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;