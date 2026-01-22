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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
            Our Solutions
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            At EITO Group, through its people-focused brand, we design purposeful experiences that strengthen teams, leaders, and workplace culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {solutions.map((solution) => {
            return (
              <div
                key={solution.id}
                className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-accent/50 transition-colors duration-300 hover:shadow-xl"
              >
                <div className="text-5xl mb-6">{solution.emoji}</div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {solution.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto italic">
          Our programmes are not one-off events —
          <br />
          They are structured experiences designed to create real connection and lasting impact.
        </p>
      </div>
    </section>
  );
};

export default SolutionsSection;
