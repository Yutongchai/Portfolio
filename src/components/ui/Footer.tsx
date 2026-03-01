import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '/beige2.webp';
import HRDImg from '../../assets/hrd_training_provider.webp';

const COLORS = {
  NAVY: '#153462',
  GOLD: '#fcb22f',
  ORANGE: '#f68921',
  TEAL: '#79989f',
  TEAL_DARK: '#18616e',
};

type MobileSectionProps = {
  title: string;
  children: React.ReactNode;
  accentBg?: string;
  accentText?: string;
};

const MobileSection: React.FC<MobileSectionProps> = ({ title, children, accentBg, accentText }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      {/* Desktop: show heading + content */}
      <div className="hidden sm:block">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#153462]">{title}</h3>
        {children}
      </div>

      {/* Mobile: accordion */}
      <div className="sm:hidden w-full">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center justify-between py-3 px-4 box-border"
          style={{ background: accentBg ?? 'transparent', color: accentText ?? undefined }}
        >
          <span className="text-sm font-black uppercase tracking-[0.2em] text-left break-words whitespace-normal">{title}</span>
          <span className="text-2xl ml-4">{open ? '−' : '+'}</span>
        </button>

        <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[1000px] mt-3' : 'max-h-0'}`}>
          <div className="px-4 w-full box-border break-words whitespace-normal">
            {/* Ensure descendant links and text wrap to avoid horizontal overflow on small screens */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-40 w-full bg-white pt-20 pb-10">
      {/* Decorative Brand Strips - Positioned at the very top of footer */}
      <div className="absolute top-0 left-0 w-full flex flex-col pointer-events-none z-50">
        {/* Wrap them in a flex container with a defined height to ensure equal scaling */}
        <div className="w-full flex flex-col">
          <div className="w-full h-[8px] block" style={{ backgroundColor: COLORS.NAVY }} />
          <div className="w-full h-[7px] block" style={{ backgroundColor: COLORS.ORANGE }} />
          <div className="w-full h-[7px] block" style={{ backgroundColor: COLORS.TEAL }} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">

        {/* CUSTOMER REQUEST: Logo on Top */}
        <div className="group mb-8 cursor-pointer transition-transform duration-500 hover:scale-110">
          <Link to="/">
            <div className="bg-[#FFFFF0] rounded-2xl border-4 border-[#153462] shadow-[6px_6px_0px_0px_#153462] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
              <img
                src={LogoImg}
                alt="EITO Logo"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={300}
                height={72}
                className="h-18 w-auto object-contain group-hover:rotate-12 transition-transform"
              />
            </div>
          </Link>
        </div>

        {/* CUSTOMER REQUEST: Tagline Under Logo */}
        <div className="text-center mb-16 max-w-2xl">
          <h2 className="text-[#153462] text-2xl md:text-4xl font-black uppercase tracking-tighter leading-tight">
            We <span className="text-[#f68921]">design</span> experiences that bring teams together
          </h2>
          {/* Signature Underline - three equal strips */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-12 h-2 bg-[#fcb22f] rounded-full shadow-[2px_2px_0px_0px_#153462]" />
            <div className="w-12 h-2 bg-[#12a28f] rounded-full shadow-[2px_2px_0px_0px_#153462]" />
            <div className="w-12 h-2 bg-[#153462] rounded-full shadow-[2px_2px_0px_0px_#153462]" />
          </div>
        </div>

        {/* Navigation Grid - Mobile: stacked rows, Desktop: 4 columns */}
        <div className="w-full flex flex-col md:grid md:grid-cols-4 gap-6 py-8 md:py-10 border-t-4 border-[#153462]">

          {/* Row 1 Mobile / Column 1 Desktop: Company (accordion on mobile) */}
          <div className="flex flex-col items-center sm:items-start w-full">
            <MobileSection title="Company">
              <nav className="flex flex-col gap-3 text-center sm:text-left">
                <Link to="/personal-story-section#beliefs-values" className="font-bold text-[#153462] hover:text-[#f68921] transition-colors">Our Values</Link>
                <Link to="/connection-hub#contact-methods" className="font-bold text-[#153462] hover:text-[#f68921] transition-colors">Contact Us</Link>
                <a href="mailto:info@eitogroup.com.my" className="text-sm font-bold text-[#153462]/60 hover:text-[#153462] flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-2 h-2 bg-[#12a28f] rounded-full" /> info@eitogroup.com.my
                </a>
              </nav>
            </MobileSection>
          </div>

          {/* Row 2 Mobile / Column 2 Desktop: Services (accordion on mobile) */}
          <div className="flex flex-col items-center sm:items-start w-full">
            <MobileSection title="Services" accentText="#153462">
              <nav className="flex flex-col gap-3 text-center sm:text-left text-[#153462] font-bold">
                <Link to="/services/team-building" className="hover:underline decoration-[#fcb22f] decoration-4 underline-offset-4">Team Building</Link>
                <Link to="/services/training-program" className="hover:underline decoration-[#f68921] decoration-4 underline-offset-4">Training Program</Link>
                <Link to="/services/corporate-event" className="hover:underline decoration-[#695da5] decoration-4 underline-offset-4">Corporate Event</Link>
                <Link to="/services/csr" className="hover:underline decoration-[#ee424c] decoration-4 underline-offset-4">CSR</Link>
              </nav>
            </MobileSection>
          </div>

          {/* Row 3 Mobile: Icons centered horizontally - Hidden on Desktop */}
          <div className="w-full flex justify-center items-center gap-6 md:hidden mt-6">
            <img
              src={HRDImg}
              alt="HRD Certification"
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
              className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition-all cursor-crosshair"
            />

            <a
              href="https://www.instagram.com/eitogroup/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="hover:scale-110 transition-transform"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#153462" strokeWidth="1.5" fill="#f68921" />
                <circle cx="12" cy="12" r="3.2" fill="#153462" />
                <circle cx="17.3" cy="6.7" r="0.9" fill="#153462" />
              </svg>
            </a>
            
            <a
              href={'https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D'}
              target="_blank"
              rel="noopener noreferrer"
              title="Google Reviews"
              className="hover:scale-110 transition-transform"
            >
              <span className="sr-only">Google</span>
              <svg className="w-16 h-16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" />
                <path d="M12 11.5v2.9h3.9c-.2 1.3-1.5 3.8-3.9 3.8-2.3 0-4.3-1.9-4.3-4.3s2-4.3 4.3-4.3c1.3 0 2.1.5 2.6.9l1.8-1.7C15.9 7.2 14.2 6.4 12 6.4 7.9 6.4 4.6 9.6 4.6 13.6S7.9 20.8 12 20.8c5 0 8.2-3.5 8.2-8.4 0-.6-.1-1.1-.2-1.6H12z" fill="#153462" />
              </svg>
            </a>
          </div>

          {/* Desktop only: Column 3 - Appreciations */}
          <div className="hidden md:flex flex-col items-center sm:items-start w-full">
            <div className="flex justify-center sm:justify-start">
              <img
                src={HRDImg}
                alt="HRD Certification"
                loading="lazy"
                decoding="async"
                width={64}
                height={64}
                className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition-all cursor-crosshair"
              />
            </div>
          </div>

          {/* Desktop only: Column 4 - Socials */}
          <div className="hidden md:flex flex-col items-center sm:items-start w-full">
            <div className="flex gap-4 justify-center sm:justify-start">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/eitogroup/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:scale-110 transition-transform"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="#153462" strokeWidth="1.5" fill="#f68921" />
                  <circle cx="12" cy="12" r="3.2" fill="#153462" />
                  <circle cx="17.3" cy="6.7" r="0.9" fill="#153462" />
                </svg>
              </a>

              {/* Google / Reviews (links to Google search for EITO Group) */}
              <a
                href={'https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D'}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Reviews"
                className="hover:scale-110 transition-transform"
              >
                <span className="sr-only">Google</span>
                <svg className="w-16 h-16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="white" />
                  <path d="M12 11.5v2.9h3.9c-.2 1.3-1.5 3.8-3.9 3.8-2.3 0-4.3-1.9-4.3-4.3s2-4.3 4.3-4.3c1.3 0 2.1.5 2.6.9l1.8-1.7C15.9 7.2 14.2 6.4 12 6.4 7.9 6.4 4.6 9.6 4.6 13.6S7.9 20.8 12 20.8c5 0 8.2-3.5 8.2-8.4 0-.6-.1-1.1-.2-1.6H12z" fill="#153462" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="w-full mt-10 pt-8 border-t-2 border-[#153462]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#153462]/40">
            © 2026 EITO Group • Empowering Teams through Play
          </p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest text-[#153462]/40 hover:text-[#153462] transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-[10px] font-black uppercase tracking-widest text-[#153462]/40 hover:text-[#153462] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;