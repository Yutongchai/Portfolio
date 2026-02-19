import React, { useState } from 'react';
import './ActionsSection.css';
import teamBuildingHero from '../../../assets/team_building/hero.png';
import corporateEventsKick from '../../../assets/corporate_events/kick.jpg';
import corporateTrainingLeader from '../../../assets/corporate_training/leader.jpg';
import csrWellbeing from '../../../assets/csr/wellbeing.jpg';

const ActionsSection = () => {
  const categories = [
    {
      id: 'team-building',
      label: 'Team Building',
      color: '#f68921', // Brand Orange
      bgImage: teamBuildingHero,
      subCategories: [
        { title: 'Workshop', prefix: 'Learn by doing', desc: 'Interactive indoor challenges that turn problem solving into teamwork and growth.' },
        { title: 'Adventure', prefix: 'Play Hard', desc: 'High-energy outdoor activities to push boundaries.' },
        { title: 'Virtual', prefix: 'Lead from anywhere', desc: 'Engaging remote experiences for distributed teams.' },
      ]
    },
    {
      id: 'training',
      label: 'Training Programme',
      color: '#79989f', // Brand Sage/Blue
      bgImage: corporateTrainingLeader,
      subCategories: [
        { title: 'Mental Health & Wellbeing', prefix: 'Supporting healthier, happier teams', desc: 'Build resilience, emotional awareness, and positive workplace culture.' },
        { title: 'Leadership & Management', prefix: 'Developing confident leaders who inspire growth', desc: 'Strengthen communication, decision-making, and team performance.' },
        { title: 'Personal Development & Soft Skills', prefix: 'Building skills that strengthen individuals and teams', desc: 'Interactive learning focused on collaboration, confidence, and workplace effectiveness.' },
      ]
    },
    {
      id: 'corporate',
      label: 'Corporate Event',
      color: '#fcb22f', // Brand Gold
      bgImage: corporateEventsKick,
      subCategories: [
        { title: 'Annual Dinner', prefix: 'Celebrate achievements and strengthen connections', desc: 'A memorable evening of appreciation, laughter, and team bonding.' },
        { title: 'Kick-Off Meeting', prefix: 'Start the year aligned and inspired', desc: 'Energising sessions that unite teams around goals and vision.' },
        { title: 'Family Day', prefix: 'Bring everyone together in celebration', desc: 'Fun-filled activities that connect teams and their loved ones.' },
        { title: 'Sports Day', prefix: 'Play together. Win together. Grow together.', desc: 'Exciting team challenges that build spirit, wellness, and collaboration.' },
      ]
    },
    {
      id: 'csr',
      label: 'CSR',
      color: '#18616e', // Brand Teal/Dark
      bgImage: csrWellbeing,
      subCategories: [
        { title: 'Environmental', prefix: 'Making a positive impact on our planet together', desc: 'Tree planting and clean-up drives that unite teams for a greener future.' },
        { title: 'Community Outreach', prefix: 'Giving back where it matters most', desc: 'Support local communities and social welfare programmes.' },
        { title: 'Education', prefix: 'Empowering the next generation through sharing knowledge', desc: 'Skill-sharing sessions that inspire growth and create lasting impact.' },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [prevTab, setPrevTab] = useState(categories[0]);

  const handleTabChange = (cat: typeof categories[0]) => {
    if (cat.id === activeTab.id) return;
    setPrevTab(activeTab);
    setActiveTab(cat);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="text-center mb-12 pt-10">
        <span className="text-[#f68921] font-bold uppercase tracking-[0.25em] text-sm">Our Expertise</span>
        <h2 className="text-4xl md:text-5xl font-black text-[#153462] mt-3 mb-2 uppercase tracking-tight">
          Everyone In, <span className="text-[#f68921]">Team On!</span>
        </h2>
        <p className="text-gray-500 text-base">Discover our comprehensive solutions designed for your team</p>
      </div>

      {/* Tab Navigation */}
      <div className="actions-tabs-wrapper">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTabChange(cat)}
            className={`actions-tab ${activeTab.id === cat.id ? 'active' : ''}`}
          >
            <span
              className="actions-tab-indicator"
              style={{ backgroundColor: cat.color }}
            />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="actions-content-wrapper">
        {/* Background Image Layer */}
        <div
          key={`bg-${activeTab.id}`}
          className="actions-bg-image"
          style={{ backgroundImage: `url(${activeTab.bgImage})` }}
        />
        <div className="actions-bg-overlay" />

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`actions-tab-content ${activeTab.id === cat.id ? 'active' : ''} ${prevTab.id === cat.id && activeTab.id !== cat.id ? 'exiting' : ''}`}
          >
            {/* Content Header */}
            <div className="actions-content-header">
              <h3 className="actions-content-title">
                {cat.label} <span style={{ color: cat.color }}>Solutions</span>
              </h3>
              <button
                onClick={() => {
                  const routes: Record<string, string> = {
                    'team-building': '/work-showcase/TeamBuilding',
                    'training': '/work-showcase/TrainingProgram',
                    'corporate': '/work-showcase/CorporateEvent',
                    'csr': '/work-showcase/CSR'
                  };
                  window.location.href = routes[cat.id] || '/work-showcase';
                }}
                className="actions-learn-more-btn"
              >
                Learn More →
              </button>
            </div>

            {/* Subcategories Grid */}
            <div className="actions-subcategories-grid">
              {cat.subCategories.map((sub, index) => (
                <div
                  key={index}
                  className="actions-subcat-card"
                  style={{
                    '--card-color': cat.color,
                    '--icon-bg-light': `${cat.color}15`,
                    '--icon-bg-dark': `${cat.color}08`
                  } as React.CSSProperties}
                >
                  <div className="actions-subcat-icon" style={{ backgroundColor: cat.color }}>
                    <div className="lego-studs">
                      <span className="lego-stud"></span>
                      <span className="lego-stud"></span>
                      <span className="lego-stud"></span>
                      <span className="lego-stud"></span>
                    </div>
                  </div>
                  <h4 className="actions-subcat-title">{sub.title}</h4>
                  <div>
                    <span className="actions-subcat-prefix">{sub.prefix}</span>
                    <p className="actions-subcat-desc">{sub.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActionsSection;