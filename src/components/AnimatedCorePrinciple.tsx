import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('animate');
    }
  }, []);

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
