import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { SocialLink } from '../types';

interface SocialMediaGridProps {
  socialLinks: SocialLink[];
}

const SocialMediaGrid = ({ socialLinks }: SocialMediaGridProps) => {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {socialLinks.map((social, index) => (
        <motion.button
          key={social.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSocialClick(social.url)}
          className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-accent hover:shadow-button transition-all duration-300 group touch-manipulation"
        >
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
              <Icon
                name={social.icon}
                size={20}
                className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-accent transition-colors duration-300"
              />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                {social.platform}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
                @{social.username}
              </p>
              {social.followers && (
                <p className="text-xs text-accent font-medium mt-0.5 sm:mt-1">
                  {social.followers}
                </p>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SocialMediaGrid;