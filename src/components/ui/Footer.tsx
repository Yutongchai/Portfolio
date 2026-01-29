import React from 'react';
import LogoImg from '../Logo.png'

const Footer = () => {
  const footerSections = [
    {
      title: "Company",
      links: ["Our Value", "Contact us"]
    },
    {
      title: "Services",
      links: [
        { label: "Team Building", path: "/work-showcase/team-building" },
        { label: "Training Program", path: "/work-showcase/training-program" },
        { label: "CSR", path: "/work-showcase/CSR" },
        { label: "Corporate Event", path: "/work-showcase/corporate-event" }
      ]
    },
    {
      title: "Certifications",
      links: []
    }
  ];

  return (
    <footer className="bg-[#153462] text-white font-light">
      {/* 1. Triple Border with Centered Logo */}
      <div className="relative pt-12 pb-8">
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          {/* Three distinct lines */}
          <div className="w-full border-t-[4px] border-[#f68921] mb-1"></div>
          <div className="w-full border-t-[4px] border-[#79989f] mb-1"></div>
          <div className="w-full border-t-[4px] border-[#18616e]"></div>
        </div>
        
        {/* Logo Container (overlaps lines) */}
        <div className="relative flex justify-center">
          <div className="bg-[#153462] px-6">
             {/* 2. Increased Logo Size */}
            <img src={LogoImg} alt="Logo" className="h-24 w-auto object-contain" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Left: Branding & Contact */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <img src={LogoImg} alt="EITO Group" className="h-20 w-fit mb-2" />
            <h2 className="tracking-[0.4em] text-xl font-normal uppercase">EITO Group</h2>
            <ul className="space-y-4 text-sm md:text-base opacity-80">
              <li>Email: info@eitogroup.com.my</li>
              <li>Phone: +6016-328 7947</li>
            </ul>
          </div>

          {/* Right: Dynamic Sections */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="tracking-[0.3em] text-lg font-bold uppercase mb-6 text-[#f68921]">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((linkObj) => {
                    const label = typeof linkObj === 'string' ? linkObj : linkObj.label;
                    const path = typeof linkObj === 'string' 
                      ? `#${linkObj.toLowerCase().replace(/\s/g, '-')}` 
                      : linkObj.path;

                    return (
                      <li key={label}>
                        <a href={path} className="text-white hover:text-[#79989f] transition-colors">
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                
                {section.title === 'Certifications' && (
                  <div className="mt-6 flex justify-start">
                    {/* 2. Scaled down HRD image to ensure Logo is bigger */}
                    <img 
                      src={import.meta.env.BASE_URL + "/HRD.png"} 
                      alt="HRD Certification" 
                      className="h-20 w-auto object-contain brightness-0 invert opacity-80" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center">
          <span className="tracking-[0.3em] text-[10px] md:text-xs uppercase opacity-50 text-center">
            © 2026 by EITO Group Team Building. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;