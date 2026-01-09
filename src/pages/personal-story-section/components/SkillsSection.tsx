import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Skill } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['50px', '-50px']);

  const groupedSkills = skills?.reduce((acc, skill) => {
    const category = skill?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-white">
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-16"
        style={{ y }}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl handwritten text-primary">
            Crafted through experience
          </p>
        </motion.div>

        {/* Skills by Category */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          {Object.entries(groupedSkills || {}).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              className="bg-background rounded-lg sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg sm:shadow-xl"
              initial={{ opacity: 0, x: catIndex % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: catIndex * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">{category}</h3>
              <div className="space-y-4 sm:space-y-6">
                {categorySkills?.map((skill, index) => (
                  <motion.div
                    key={skill?.id}
                    className="space-y-2 sm:space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.05,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-base sm:text-lg font-semibold text-foreground">
                        {skill?.name}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-primary flex-shrink-0">
                        {skill?.level}%
                      </span>
                    </div>
                    <div className="h-2 sm:h-3 bg-secondary/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill?.level}%` }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 1, 
                          delay: index * 0.05 + 0.2,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;