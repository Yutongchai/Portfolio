import React from 'react';
import Icon from '../AppIcon';
import LogoImg from '../Logo.png';

const Footer = () => {
  // 1. Data arrays make the code cleaner and easier to maintain
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
        { label: "CSR", path: "/work-showcase/csr" },
        { label: "Corporate Event", path: "/work-showcase/corporate-event" }
      ]
    },
    {
      title: "Certifications",
      links: []
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-[#fcb22f] text-[#222] font-light">
      {/* Top Border with Centered Logo */}
      <div className="relative flex items-center justify-center py-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-[#fcb22f] px-4">
          <img src={LogoImg} alt="Logo" className="h-16 w-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Left: Branding & Contact */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <img src={LogoImg} alt="EITO Group" className="h-20 w-fit mb-2" />
            <h2 className="tracking-[0.4em] text-xl font-normal uppercase">EITO Group</h2>
            <div className="space-y-1 text-sm md:text-base opacity-80">
              <p>Email: info@eitogroup.com.my</p>
              <p>Phone: +6016-328 7947</p>
            </div>
          </div>

          {/* Right: Dynamic Sections */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="tracking-[0.3em] text-lg font-normal uppercase mb-6 ">{section.title}</h3>
                <ul className="space-y-4">
                  {section.title === 'Services'
                    ? section.links.map((linkObj: any) => (
                        <li key={linkObj.label}>
                          <a href={linkObj.path} className="text-black hover:opacity-60 transition-opacity">
                            {linkObj.label}
                          </a>
                        </li>
                      ))
                    : section.links.map((link: string) => (
                        <li key={link}>
                          <a href={`#${link.toLowerCase().replace(/\s/g, '-')}`} className="text-black hover:opacity-60 transition-opacity">
                            {link}
                          </a>
                        </li>
                      ))}
                </ul>
                {/* If Certifications section, show HRD.png below */}
                {section.title === 'Certifications' && (
                  <div className="mt-6 flex justify-center">
                    <img src="/HRD.png" alt="HRD Certification" className="h-40 w-auto object-contain" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Section */}
        <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-center gap-6">
          <span className="tracking-[0.3em] text-sm uppercase">© 2026 by EITO Group Team Building. All rights reserved.</span>
          <div className="flex gap-10">
           {/*  {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="flex items-center gap-3 group transition-transform hover:scale-105"
              >
                <Icon name={social.icon} size={24} color="#e5a544" />
                <span className="font-medium">{social.name}</span>
              </a>
            ))} */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;