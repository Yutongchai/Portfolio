import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Activity } from '../types/activities';

interface ActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityModal = ({ activity, isOpen, onClose }: ActivityModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!activity) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Indoor': 'from-blue-500 to-cyan-500',
      'Outdoor': 'from-green-500 to-emerald-500',
      'Workshop': 'from-purple-500 to-pink-500',
      'Virtual': 'from-amber-500 to-orange-500'
    };
    return colors[category] || 'from-blue-500 to-cyan-500';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-8 flex items-start justify-center">
              <div className="relative w-full max-w-4xl bg-background rounded-2xl shadow-2xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-muted transition-colors duration-300"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={24} className="text-foreground" />
                </button>

                {/* Image Header */}
                <div className="relative h-96 overflow-hidden rounded-t-2xl">
                  <Image
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className={`inline-block bg-gradient-to-r ${getCategoryColor(activity.category)} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg mb-4`}>
                      {activity.category}
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {activity.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="DollarSign" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${activity.price.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">per session</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="Clock" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="text-lg font-semibold text-foreground">
                          {activity.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="Users" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Group Size</p>
                        <p className="text-lg font-semibold text-foreground">
                          {activity.min_participants} - {activity.max_participants} people
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Info" size={24} className="text-accent" />
                      <span>About This Activity</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {activity.long_description}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-8 p-6 bg-accent/5 rounded-2xl border-l-4 border-accent">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Sparkles" size={24} className="text-accent" />
                      <span>What You'll Experience</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {activity.experience}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="default"
                      size="lg"
                      fullWidth
                      className="bg-accent hover:bg-cta text-accent-foreground font-semibold"
                      iconName="Calendar"
                      iconPosition="left"
                      onClick={() => navigate('/connection-hub')}
                    >
                      Book This Activity
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="sm:w-auto"
                      iconName="Mail"
                      iconPosition="left"
                      onClick={() => navigate('/connection-hub')}
                    >
                      Ask a Question
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityModal;
