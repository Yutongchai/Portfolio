import { motion } from 'framer-motion';


import Button from '../../../components/ui/Button';
import type { ButtonProps } from '../../../components/ui/Button';

export interface QuickAction {
  id: string;
  label: string;
  icon: ButtonProps['iconName'];
  description: string;
  action: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
        >
          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconName={action.icon}
            iconPosition="left"
            iconSize={20}
            onClick={action.action}
            className="h-auto py-6 justify-start hover:border-accent hover:bg-accent/5"
          >
            <div className="flex flex-col items-start space-y-1 ml-3">
              <span className="font-semibold text-foreground">
                {action.label}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                {action.description}
              </span>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;