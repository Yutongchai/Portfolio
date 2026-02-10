import React, { useState } from 'react';
import { Utensils, Zap, Users, Monitor, Star, Award, TrendingUp, Calendar, Heart, Globe, GraduationCap, Trophy } from 'lucide-react';

const ActionsSection = () => {
  const categories = [
    {
      id: 'team-building',
      label: 'Team Building',
      color: '#f68921', // Brand Orange
      subCategories: [
        { title: 'Workshop', prefix: 'Learn by doing', desc: 'Interactive indoor challenges that turn problem solving into teamwork and growth.' },
        { title: 'Adventure', prefix: 'Experience', desc: 'High-energy outdoor activities to push boundaries.' },
        { title: 'Virtual', prefix: 'Engage through', desc: 'Engaging remote experiences for distributed teams.' },
      ]
    },
    {
      id: 'training',
      label: 'Training Programme',
      color: '#79989f', // Brand Sage/Blue
      subCategories: [
        { title: 'MENTAL HEALTH & WELLBEING PROGRAMMES', prefix: 'Supporting healthier, happier teams', desc: 'Practical training that builds resilience, emotional awareness, and positive workplace culture.' },
        { title: 'LEADERSHIP & MANAGEMENT PROGRAMMES', prefix: 'Developing confident leaders who inspire growth', desc: 'Hands on training that strengthens communication, decision-making, and team performance' },
        { title: 'PERSONAL DEVELOPMENT & SOFT SKILLS PROGRAMMES', prefix: 'Building skills \nthat strengthen individuals and teams', desc: 'Interactive learning focused on collaboration, confidence, and workplace effectiveness' },
      ]
    },
    {
      id: 'corporate',
      label: 'Corporate Event',
      color: '#fcb22f', // Brand Gold
      subCategories: [
        { title: 'ANNUAL DINNER', prefix: 'Celebrate achievements and strengthen connections', desc: 'A memorable evening of appreciation, laughter, and team bonding.' },
        { title: 'KICK-OFF MEETING', prefix: 'Start the year aligned and inspired', desc: 'Energising sessions that unite teams around goals and vision.' },
        { title: 'FAMILY DAY', prefix: 'Bring everyone together in celebration', desc: 'Fun filled activities that connect teams and their loved ones. ' },
        { title: 'SPORTS DAY', prefix: 'Play together. Win together. Grow together.', desc: 'Exciting team challenges that build spirit, wellness, and collaboration.' },
      ]
    },
    {
      id: 'csr',
      label: 'CSR',
      color: '#18616e', // Brand Teal/Dark
      subCategories: [
        { title: 'Environmental', prefix: 'Protect with', desc: 'eco-focused initiatives like tree planting and cleanups.' },
        { title: 'Community Outreach', prefix: 'Support through', desc: 'direct support for local social welfare programs.' },
        { title: 'Education', prefix: 'Empower through', desc: 'empowering the next generation through skill sharing.' },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [fadeKey, setFadeKey] = useState(0);

  const handleTabChange = (cat: typeof categories[0]) => {
    setActiveTab(cat);
    setFadeKey(prev => prev + 1);
  };

  // Helper to render Lucide icons based on title
  const renderIcon = (title: string, color: string) => {
    const props = { size: 28, strokeWidth: 1.5, style: { color } };
    switch (title) {
      case 'Workshop': return <Users {...props} />;
      case 'Adventure': return <Zap {...props} />;
      case 'Virtual': return <Monitor {...props} />;
      case 'Mental Health & Wellbeing': return <Heart {...props} />;
      case 'Leadership & Management': return <Award {...props} />;
      case 'Personal Development & Soft Skills': return <Star {...props} />;
      case 'Annual Dinner': return <Utensils {...props} />;
      case 'Kick-off Meeting': return <Calendar {...props} />;
      case 'Family Day': return <Users {...props} />;
      case 'Sports Day': return <Trophy {...props} />;
      case 'Environmental': return <Globe {...props} />;
      case 'Community Outreach': return <Heart {...props} />;
      case 'Education': return <GraduationCap {...props} />;
      default: return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* LEFT BOX: Header + Main Categories */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="max-w-xs">
            <span className="text-[#f68921] font-bold uppercase tracking-[0.25em] text-sm">Our Expertise</span>
            <h4 className="text-4xl md:text-5xl font-black text-[#153462] mt-4 leading-tight uppercase tracking-tighter">
              <span className="whitespace-nowrap">Everyone In,</span><br />
              <span className="text-[#f68921]">Team On!</span>
            </h4>
          </div>

          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat)}
                className={`
                  relative flex items-center justify-between px-8 py-7 rounded-3xl border-2 transition-all duration-500
                  ${activeTab.id === cat.id
                    ? 'bg-[#153462] border-[#153462] text-white shadow-xl shadow-[#153462]/20 translate-x-4'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-[#f68921]/40 hover:translate-x-2'}
                `}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xl font-bold tracking-tight">{cat.label}</span>
                </div>
                {activeTab.id === cat.id && (
                  <div className="bg-[#f68921] rounded-full p-1">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT BOX: Sub-Category Content */}
        <div className="lg:col-span-8 bg-[#153462]/[0.02] rounded-[3rem] p-10 md:p-16 border border-[#153462]/5 min-h-[500px] flex flex-col relative overflow-hidden">
          {/* Subtle brand watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <h2 className="text-9xl font-black text-[#153462]">EITO</h2>
          </div>

          <div className="flex items-center justify-between mb-12 pb-6 border-b border-[#153462]/10 relative z-10">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#153462]">
              {activeTab.label} <span className="text-[#f68921]">Solutions</span>
            </h3>
            <button
              onClick={() => {
                const routes: Record<string, string> = {
                  'team-building': '/work-showcase/team-building',
                  'training': '/work-showcase/training-program',
                  'corporate': '/work-showcase/corporate-event',
                  'csr': '/work-showcase/csr'
                };
                window.location.href = routes[activeTab.id] || '/work-showcase';
              }}
              className="px-6 py-3 bg-[#153462] hover:bg-[#1c447a] text-white font-bold text-sm rounded-full transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl uppercase tracking-wider"
            >
              Learn More
            </button>
          </div>

          <div
            key={fadeKey}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 animate-fadeIn relative z-10"
          >
            {activeTab.subCategories.map((sub, index) => (
              <div key={index} className="group">
                <div
                  className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm"
                  style={{ backgroundColor: `${activeTab.color}15` }}
                >
                  {renderIcon(sub.title, activeTab.color)}
                </div>
                <h4 className="text-2xl font-black text-[#153462] mb-3 uppercase tracking-tight">
                  {sub.title}
                </h4>
                <p className="text-slate-500 leading-relaxed text-lg">
                  {sub.prefix} <span className="text-[#153462] font-semibold">{sub.desc}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}} />
    </section>
  );
};

export default ActionsSection;