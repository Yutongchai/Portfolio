import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useRef } from 'react';
import { Philosophy } from '../types';

interface PhilosophySectionProps {
  philosophies: Philosophy[];
}

const PhilosophySection = ({ philosophies }: PhilosophySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['100px', '-100px']);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-white">
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16"
        style={{ y }}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Philosophy & Inspiration
          </h2>
          <p className="text-2xl handwritten text-primary">
            Words that guide me
          </p>
        </motion.div>

        {/* Philosophies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {philosophies?.map((philosophy, index) => (
            <motion.div
              key={philosophy?.id}
              className="relative bg-background rounded-3xl p-8 shadow-lg card-hover overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
              
              <div className="relative">
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Quote */}
                <blockquote className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                  "{philosophy?.quote}"
                </blockquote>

                {/* Author */}
                <p className="text-lg handwritten text-primary mb-4">
                  — {philosophy?.author}
                </p>

                {/* Context */}
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {philosophy?.context}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.button
            className="px-10 py-5 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/90 transition-smooth shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PhilosophySection;