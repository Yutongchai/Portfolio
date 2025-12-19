import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ProjectModalProps } from '../types';

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

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

  if (!project) return null;

  const nextImage = () => {
    setActiveGalleryIndex((prev) =>
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveGalleryIndex((prev) =>
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
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
              <div className="relative w-full max-w-6xl bg-background rounded-2xl shadow-2xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-muted transition-colors duration-300"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={24} className="text-foreground" />
                </button>

                <div className="relative h-96 overflow-hidden rounded-t-2xl">
                  <Image
                    src={project.gallery[activeGalleryIndex].url}
                    alt={project.gallery[activeGalleryIndex].alt}
                    className="w-full h-full object-cover"
                  />

                  {project.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-muted transition-colors duration-300"
                        aria-label="Previous image"
                      >
                        <Icon name="ChevronLeft" size={24} />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-muted transition-colors duration-300"
                        aria-label="Next image"
                      >
                        <Icon name="ChevronRight" size={24} />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {project.gallery.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveGalleryIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === activeGalleryIndex
                                ? 'bg-accent w-8' :'bg-background/50'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-8 max-h-[calc(100vh-32rem)] overflow-y-auto">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.year}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {project.longDescription}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="Briefcase" size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Client</p>
                        <p className="text-sm font-semibold text-foreground">
                          {project.client}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="User" size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Role</p>
                        <p className="text-sm font-semibold text-foreground">
                          {project.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name="Clock" size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm font-semibold text-foreground">
                          {project.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center space-x-2">
                        <Icon name="AlertCircle" size={20} className="text-accent" />
                        <span>Challenge</span>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center space-x-2">
                        <Icon name="Lightbulb" size={20} className="text-accent" />
                        <span>Solution</span>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center space-x-2">
                        <Icon name="TrendingUp" size={20} className="text-accent" />
                        <span>Outcome</span>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {project.outcome}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {project.metrics.map((metric, index) => (
                          <div
                            key={index}
                            className="p-4 bg-muted rounded-lg text-center"
                          >
                            <Icon
                              name={metric.icon}
                              size={24}
                              className="text-accent mx-auto mb-2"
                            />
                            <p className="text-2xl font-bold text-foreground mb-1">
                              {metric.value}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.testimonial && (
                    <div className="p-6 bg-muted rounded-xl mb-8">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={project.testimonial.avatar}
                          alt={project.testimonial.alt}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <Icon
                            name="Quote"
                            size={24}
                            className="text-accent mb-2"
                          />
                          <p className="text-foreground italic mb-4">
                            "{project.testimonial.quote}"
                          </p>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {project.testimonial.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.testimonial.position} at{' '}
                              {project.testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.link && (
                    <Button
                      variant="default"
                      size="lg"
                      fullWidth
                      className="bg-accent hover:bg-cta text-accent-foreground font-semibold"
                      iconName="ExternalLink"
                      iconPosition="right"
                      onClick={() => window.open(project.link, '_blank')}
                    >
                      View Live Project
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;