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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          className="bg-card border border-border rounded-xl p-6 hover:border-accent hover:shadow-button transition-all duration-300 group"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
              <Icon
                name={social.icon}
                size={24}
                className="text-foreground group-hover:text-accent transition-colors duration-300"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {social.platform}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                @{social.username}
              </p>
              {social.followers && (
                <p className="text-xs text-accent font-medium mt-1">
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