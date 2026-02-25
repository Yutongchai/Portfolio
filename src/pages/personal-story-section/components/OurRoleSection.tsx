import { Users, Briefcase, GraduationCap, HeartHandshake, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import "./OurRoleSection.css";

const OurRoleSection = () => {
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);

  const handleFlip = (idx: number) => {
    setFlippedIdx(prev => (prev === idx ? null : idx));
  };

  const cards = [
    {
      label: 'Team Building',
      icon: Users,
      color: '#38bdf8',
      image: import.meta.env.BASE_URL + "TB.webp",
      description: 'Transform your workplace culture through high-energy activities that break silos and build lasting trust.',
      link: '/services/team-building',
    },
    {
      label: 'Corporate Event',
      icon: Briefcase,
      color: '#fcb22f',
      image: import.meta.env.BASE_URL + "CE.webp",
      description: 'From gala dinners to product launches, we provide end-to-end execution that ensures your message resonates.',
      link: '/services/corporate-event',
    },
    {
      label: 'Training Program',
      icon: GraduationCap,
      color: '#00ccbc',
      image: import.meta.env.BASE_URL + "GT.webp",
      description: 'Upskill your workforce with modules focusing on leadership, emotional intelligence, and excellence.',
      link: '/services/training-program',
    },
    {
      label: 'CSR',
      icon: HeartHandshake,
      color: '#ee424c',
      image: import.meta.env.BASE_URL + "csr.webp",
      description: 'Bridge the gap between corporate goals and social needs with initiatives that leave a measurable impact.',
      link: '/services/csr',
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#fdfdfb]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="h-1 w-12 bg-[#fcb22f] mb-4" />
          <h2 className="text-4xl md:text-5xl font-black text-[#23242b] tracking-tight">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => {
            const isFlipped = flippedIdx === idx;
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="our-role-flip-card-container"
                onClick={() => handleFlip(idx)}
              >
                {/* The flip effect remains here via the 'flipped' class */}
                <div className={`our-role-flip-card ${isFlipped ? 'flipped' : ''}`}>

                  {/* --- FRONT SIDE --- */}
                  <div
                    className="our-role-card-front"
                    style={{ backgroundImage: `url(${card.image})` }}
                  >
                    <div className="front-overlay" />
                    <div className="front-content">
                      <div className="icon-pill" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                        <Icon size={20} />
                      </div>
                      <span className="front-label">{card.label}</span>
                    </div>
                  </div>

                  {/* --- BACK SIDE --- */}
                  <div className="our-role-card-back" style={{ backgroundColor: card.color }}>
                    <div className="back-glass-layer" />
                    <div className="back-content">
                      <Icon size={40} strokeWidth={1.5} className="mb-6 opacity-80" />
                      <h3 className="text-xl font-extrabold mb-4 uppercase tracking-widest">{card.label}</h3>
                      <p className="text-sm leading-relaxed mb-8 opacity-90 font-medium">
                        {card.description}
                      </p>

                      <a href={card.link} className="view-details-btn">
                        <span>Learn More</span>
                        <div className="circle-arrow">
                          <ArrowUpRight size={18} />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurRoleSection;