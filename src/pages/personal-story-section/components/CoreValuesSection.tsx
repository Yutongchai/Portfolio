import React from 'react';
import { CoreValue } from '../types';

interface CoreValuesSectionProps {
  values: CoreValue[];
}

const CoreValuesSection = ({ values }: CoreValuesSectionProps) => {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Values Grid - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {values?.map((value) => {
            return (
              <div
                key={value?.id}
                className="group relative"
              >
                <div className="relative bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:border-accent/50 transition-colors duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-3">
                      {value?.emoji}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {value?.title}
                    </h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      {value?.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
