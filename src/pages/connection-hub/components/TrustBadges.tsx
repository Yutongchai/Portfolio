import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { TrustBadge } from '../types';

interface TrustBadgesProps {
  badges: TrustBadge[];
}

const TrustBadges = ({ badges }: TrustBadgesProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex flex-col items-center text-center space-y-3 p-6 bg-muted/50 rounded-xl"
        >
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name={badge.icon} size={24} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {badge.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {badge.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustBadges;