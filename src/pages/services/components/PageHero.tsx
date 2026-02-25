import React from 'react';

interface PageHeroProps {
  title: string;
  description: string;
  showGradient?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  showGradient = true
}) => {
  return (
    <section className="relative min-h-[85vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-black text-white">      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-title {
          animation: slideInDown 0.8s ease-out;
        }
        .hero-description {
          animation: slideInUp 0.8s ease-out 0.2s both;
        }
      `}</style>

      {showGradient && (
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center max-w-2xl hero-title">
        {title}
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-xl hero-description">
        {description}
      </p>
    </section>
  );
};

export default PageHero;
