import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SectionWrapper = ({ children, className = '', delay = 0 }: SectionWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // once: true — section animates in once and stays visible. once:false caused
  // sections to go blank when scrolled out of the -100px margin, then need
  // 800ms to fade back in — that was the main source of perceived lag.
  const isInView = useInView(ref, { once: true, margin: '150px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;