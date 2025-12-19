import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { AvailabilitySlot } from '../types';

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
  onBookSlot: (slot: AvailabilitySlot) => void;
}

const AvailabilityCalendar = ({
  slots,
  onBookSlot,
}: AvailabilityCalendarProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            Book a Consultation
          </h3>
          <p className="text-muted-foreground mt-2">
            Choose a time that works best for you
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>30 min sessions</span>
        </div>
      </div>

      <div className="space-y-3">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              slot.available
                ? 'border-border hover:border-accent bg-background' :'border-border bg-muted/30'
            } transition-all duration-300`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  slot.available ? 'bg-success/10' : 'bg-muted'
                }`}
              >
                <Icon
                  name={slot.available ? 'Calendar' : 'CalendarX'}
                  size={20}
                  className={
                    slot.available ? 'text-success' : 'text-muted-foreground'
                  }
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">{slot.day}</p>
                <p className="text-sm text-muted-foreground">{slot.time}</p>
              </div>
            </div>

            {slot.available ? (
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={14}
                onClick={() => onBookSlot(slot)}
              >
                Book
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-muted rounded-full">
                Unavailable
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              Response Time: Within 24 hours
            </p>
            <p>
              All consultations are conducted via video call. You'll receive a
              calendar invite after booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;