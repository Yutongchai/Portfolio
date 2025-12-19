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
      } rounded-2xl p-8 hover:shadow-elevation transition-all duration-300`}
    >
      {method.primary && (
        <div className="absolute -top-3 left-6 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-semibold">
          Preferred
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            method.primary ? 'bg-accent' : 'bg-muted'
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon
            name={method.icon}
            size={28}
            className={method.primary ? 'text-accent-foreground' : 'text-foreground'}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{method.label}</h3>
      <p className="text-muted-foreground text-sm mb-4">{method.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium text-sm truncate mr-4">
          {method.value}
        </span>
        <Button
          variant={method.primary ? 'default' : 'outline'}
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
          onClick={() => onAction(method)}
          className={
            method.primary
              ? 'bg-accent hover:bg-cta text-accent-foreground'
              : ''
          }
        >
          Connect
        </Button>
      </div>
    </motion.div>
  );
};

export default ContactMethodCard;