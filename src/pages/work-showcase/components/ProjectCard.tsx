import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ProjectCardProps } from '../types';

const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-card rounded-lg sm:rounded-2xl overflow-hidden shadow-elevation hover:shadow-accent transition-all duration-500"
    >
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <Image
            src={project.image}
            alt={project.alt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"
        />

        {project.featured && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Icon name="Star" size={12} />
            <span>Featured</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
        >
          <Button
            variant="default"
            size="default"
            fullWidth
            className="bg-accent hover:bg-cta text-accent-foreground font-semibold text-xs sm:text-sm"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={() => onViewDetails(project)}
          >
            View Case Study
          </Button>
        </motion.div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider line-clamp-1">
            {project.category}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">{project.year}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs text-accent font-medium">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Briefcase" size={14} />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{project.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;