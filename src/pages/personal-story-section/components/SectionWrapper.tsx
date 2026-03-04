import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SectionWrapper = ({ children, className = '', delay = 0 }: SectionWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;