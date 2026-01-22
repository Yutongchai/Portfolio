import { Palette, Users, Lightbulb } from "lucide-react";

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Role
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed mb-10">
            We partner with organisations as:
          </p>
        </div>

        <div className="space-y-6 mb-12">
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

        <p className="text-lg text-foreground/80 leading-relaxed text-center">
          Whether it's a growing team or a large organisation, our role is to help people work better — together.
        </p>
      </div>
    </section>
  );
};

export default OurRoleSection;
