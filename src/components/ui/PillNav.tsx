import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface PillNavProps {
  logo: string;
  logoAlt?: string;
  logoHref?: string;
  items: NavItem[];
  activeHref: string;
  className?: string;
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '/',
  items,
  activeHref,
  className = '',
}: PillNavProps) => {
  // Dropdown menu state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Logo shrink-on-scroll state
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // shrink after 80px of scroll
      setScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const dropdownItems = [
    { label: 'Team Building', href: '/work-showcase/team-building' },
    { label: 'Corporate Event', href: '/work-showcase/corporate-event' },
    { label: 'Training Program', href: '/work-showcase/training-program' },
    { label: 'CSR', href: '/work-showcase/csr' },
  ];

  return (
    <nav className={`w-full bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50 border-b ${className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-4 py-2 gap-3">

        {/* Logo */}
        <div className="flex justify-start items-center">
          <Link to={logoHref}>
            <img
              src={logo}
              alt={logoAlt}
              className="w-auto"
              style={{
                height: scrolled ? 40 : 88,
                transition: 'height 280ms ease, transform 280ms ease',
                transformOrigin: 'left center',
              }}
            />
          </Link>
        </div>

        {/* Nav Items - Absolutely Centered */}
        <div className="flex justify-center">
          <ul className="flex items-center gap-6">
            {items.map((item) => (
              <li key={item.href} className="relative group">
                {item.label === 'Services' ? (
                  <div
                    className="relative py-1" // smaller hoverable area but still usable
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center text-sm tracking-wide text-[#5a2323] hover:text-[#a05a5a] transition-all ${activeHref.includes('work-showcase') ? 'font-semibold' : 'font-normal'
                        }`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`
                      absolute left-1/2 -translate-x-1/2 pt-3 w-56 z-[9999]
                      transition-all duration-300 ease-out
                      ${dropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'}
                    `}>
                      <ul className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-1">
                        {dropdownItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              to={sub.href}
                              className="block px-4 py-2 text-sm text-[#5a2323] hover:bg-[#fcf8f8] hover:text-[#a05a5a] transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-sm tracking-wide text-[#5a2323] hover:text-[#a05a5a] transition-all py-1 border-b-2 border-transparent ${activeHref === item.href ? 'border-[#7a4a4a] font-semibold' : 'font-normal'
                      }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Book Appointment Button */}
        <div className="flex justify-end items-center">
          <Link
            to="/connection-hub#contact-methods"
            className="bg-[#f68921] text-white px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-[#d67419] transition-all duration-300 hover:shadow-sm whitespace-nowrap"
          >
            Book An Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PillNav;