import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-card border-2 border-primary shadow-button hover:shadow-accent transition-all duration-300 group overflow-hidden touch-manipulation"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'citrus' ? 'jewel' : 'citrus'} theme`}
    >
      {/* Background gradient that changes based on theme */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: theme === 'citrus' 
            ? 'linear-gradient(135deg, #fcb22f 0%, #e1620b 100%)'
            : 'linear-gradient(135deg, #12a28f 0%, #695da5 100%)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated circle that slides */}
      <motion.div
        className="absolute w-6 h-6 sm:w-7 sm:h-7 rounded-full"
        animate={{
          background: theme === 'citrus'
            ? 'linear-gradient(135deg, #fcb22f 0%, #e1620b 100%)'
            : 'linear-gradient(135deg, #12a28f 0%, #695da5 100%)',
          x: theme === 'citrus' ? -8 : 8,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      {/* Icons */}
      <div className="relative z-10 flex items-center justify-center gap-1">
        <motion.div
          animate={{
            opacity: theme === 'citrus' ? 1 : 0.4,
            scale: theme === 'citrus' ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="text-primary"
        >
          <Icon name="Sun" size={16} />
        </motion.div>
        <motion.div
          animate={{
            opacity: theme === 'jewel' ? 1 : 0.4,
            scale: theme === 'jewel' ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="text-primary"
        >
          <Icon name="Gem" size={16} />
        </motion.div>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap">
          {theme === 'citrus' ? 'Citrus' : 'Jewel'} Theme
        </div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
