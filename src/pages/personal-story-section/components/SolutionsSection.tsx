import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const SolutionsSection = () => {
  const solutions = [
    {
      id: 1,
      emoji: "🔥",
      title: "Move as One",
      description:
        "High-energy, physical, action-driven team challenges",
    },
    {
      id: 2,
      emoji: "🧠",
      title: "Common Ground",
      description:
        "Interactive games designed for learning, alignment, and culture building",
    },
    {
      id: 3,
      emoji: "🌱",
      title: "Purpose in Action (CSR)",
      description:
        "Purpose-driven, hands-on CSR programmes that turn teamwork into action and values into tangible impact.",
    },
  ];

  const [selectedId, setSelectedId] = useState(1);
  const selectedSolution = solutions.find(s => s.id === selectedId) || solutions[0];

  // Calculate positions for 3 items in a circle
  const getPosition = (index: number) => {
    const angle = (index * 120 - 90) * (Math.PI / 180); // Start from top, 120° apart
    const radius = 100; // radius matches the container (200px / 2 = 100px)
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Solutions
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            At EITO Group, through its people-focused brand, we design purposeful experiences that strengthen teams, leaders, and workplace culture.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
          {/* Circular Ring with Emoji Dots */}
          <div className="relative w-[200px] h-[200px] flex-shrink-0">
            {/* Ring Border */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
            
            {/* Emoji Dots positioned around the ring */}
            {solutions.map((solution, index) => {
              const pos = getPosition(index);
              const isSelected = solution.id === selectedId;
              
              return (
                <motion.button
                  key={solution.id}
                  onClick={() => setSelectedId(solution.id)}
                  className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-primary shadow-xl z-10' 
                      : 'bg-card border-2 border-border hover:border-accent'
                  }`}
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: `${pos.x - 40}px`,
                    marginTop: `${pos.y - 40}px`,
                  }}
                  whileHover={{ scale: isSelected ? 1.15 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {solution.emoji}
                </motion.button>
              );
            })}

            {/* Center decoration */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
          </div>

          {/* Solution Details */}
          <motion.div 
            className="flex-1 max-w-xl"
            initial={{ x: -100 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{selectedSolution.emoji}</div>
                  <h3 className="text-3xl font-bold text-primary">
                    {selectedSolution.title}
                  </h3>
                </div>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  {selectedSolution.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.p 
          className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto italic"
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Our programmes are not one-off events —
          <br />
          They are structured experiences designed to create real connection and lasting impact.
        </motion.p>
      </div>
    </section>
  );
};

export default SolutionsSection;
