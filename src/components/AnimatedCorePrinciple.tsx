import React, { useEffect, useRef, useState } from 'react';
import './AnimatedCorePrinciple.css';

const splitChars = (text: string) => {
  return text.split('').map((ch, i) => (
    <span
      key={i}
      className="char"
      style={{
        // CSS custom property used by animations
        ['--char-index' as any]: i,
      }}
    >
      {ch}
    </span>
  ));
};

const AnimatedCorePrinciple: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!ref.current || played) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('animate');
            setPlayed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [played]);

  return (
    <section ref={ref} className="animated-core">
      <div className="click">Click to clear (no replay)</div>
      <div className="course-clear">
        <div className="line">
          {splitChars('CORE')}
        </div>
        <div className="line">
          {splitChars('PRINCIPLES')}
        </div>
      </div>
    </section>
  );
};

export default AnimatedCorePrinciple;
