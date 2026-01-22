import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import LogoImg from '../Logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: 'https://www.linkedin.com',
      ariaLabel: 'Visit our LinkedIn page'
    },
    {
      name: 'Instagram',
      icon: 'Instagram',
      url: 'https://www.instagram.com/eitogroup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      ariaLabel: 'Visit our Instagram page'
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      url: 'https://www.facebook.com',
      ariaLabel: 'Visit our Facebook page'
    },
    {
      name: 'Mail',
      icon: 'Mail',
      url: 'mailto:contact@eitogroup.com',
      ariaLabel: 'Send us an email'
    }
  ];

  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo, Name and Social Media Icons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
            {/* Logo - spans 2 rows */}
            <Link to="/" className="group" aria-label="Home">
              <img 
                src={LogoImg} 
                alt="EITO Group Logo" 
                className="h-32 w-auto transition-transform duration-300 group-hover:scale-110"
              />
            </Link>

            {/* Name and Social Icons stacked */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#12a28f] via-[#fcb22f] to-[#ee424c] bg-clip-text text-transparent">
                EITO Group
              </span>
              
              {/* Social Media Icons */}
              <div className="flex items-center space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 transform hover:scale-110"
                  >
                    <Icon name={social.icon} size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-border" />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} EITO Group. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
