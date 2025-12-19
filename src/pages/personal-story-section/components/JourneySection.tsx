import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import { Journey } from "../types";

interface JourneySectionProps {
  journeys: Journey[];
}

const JourneySection = ({ journeys }: JourneySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
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
      className="relative py-32 overflow-hidden color-block-secondary"
    >
      {/* Colored background */}
      <div className="absolute inset-0 bg-secondary" />

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
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            My Journey
          </h2>
          <p className="text-2xl handwritten text-white/90">
            A timeline of growth
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 -translate-x-1/2 hidden lg:block">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-primary"
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center w-16 h-16 bg-primary rounded-full border-4 border-white shadow-xl z-10">
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
                      className="bg-white rounded-3xl p-8 shadow-xl card-hover"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl font-bold text-primary">
                          {journey?.year}
                        </span>
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center lg:hidden">
                          {IconComponent && (
                            <IconComponent className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {journey?.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
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
    </section>
  );
};

export default JourneySection;
