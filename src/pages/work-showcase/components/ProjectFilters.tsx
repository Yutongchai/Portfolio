import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ProjectFiltersProps } from '../types';

const ProjectFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: ProjectFiltersProps) => {
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'featured', label: 'Featured First' },
    { value: 'alphabetical', label: 'A-Z' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-elevation mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('all')}
              className={
                selectedCategory === 'all' ?'bg-accent text-accent-foreground' :''
              }
            >
              All Projects
            </Button>
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={
                  selectedCategory === category.value ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => onCategoryChange(category.value)}
                className={
                  selectedCategory === category.value
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }
              >
                {category.label}
                <span className="ml-2 text-xs opacity-70">
                  ({category.count})
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-64">
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={(value) => onSortChange(value as any)}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Click on any project to view detailed case study</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectFilters;