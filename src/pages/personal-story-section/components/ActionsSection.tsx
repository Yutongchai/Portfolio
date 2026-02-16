import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import teamBuildingHero from '../../../assets/team_building/hero.png';
import corporateEventsKick from '../../../assets/corporate_events/kick.jpg';
import corporateTrainingLeader from '../../../assets/corporate_training/leader.jpg';
import csrWellbeing from '../../../assets/csr/wellbeing.jpg';

const ActionsSection = () => {
  const categories = [
    {
      id: 'team-building',
      label: 'Team Building',
      color: '#f68921',
      bgImage: teamBuildingHero,
      subCategories: [
        { title: 'Workshop', prefix: 'Learn by doing', desc: 'Interactive indoor challenges that turn problem solving into teamwork.' },
        { title: 'Adventure', prefix: 'Play Hard', desc: 'High-energy outdoor activities to push boundaries.' },
        { title: 'Virtual', prefix: 'Lead from anywhere', desc: 'Engaging remote experiences for distributed teams.' },
      ]
    },
    {
      id: 'training',
      label: 'Training Programme',
      color: '#79989f',
      bgImage: corporateTrainingLeader,
      subCategories: [
        { title: 'Mental Health', prefix: 'Healthier teams', desc: 'Build resilience, emotional awareness, and positive culture.' },
        { title: 'Leadership', prefix: 'Developing leaders', desc: 'Strengthen communication and team performance.' },
        { title: 'Soft Skills', prefix: 'Building skills', desc: 'Interactive learning focused on collaboration.' },
      ]
    },
    {
      id: 'corporate',
      label: 'Corporate Event',
      color: '#fcb22f',
      bgImage: corporateEventsKick,
      subCategories: [
        { title: 'Annual Dinner', prefix: 'Celebrate', desc: 'A memorable evening of appreciation and laughter.' },
        { title: 'Kick-Off Meeting', prefix: 'Start inspired', desc: 'Energising sessions that unite teams around goals.' },
        { title: 'Family Day', prefix: 'Bring everyone', desc: 'Fun activities that connect teams and loved ones.' },
      ]
    },
    {
      id: 'csr',
      label: 'CSR',
      color: '#18616e',
      bgImage: csrWellbeing,
      subCategories: [
        { title: 'Environmental', prefix: 'Positive impact', desc: 'Tree planting and clean-up drives for a greener future.' },
        { title: 'Community', prefix: 'Giving back', desc: 'Support local communities and social programmes.' },
        { title: 'Education', prefix: 'Empowering', desc: 'Skill-sharing sessions that inspire growth.' },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [expandedIndex, setExpandedIndex] = useState(0); // Track which card is "on top"
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setExpandedIndex(0);
  }, [activeTab]);

  // Logic to cycle the cards on swipe
  const handleSwipe = (direction: number) => {
    const total = activeTab.subCategories.length;
    if (direction > 0) {
      // Swipe Down: Next card
      setExpandedIndex((prev) => (prev + 1) % total);
    } else {
      // Swipe Up: Previous card
      setExpandedIndex((prev) => (prev - 1 + total) % total);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 bg-white overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-8 md:mb-16">
        <div className="inline-block border-[3px] md:border-4 border-[#153462] bg-[#fcb22f] px-3 py-1 mb-2 md:mb-4 rotate-[-2deg] shadow-[3px_3px_0px_0px_#153462]">
          <span className="text-[#153462] font-black uppercase tracking-widest text-[10px] md:text-sm">Our Expertise</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black text-[#153462] mt-3 uppercase italic tracking-tighter leading-none">
          Everyone In, <span className="text-[#f68921]">Team On!</span>
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-row justify-between w-full gap-1 md:gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat)}
            className={`
                flex-1 text-[10px] md:text-base px-1 md:px-6 py-3 font-black uppercase italic tracking-tighter border-[3px] md:border-4 border-[#153462] transition-all
                ${activeTab.id === cat.id
                ? 'bg-[#153462] text-white -translate-y-1 shadow-[4px_4px_0px_0px_#f68921]'
                : 'bg-white text-[#153462] shadow-[2px_2px_0px_0px_#153462]'}
            `}
          >
            <span className="block md:hidden">{cat.label.split(' ')[0]}</span>
            <span className="hidden md:block">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="relative border-4 md:border-8 border-[#153462] bg-[#153462] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[8px_8px_0px_0px_#fcb22f]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeTab.bgImage})` }}
          />
        </AnimatePresence>

        <div className="relative z-10 p-6 md:p-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
            <h3 className="text-3xl md:text-6xl font-black text-white uppercase italic">
              {activeTab.label} <span className="text-[#fcb22f]">_</span>
            </h3>

            <button
              className="bg-[#f68921] text-[#153462] border-[3px] border-[#153462] px-6 py-2 md:px-8 md:py-3 font-black uppercase text-xs md:text-base shadow-[3px_3px_0px_0px_white] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              onClick={() => window.location.href = `/work-showcase/${activeTab.id}`}
            >
              Learn More →
            </button>
          </div>

          {/* Subcategories - Swipe Shuffle Stack */}
          <div className="relative h-[340px] md:h-auto md:grid md:grid-cols-3 md:gap-8 flex items-center justify-center">
            {activeTab.subCategories.map((sub, index) => {
              const isTop = expandedIndex === index;

              // We only want the TOP card to be draggable on mobile
              return (
                <motion.div
                  key={sub.title + activeTab.id}
                  drag={isMobile && isTop ? "y" : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.y) > 50) {
                      handleSwipe(info.offset.y);
                    }
                  }}
                  layout
                  animate={{
                    opacity: 1,
                    // Mobile stacking logic
                    y: isMobile ? (isTop ? 0 : 20 + (index * 10)) : 0,
                    scale: isMobile ? (isTop ? 1 : 0.9) : 1,
                    rotate: isMobile ? (isTop ? 0 : (index - expandedIndex) * 2) : 0,
                    zIndex: isTop ? 40 : 10 - Math.abs(index - expandedIndex),
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`
                      absolute top-0 left-0 right-0 md:relative 
                      bg-white border-[3px] md:border-4 border-[#153462] p-5 md:p-8 
                      rounded-xl md:rounded-2xl touch-none
                      shadow-[4px_4px_0px_0px_#153462] md:shadow-[6px_6px_0px_0px_#153462]
                      ${!isTop && isMobile ? 'brightness-75' : 'brightness-100'}
                  `}
                  style={{
                    // Prevent accidental clicks during drags
                    pointerEvents: isMobile && !isTop ? 'none' : 'auto'
                  }}
                >
                  <div className="flex items-center justify-between mb-2 md:mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 md:w-12 md:h-12 border-[3px] md:border-4 border-[#153462] flex items-center justify-center font-black text-sm md:text-xl text-white"
                        style={{ backgroundColor: activeTab.color }}
                      >
                        {index + 1}
                      </div>
                      <h4 className="text-xl md:text-2xl font-black text-[#153462] uppercase leading-none">{sub.title}</h4>
                    </div>
                    {isMobile && isTop && (
                      <div className="flex flex-col items-center opacity-40">
                        <span className="text-[8px] font-black text-[#153462]">SWIPE TO SHUFFLE</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[#153462] font-bold text-xs md:text-sm opacity-60 mb-2 md:mb-4 italic">{sub.prefix}</p>

                  <p className="text-slate-700 font-medium text-sm md:text-base leading-snug md:leading-relaxed">
                    {sub.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionsSection;