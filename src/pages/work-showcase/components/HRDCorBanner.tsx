import React, { useEffect } from 'react';
import HRDLogo from '../../../assets/hrd.png';
import HRDProviderBadge from '../../../assets/hrd_training_provider.png';

const HRDCorSection: React.FC = () => {
  useEffect(() => {
    const preloadLinks = [HRDLogo, HRDProviderBadge].map((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  return (
    <section className="bg-white border-y border-gray-100 py-20 px-8">
      <style>{`
                @keyframes float {
                  0%, 100% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(-12px);
                  }
                }
                @keyframes glow {
                  0%, 100% {
                    filter: drop-shadow(0 0 20px rgba(21, 52, 98, 0.2));
                  }
                  50% {
                    filter: drop-shadow(0 0 30px rgba(252, 178, 47, 0.3));
                  }
                }
                @keyframes slideInTitleSubtle {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .hrdc-logo {
                  animation: float 4s ease-in-out infinite;
                  filter: drop-shadow(0 0 20px rgba(21, 52, 98, 0.15));
                  transition: all 0.3s ease;
                }
                .hrdc-logo:hover {
                  animation: glow 0.6s ease-in-out;
                  transform: scale(1.08);
                }
                .hrdc-provider-badge {
                  animation: float 4.5s ease-in-out infinite;
                  filter: drop-shadow(0 0 20px rgba(246, 137, 33, 0.15));
                  transition: all 0.3s ease;
                }
                .hrdc-provider-badge:hover {
                  animation: glow 0.6s ease-in-out;
                  transform: scale(1.08);
                }
                .hrdc-title {
                  animation: slideInTitleSubtle 0.8s ease-out 0.2s both;
                }
            `}</style>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-16 text-center md:text-left">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          <p className="text-[#fcb22f] font-bold tracking-[0.3em] uppercase mb-3 text-sm">
            Official Recognition
          </p>
          <h3 className="text-4xl md:text-5xl font-black mb-6 text-[#153462] hrdc-title">
            HRD Corp<br />Claimable Program
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
            Maximize your HRD Corp levy with our approved training programmes. We handle all documentation and claims, ensuring 100% compliance and hassle-free funding for your team's development.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-[#12a28f] font-black text-xl">✓</span>
              <p className="text-gray-700 font-bold">National Standards</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#12a28f] font-black text-xl">✓</span>
              <p className="text-gray-700 font-bold">Hassle-Free Docs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#12a28f] font-black text-xl">✓</span>
              <p className="text-gray-700 font-bold">Levy Fundable</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#12a28f] font-black text-xl">✓</span>
              <p className="text-gray-700 font-bold">Expert Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT BADGES */}
        <div className="flex-1 flex items-center justify-center gap-12">
          <div className="flex flex-col items-center">
            <img
              src={HRDLogo}
              alt="HRD Corp Logo"
              width={240}
              height={240}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="h-60 object-contain hrdc-logo"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src={HRDProviderBadge}
              alt="HRD Corp Training Provider"
              width={240}
              height={240}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="h-60 object-contain hrdc-provider-badge"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRDCorSection;
