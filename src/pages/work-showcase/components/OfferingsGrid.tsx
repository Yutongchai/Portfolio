import React from 'react';

export interface Offering {
    id: string;
    icon: string | React.ReactNode;
    title: string;
    description: string;
}

interface OfferingsGridProps {
    offerings: Offering[];
    columns?: 2 | 3 | 4;
}

const OfferingsGrid: React.FC<OfferingsGridProps> = ({ offerings, columns = 3 }) => {
    const columnClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }[columns];

    return (
        <div className={`grid grid-cols-1 ${columnClass} gap-8`}>
            <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .offering-card {
          animation: slideInUp 0.6s ease-out;
          animation-fill-mode: both;
        }
        .offering-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .offering-card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .offering-card:nth-child(3) {
          animation-delay: 0.3s;
        }
        .offering-card:nth-child(4) {
          animation-delay: 0.4s;
        }
        .offering-card:nth-child(5) {
          animation-delay: 0.5s;
        }
        .offering-card:nth-child(6) {
          animation-delay: 0.6s;
        }
        .offering-icon {
          transition: transform 0.3s ease, color 0.3s ease;
          font-size: 3rem;
        }
        .offering-card:hover .offering-icon {
          transform: scale(1.15) rotate(5deg);
          color: #3b82f6;
        }
        .offering-card {
          transition: all 0.3s ease;
        }
        .offering-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
        }
      `}</style>

            {offerings.map((offering, index) => (
                <div
                    key={offering.id}
                    className="offering-card bg-white rounded-12 p-8 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="offering-icon">
                            {typeof offering.icon === 'string' ? offering.icon : offering.icon}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {offering.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {offering.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default OfferingsGrid;
