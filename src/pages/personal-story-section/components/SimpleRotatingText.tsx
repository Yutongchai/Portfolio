/**
 * SimpleRotatingText — pure CSS transitions, zero framer-motion.
 * Replaces the heavy RotatingText (framer-motion AnimatePresence + Intl.Segmenter)
 * which caused forced reflows by reading offsetWidth on every animation frame.
 */
import { useState, useEffect } from 'react';

interface SimpleRotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SimpleRotatingText = ({
  texts,
  interval = 2000,
  className,
  style,
}: SimpleRotatingTextProps) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      // Fade out
      setVisible(false);
      // After fade-out duration (300ms), swap word and fade back in
      setTimeout(() => {
        setIdx(i => (i + 1) % texts.length);
        setVisible(true);
      }, 300);
    }, interval);
    return () => clearInterval(cycle);
  }, [texts.length, interval]);

  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-0.4em)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      aria-label={texts.join(', ')}
    >
      {texts[idx]}
    </span>
  );
};

export default SimpleRotatingText;
