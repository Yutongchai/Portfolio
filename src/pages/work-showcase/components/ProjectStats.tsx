import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { ProjectStatsProps } from '../types';

const ProjectStats = ({
  totalProjects,
  filteredCount,
  categories,
}: ProjectStatsProps) => {
  const stats = [
    {
      icon: 'Briefcase',
      label: 'Total Projects',
      value: totalProjects.toString(),
    },
    {
      icon: 'Filter',
      label: 'Showing',
      value: filteredCount.toString(),
    },
    {
      icon: 'Layers',
      label: 'Categories',
      value: categories.toString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 shadow-elevation text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-3">
            <Icon name={stat.icon} size={24} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
};

export default ProjectStats;