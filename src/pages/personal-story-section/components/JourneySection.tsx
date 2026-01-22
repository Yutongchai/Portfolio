import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Journey } from "../types";

interface JourneySectionProps {
  journeys: Journey[];
}

const JourneySection = ({ journeys }: JourneySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const progressWidth = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    ["0%", "100%"]
  );

  // Helper function to safely get icon component
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Icons.Star;

    // Convert to PascalCase if needed (e.g., "code-2" -> "Code2")
    const formattedName = iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    // Check if icon exists in Icons
    const IconComponent =
      (Icons as any)[formattedName] || (Icons as any)[iconName];

    return IconComponent || Icons.Star;
  };

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16"
        style={{ y }}
      >
        {/* Collapsible Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group relative inline-flex flex-col items-center gap-4 cursor-pointer"
          >
            {/* Title with hover effect */}
            <div className="relative">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-[#12a28f] via-[#fcb22f] to-[#ee424c] bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Our Journey
              </motion.h2>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#12a28f] via-[#fcb22f] to-[#ee424c] rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>

            <p className="text-lg text-white/70 group-hover:text-white/90 transition-colors">
              A timeline of growth
            </p>

            {/* Premium Toggle Button */}
            <motion.div
              className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{isExpanded ? "Hide Timeline" : "Explore Timeline"}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </button>
        </motion.div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Timeline */}
              <div className="relative mt-12">
                {/* Progress Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 -translate-x-1/2 hidden lg:block">
                  <motion.div
                    className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#12a28f] via-[#fcb22f] to-[#ee424c]"
                    style={{ height: progressWidth }}
                  />
                </div>

                {/* Journey Items */}
                <div className="space-y-16">
                  {journeys?.map((journey, index) => {
                    const IconComponent = getIconComponent(journey?.icon);

                    return (
                      <motion.div
                        key={journey?.id}
                        className={`relative grid lg:grid-cols-2 gap-8 items-center ${
                          index % 2 === 0 ? "" : "lg:grid-flow-dense"
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.1,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-2xl z-10"
                          style={{
                            background: `linear-gradient(135deg, ${['#12a28f', '#fcb22f', '#0074b4', '#ee424c'][index % 4]} 0%, ${['#0074b4', '#12a28f', '#ee424c', '#fcb22f'][index % 4]} 100%)`
                          }}
                        >
                          {IconComponent && (
                            <IconComponent className="w-7 h-7 text-white" />
                          )}
                        </div>

                        {/* Content Card */}
                        <div
                          className={
                            index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-2"
                          }
                        >
                          <motion.div
                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                            whileHover={{ scale: 1.03, y: -5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <span 
                                className="text-4xl font-black"
                                style={{ 
                                  color: ['#12a28f', '#fcb22f', '#0074b4', '#ee424c'][index % 4],
                                  textShadow: `0 0 20px ${['#12a28f', '#fcb22f', '#0074b4', '#ee424c'][index % 4]}80`
                                }}
                              >
                                {journey?.year}
                              </span>
                              <div 
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center lg:hidden"
                                style={{ backgroundColor: `${['#12a28f', '#fcb22f', '#0074b4', '#ee424c'][index % 4]}20` }}
                              >
                                {IconComponent && (
                                  <IconComponent className="w-6 h-6" style={{ color: ['#12a28f', '#fcb22f', '#0074b4', '#ee424c'][index % 4] }} />
                                )}
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                              {journey?.title}
                            </h3>
                            <p className="text-white/70 leading-relaxed">
                              {journey?.description}
                            </p>
                          </motion.div>
                        </div>

                        {/* Empty column for spacing */}
                        <div
                          className={
                            index % 2 === 0 ? "lg:col-start-2" : "lg:col-start-1"
                          }
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default JourneySection;
