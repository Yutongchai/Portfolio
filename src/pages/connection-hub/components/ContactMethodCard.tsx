import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ContactMethod } from '../types';

interface ContactMethodCardProps {
  method: ContactMethod;
  index: number;
  onAction: (method: ContactMethod) => void;
}

const ContactMethodCard = ({ method, index, onAction }: ContactMethodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group ${
        method.primary
          ? 'bg-accent/10 border-2 border-accent' :'bg-card border border-border'
      } rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-elevation transition-all duration-300`}
    >
      {method.primary && (
        <div className="absolute -top-3 left-4 sm:left-6 bg-accent text-accent-foreground px-3 sm:px-4 py-1 rounded-full text-xs font-semibold">
          Preferred
        </div>
      )}

      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div
          className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
            method.primary ? 'bg-accent' : 'bg-muted'
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon
            name={method.icon}
            size={24}
            className={`w-6 h-6 sm:w-7 sm:h-7 ${method.primary ? 'text-accent-foreground' : 'text-foreground'}`}
          />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{method.label}</h3>
      <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{method.description}</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <span className="text-foreground font-medium text-xs sm:text-sm break-all">
          {method.value}
        </span>
        <Button
          variant={method.primary ? 'default' : 'outline'}
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
          onClick={() => onAction(method)}
          className={`w-full sm:w-auto text-xs sm:text-sm py-2 sm:py-2 ${
            method.primary
              ? 'bg-accent hover:bg-cta text-accent-foreground'
              : ''
          }`}
        >
          Connect
        </Button>
      </div>
    </motion.div>
  );
};

export default ContactMethodCard;