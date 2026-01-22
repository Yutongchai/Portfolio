import { Palette, Users, Lightbulb } from "lucide-react";
import Orb from "./Orb";

const OurRoleSection = () => {
  const roles = [
    {
      id: 1,
      icon: Palette,
      title: "Experience designers",
    },
    {
      id: 2,
      icon: Users,
      title: "Engagement facilitators",
    },
    {
      id: 3,
      icon: Lightbulb,
      title: "Culture enablers",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Role
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed mb-10">
            We partner with organisations as:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Logo in Orb */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              <Orb size={400} />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="EITO bw.png"
                  alt="EITO Logo"
                  className="w-48 h-48 sm:w-64 sm:h-64 object-contain opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className="flex items-center gap-4 bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border/30 hover:border-accent/50 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-xl text-foreground/90 font-medium">
                      {role.title}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border/20">
              <p className="text-xl text-foreground/90 leading-relaxed font-medium">
                Whether it's a growing team or a large organisation, our role is
                to help people work better — together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurRoleSection;
