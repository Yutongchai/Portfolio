import { motion } from "framer-motion";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Activity } from '../types/activities';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onViewMore: (activity: Activity) => void;
  getCategoryColor: (category: string) => string;
}

const ActivityCard = ({
  activity,
  index,
  onViewMore,
  getCategoryColor,
}: ActivityCardProps) => {
  return (
    <motion.div
      className="relative bg-background rounded-3xl shadow-xl overflow-hidden card-hover group"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Featured Badge */}
      {activity.featured && (
        <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
          <Icon name="Star" size={12} />
          <span>Popular</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={activity.image_url}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Chip */}
        <div
          className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(
            activity.category
          )} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg`}
        >
          {activity.category}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={18} className="text-accent" />
            <span className="text-xl font-bold text-foreground">
              {activity.price.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {activity.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {activity.description}
        </p>

        {/* Details */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-accent" />
            <span>
              {activity.min_participants}-{activity.max_participants} people
            </span>
          </div>
        </div>

        {/* View More Button */}
        <Button
          variant="default"
          size="default"
          fullWidth
          className="bg-primary hover:bg-accent text-primary-foreground font-semibold"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => onViewMore(activity)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
