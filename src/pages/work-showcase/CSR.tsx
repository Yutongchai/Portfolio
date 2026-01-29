import React, { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire';
import { motion, AnimatePresence } from 'framer-motion';
import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';

// Slider Images Data
const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
    caption: "Building a Greener Future"
  },
  {
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
    caption: "Empowering Local Communities"
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
    caption: "Nurturing the Next Generation"
  }
];

type CategoryCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const CategoryCard = ({ title, description, icon, color }: CategoryCardProps) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.02 }}
    className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col group cursor-default"
  >
    <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed flex-grow font-medium">{description}</p>
    <div className="mt-8 h-1.5 w-12 rounded-full transition-all duration-500 group-hover:w-full" style={{ backgroundColor: color }} />
  </motion.div>
);


const CSR = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fdfdfb] text-[#23242b] overflow-x-hidden">
      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/work-showcase" },
          { label: "Connect", href: "/connection-hub" },
        ]}
        activeHref={"/work-showcase"}
      />

      {/* --- HERO SLIDER SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={sliderImages[currentSlide].url}
              className="w-full h-full object-cover"
              alt="CSR Showcase"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Content Overlay */}
        <div className="relative z-20 text-center text-white px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            {/* The "Line indicating the topic" */}
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
            <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">
              Social Responsibility
            </span>
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-black mb-8 tracking-tighter"
          >
            CSR
          </motion.h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
            Create positive impact through meaningful CSR initiatives that align with your company values.
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {sliderImages.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-[#fcb22f]' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* --- HELPING SECTION --- */}
      <section className="py-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight">
          How CSR with EITO <br /><span className="text-[#fcb22f]">helps your organization</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-3xl leading-relaxed mb-16 font-medium">
          We bridge corporate vision with grassroots needs. Our approach ensures your
          initiatives are HRD-claimable, operationally seamless, and leave a measurable impact
          on both the community and your brand equity.
        </p>
        <div className="w-full h-[1px] bg-gray-200" />
      </section>

      {/* --- HRD CORP BANNER --- */}
      <section className="bg-white border-y border-gray-100 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h3 className="text-3xl font-black mb-4">Certified Excellence</h3>
            <p className="text-gray-500 text-lg">Our CSR programs are fully claimable under <strong>HRD Corp Malaysia</strong>, helping you maximize your levy while doing good.</p>
          </div>
          <img src={import.meta.env.BASE_URL + "/HRD.png"} alt="HRD Logo" className="h-32 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </section>

      {/* --- FOCUS AREAS (3 CATEGORIES) --- */}
      <section className="py-32 px-8 bg-[#f8f8f6]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-20">
            <div>
              <p className="text-[#fcb22f] font-bold tracking-widest uppercase mb-4">Focus Areas</p>
              <h2 className="text-5xl font-black">Sub-categories</h2>
            </div>
            <div className="hidden md:block h-0.5 w-1/3 bg-gray-200" />
          </div>

          {/* Tabbed Pills */}
          {(() => {
            const tabs = [
              {
                title: "Environmental",
                description: "Best fit for eco-focused initiatives like tree planting and coastal cleanups.",
                icon: "🌿",
                color: "#12a28f",
              },
              {
                title: "Community Outreach",
                description: "Best fit for direct support for local social welfare programs and underprivileged groups.",
                icon: "🤝",
                color: "#0074b4",
              },
              {
                title: "Education",
                description: "Best fit for empowering the next generation through skill sharing and mentorship.",
                icon: "🎓",
                color: "#fcb22f",
              },
            ];
            const [activeTab, setActiveTab] = React.useState(0);
            return (
              <div>
                <div className="flex justify-center gap-8 mb-16">
                  {tabs.map((tab, idx) => (
                    <button
                      key={tab.title}
                      onClick={() => setActiveTab(idx)}
                      className={`px-12 py-5 rounded-3xl text-xl font-bold shadow-lg transition-all duration-300 focus:outline-none ${activeTab === idx
                        ? 'bg-white text-[#23242b] shadow-[0_8px_24px_rgba(0,0,0,0.10)]'
                        : 'bg-gray-100 text-gray-400 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:bg-white/80'
                        }`}
                      style={{ minWidth: 180 }}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <CategoryCard
                    title={tabs[activeTab].title}
                    description={tabs[activeTab].description}
                    icon={tabs[activeTab].icon}
                    color={tabs[activeTab].color}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* --- WHY CHOOSE US & INQUIRY FORM --- */}
      <section className="py-32 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-5xl font-black mb-12">Why choose us?</h2>
          <div className="space-y-12">
            {[
              { t: "Measurable Impact", d: "We provide detailed reports on the social and environmental outcomes of your project." },
              { t: "Strategic Alignment", d: "We tailor initiatives to match your company's core values and industry focus." },
              { t: "End-to-End Management", d: "From logistics to NGO coordination, we handle everything so you don't have to." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <span className="text-[#fcb22f] font-black text-2xl">0{i + 1}</span>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.t}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Questionnaire />
      </section>

      <Footer />
    </div>
  );
};

export default CSR;