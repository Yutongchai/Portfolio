import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

const ActionsSection = () => {
  // 1. Data Structure using your updated content and sub-categories
  const categories = [
    {
      id: 'team-building',
      label: 'Team Building',
      color: '#0074b4', // Blue for Teamwork
      subCategories: [
        { title: 'Workshop', desc: 'interactive indoor sessions focusing on problem solving.' },
        { title: 'Adventure', desc: 'high-energy outdoor activities to push boundaries.' },
        { title: 'Virtual', desc: 'engaging remote experiences for distributed teams.' },
      ]
    },
    {
      id: 'training',
      label: 'Training Program',
      color: '#fcb22f', // Yellow for Integrity
      subCategories: [
        { title: 'Personal Skill', desc: 'enhancing individual effectiveness and soft skills.' },
        { title: 'Departmental', desc: 'custom training tailored for specific team workflows.' },
        { title: 'Leadership', desc: 'strategic coaching for current and future leaders.' },
      ]
    },
    {
      id: 'corporate',
      label: 'Corporate Event',
      color: '#ee424c', // Red for Honour
      subCategories: [
        { title: 'Annual Dinner', desc: 'memorable celebrations to reward your team.' },
        { title: 'Kick-off Meeting', desc: 'aligning vision and energy for the year ahead.' },
      ]
    },
    {
      id: 'csr',
      label: 'CSR',
      color: '#12a28f', // Green for Equilibrium
      subCategories: [
        { title: 'Environmental', desc: 'eco-focused initiatives like tree planting and cleanups.' },
        { title: 'Community Outreach', desc: 'direct support for local social welfare programs.' },
        { title: 'Education', desc: 'empowering the next generation through skill sharing.' },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [fadeKey, setFadeKey] = useState(0);

  // When tab changes, trigger fade animation
  const handleTabChange = (cat: typeof categories[0]) => {
    setActiveTab(cat);
    setFadeKey(prev => prev + 1);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-[#fdfdfb]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
        {/* LEFT BOX: Header + Main Categories */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-h-full h-full">
          {/* Header Section with EITO Summary */}
          <div className="mb-2 max-w-xs">
            <span className="text-[#e1620b] font-bold uppercase tracking-[0.2em] text-sm">What We Do</span>
            <h4 className="text-3xl md:text-4xl font-bold text-[#23242b] mt-4 leading-tight">
              Everyone In, <br /><span className="text-[#fcb22f]">Team On !</span>
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat)}
                className={`
                  relative overflow-hidden flex items-center justify-between px-8 py-7 rounded-2xl border-2 transition-all duration-400
                  ${activeTab.id === cat.id
                    ? 'bg-[#23242b] border-[#23242b] text-white shadow-2xl translate-x-3'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-[#fcb22f]/30'}
                `}
              >
                <div className="flex items-center gap-4">
                  {/* EITO Color Indicator */}
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xl font-bold tracking-wide">{cat.label}</span>
                </div>
                {activeTab.id === cat.id && (
                  <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT BOX: Sub-Category Content */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 min-h-[450px] h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: activeTab.color }}>
              {activeTab.label} Solutions
            </h3>
          </div>

          <div
            key={fadeKey}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 transition-opacity duration-500"
            style={{ opacity: 1, animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {activeTab.subCategories.map((sub, index) => {
              // Icon selection based on sub.title
              let icon: React.ReactNode = null;
              switch (sub.title) {
                case 'Workshop':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="4" y="8" width="16" height="10" rx="2" strokeWidth="2" />
                      <path d="M8 8V6a4 4 0 1 1 8 0v2" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Adventure':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Virtual':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
                      <path d="M8 21v-2a4 4 0 0 1 8 0v2" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Personal Skill':
                  icon = (
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div
                        style={{ backgroundColor: activeTab.color }}
                      />

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={activeTab.color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:rotate-12"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        <path d="M5 3L4 4" />
                        <path d="M19 21l1-1" />
                        <path d="M3 21l1-1" />
                        <path d="M21 3l-1 1" />
                      </svg>
                    </div>
                  );
                  break;
                case 'Departmental':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="10" width="18" height="7" rx="2" strokeWidth="2" />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Leadership':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" strokeWidth="2" />
                      <path d="M6 20v-2a6 6 0 0 1 12 0v2" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Annual Dinner':
                  icon = (
                    <div className="relative group/icon">
                      {/* Background Glow - matches the Webflow style */}
                      <div
                        className="absolute inset-0 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"
                        style={{ backgroundColor: activeTab.color }}
                      />

                      {/* The Actual Icon */}
                      <Utensils
                        size={28}
                        strokeWidth={1.5} // Thin lines look more premium
                        className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: activeTab.color }}
                      />
                    </div>
                  );
                  break;
                case 'Kick-off Meeting':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
                      <path d="M16 2v4M8 2v4" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Environmental':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C7 7 2 12 12 22C22 12 17 7 12 2Z" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Community Outreach':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2" />
                    </svg>
                  );
                  break;
                case 'Education':
                  icon = (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 7l9-4 9 4-9 4-9-4z" strokeWidth="2" />
                      <path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" strokeWidth="2" />
                    </svg>
                  );
                  break;
                default:
                  icon = null;
              }
              return (
                <div key={index} className="group relative">
                  <div
                    className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12"
                    style={{ backgroundColor: `${activeTab.color}15`, color: activeTab.color }}
                  >
                    {icon}
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#23242b] mb-3">{sub.title}</h4>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    Best fit for <span className="text-gray-800">{sub.desc}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </section>
  );
};

export default ActionsSection;