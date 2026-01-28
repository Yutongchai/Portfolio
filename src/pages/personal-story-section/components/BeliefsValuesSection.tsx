const BeliefsValuesSection = () => {
  const beliefs = [
    {
      title: "Engagement Through Experience",
      description:
        "We believe engagement is created through meaningful experiences, not just policies.",
    },
    {
      title: "Learning by Living",
      description: "Learning is most effective when it's lived, not lectured.",
    },
    {
      title: "Valued Teams Perform",
      description:
        "Teams perform better when every member feels seen, heard, and valued.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Beliefs & Values
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed mb-8">
            Strong organisations are not built by structure alone —
            <br />
            They are built by people who connect, communicate, and grow
            together.
          </p>
        </div>

        {/* Belief Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon removed: no icon property in beliefs */}

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {belief.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-foreground/70 leading-relaxed">
                  {belief.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
        {/* Simple Statement Section (inspired by image) */}
        <div className="my-16 flex justify-center">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              That belief is the <span style={{ color: '#fcb22f' }}>foundation</span><br />
              <span className="text-foreground">of everything we do.</span>
            </p>
          </div>
        </div>

        {/* EITO Values Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <p className="text-lg text-foreground/70">
              Like our name, we build the fundamentals that make teams work
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* E - Equilibrium */}
            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-border hover:border-[#12a28f] transition-all duration-300 hover:shadow-lg group">
              <div
                className="text-7xl font-black mb-4 animate-float"
                style={{
                  background:
                    "linear-gradient(135deg, #12a28f 0%, #0e8170 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 12px rgba(18, 162, 143, 0.3)",
                  filter: "drop-shadow(0 2px 8px rgba(18, 162, 143, 0.4))",
                }}
              >
                E
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Equilibrium
              </h4>
              <p className="text-sm text-foreground/70">
                Creating balance between fun and impact
              </p>
            </div>

            {/* I - Integrity */}
            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-border hover:border-[#fcb22f] transition-all duration-300 hover:shadow-lg group">
              <div
                className="text-7xl font-black mb-4 animate-float"
                style={{
                  background:
                    "linear-gradient(135deg, #fcb22f 0%, #e09a1a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 12px rgba(252, 178, 47, 0.3)",
                  filter: "drop-shadow(0 2px 8px rgba(252, 178, 47, 0.4))",
                }}
              >
                I
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Integrity
              </h4>
              <p className="text-sm text-foreground/70">
                Doing what we say, always
              </p>
            </div>

            {/* T - Teamwork */}
            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-border hover:border-[#0074b4] transition-all duration-300 hover:shadow-lg group">
              <div
                className="text-7xl font-black mb-4 animate-float"
                style={{
                  background:
                    "linear-gradient(135deg, #0074b4 0%, #005a8d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 12px rgba(0, 116, 180, 0.3)",
                  filter: "drop-shadow(0 2px 8px rgba(0, 116, 180, 0.4))",
                }}
              >
                T
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Teamwork
              </h4>
              <p className="text-sm text-foreground/70">
                Collaboration over competition
              </p>
            </div>

            {/* O - Honour */}
            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-border hover:border-[#ee424c] transition-all duration-300 hover:shadow-lg group">
              <div
                className="text-7xl font-black mb-4 animate-float"
                style={{
                  background:
                    "linear-gradient(135deg, #ee424c 0%, #c9343d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 12px rgba(238, 66, 76, 0.3)",
                  filter: "drop-shadow(0 2px 8px rgba(238, 66, 76, 0.4))",
                }}
              >
                O
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Honour
              </h4>
              <p className="text-sm text-foreground/70">
                Respecting people and their potential
              </p>
            </div>
          </div>
        </div>

        {/* Add floating animation styles */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
};

export default BeliefsValuesSection;
