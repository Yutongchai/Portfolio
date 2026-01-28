import { Users, Briefcase, GraduationCap, HeartHandshake } from "lucide-react";
import Orb from "./Orb";

import { useState } from "react";
import "./OurRoleSection.css";

const OurRoleSection = () => {

  // Track which card is flipped; null means none flipped
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);
  const handleFlip = (idx: number) => {
    setFlippedIdx(prev => (prev === idx ? null : idx));
  };

  // Card data
  const cards = [
    {
      label: 'Team Building',
      icon: Users,
      color: '#38bdf8',
      image: '/TB.jpg',
      description: 'Boost collaboration, trust, and morale with our engaging team building experiences designed for all group sizes.',
      link: '/work-showcase/team-building',
    },
    {
      label: 'Corporate Event',
      icon: Briefcase,
      color: '#fcb22f',
      image: '/CE.jpg',
      description: 'Make your next corporate event memorable and seamless with our expert planning and execution services.',
      link: '/work-showcase/corporate-event',
    },
    {
      label: 'Training Program',
      icon: GraduationCap,
      color: '#00ccbc',
      image: '/GT.jpg',
      description: 'Empower your team with tailored training programs that drive professional growth and organizational success.',
      link: '/work-showcase/training-program',
    },
    {
      label: 'CSR',
      icon: HeartHandshake,
      color: '#ee424c',
      image: '/csr.jpg',
      description: 'Create positive impact through meaningful CSR initiatives that align with your company values.',
      link: '/work-showcase/csr',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Services
          </h2>
        </div>

        {/* Four selectable cards for services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {cards.map((card, idx) => {
            const isFlipped = flippedIdx === idx;
            return (
              <div
                key={card.label}
                className="our-role-flip-card-container"
                tabIndex={0}
                onClick={() => handleFlip(idx)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFlip(idx)}
                aria-pressed={isFlipped}
                role="button"
                style={{ outline: 'none' }}
              >
                <div className={`our-role-flip-card${isFlipped ? ' flipped' : ''}`}> 
                  {/* Front: full background image */}
                  <div
                    className="our-role-card-front"
                    style={{
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      color: 'white',
                      position: 'relative',
                    }}
                  >
                    <span
                      className="our-role-label"
                      style={{
                        position: 'absolute',
                        bottom: '1.5rem',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: '12px',
                        padding: '0.5rem 1rem',
                        margin: '0 1rem',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        letterSpacing: '1px',
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                  {/* Back: description and Learn More button */}
                  <div className="our-role-card-back" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center', color: '#fff' }}>{card.description}</span>
                    <a
                      href={card.link}
                      className="mt-4 px-6 py-2 rounded-full font-semibold text-white"
                      style={{
                        background: card.color,
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                        marginTop: '1.5rem',
                        display: 'inline-block',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    >
                      Learn More
                    </a>
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
