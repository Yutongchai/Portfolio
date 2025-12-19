import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Icon } from '@iconify/react';
import { CoreValue } from '../types';

interface CoreValuesSectionProps {
  values: CoreValue[];
}

const CoreValuesSection = ({ values }: CoreValuesSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['100px', '-100px']);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Energetic gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }} />
      </div>

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
          <h2 className="text-5xl lg:text-6xl font-bold text-gradient mb-4">
            Core Values
          </h2>
          <p className="text-xl text-muted-foreground">
            What drives my work
          </p>
        </motion.div>

        {/* Values Grid with Stagger Animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values?.map((value, index) => {
            const gradients = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-green-500 to-emerald-500',
              'from-amber-500 to-orange-500'
            ];
            return (
              <motion.div
                key={value?.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % 4]} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-butter`} />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg card-energetic">
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradients[index % 4]} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon
                        icon={value?.icon || 'mdi:sparkles'}
                        className="w-7 h-7 text-white"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {value?.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {value?.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default CoreValuesSection;
