import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '/beige2.png'
import HRDImg from '../../assets/hrd.png'

const Footer = () => {
  return (
    <footer className="bg-[#1e4a6b] text-white font-light">
      {/* Triple Border with Centered Logo */}
      <div className="relative pt-12 pb-8">
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          {/* Three distinct lines */}
          <div className="w-full border-t-[4px] border-[#f68921] mb-1"></div>
          <div className="w-full border-t-[4px] border-[#79989f] mb-1"></div>
          <div className="w-full border-t-[4px] border-[#18616e]"></div>
        </div>
        
        {/* Logo Container (overlaps lines) */}
        <div className="relative flex justify-center">
          <div className="bg-[#1e4a6b] px-6">
            <img src={LogoImg} alt="Logo" className="h-24 w-auto object-contain" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Left: Large Logo & Branding */}
          <div className="flex flex-col items-center md:items-start">
            <img src={LogoImg} alt="EITO Group" className="h-48 object-contain" />
            {/* <h2 className="tracking-[0.4em] text-base font-normal uppercase text-white/80">EITO GROUP</h2> */}
          </div>

          {/* Company Column */}
          <div>
            <h3 className="tracking-[0.3em] text-base font-bold uppercase mb-6 text-[#f68921]">
              COMPANY
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/personal-story-section#beliefs-values" className="text-white/90 hover:text-[#f68921] transition-colors">
                  Our Value
                </Link>
              </li>
              <li>
                <Link to="/connection-hub#contact-methods" className="text-white/90 hover:text-[#f68921] transition-colors">
                  Contact us
                </Link>
              </li>
              <li className="pt-2 text-white/70 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@eitogroup.com.my</span>
              </li>
              <li className="text-white/70 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+6016-328 7947</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/eitogroup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-[#f68921] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">INSTAGRAM</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="tracking-[0.3em] text-base font-bold uppercase mb-6 text-[#f68921]">
              SERVICES
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/work-showcase/team-building" className="text-white/90 hover:text-[#f68921] transition-colors">
                  Team Building
                </Link>
              </li>
              <li>
                <Link to="/work-showcase/training-program" className="text-white/90 hover:text-[#f68921] transition-colors">
                  Training Program
                </Link>
              </li>
              <li>
                <Link to="/work-showcase/corporate-event" className="text-white/90 hover:text-[#f68921] transition-colors">
                  Corporate Event
                </Link>
              </li>
              <li>
                <Link to="/work-showcase/csr" className="text-white/90 hover:text-[#f68921] transition-colors">
                  CSR
                </Link>
              </li>
            </ul>
          </div>

          {/* Certifications Column */}
          <div>
            <h3 className="tracking-[0.3em] text-base font-bold uppercase mb-6 text-[#f68921]">
              CERTIFICATIONS
            </h3>
            <div className="flex justify-start">
              <img 
                src={HRDImg} 
                alt="HRD Certification" 
                className="h-24 w-auto object-contain" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 text-center">
          <span className="tracking-[0.2em] text-[10px] uppercase opacity-50">
            © 2026 BY EITO GROUP TEAM BUILDING. ALL RIGHTS RESERVED. |{' '}
            <Link 
              to="/terms-of-service" 
              className="hover:text-[#f68921] transition-colors underline"
            >
              Terms of Service
            </Link>
            {' '}|{' '}
            <Link 
              to="/privacy-policy" 
              className="hover:text-[#f68921] transition-colors underline"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;