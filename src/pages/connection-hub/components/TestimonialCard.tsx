import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl p-8 hover:shadow-elevation transition-all duration-300"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-foreground truncate">
            {testimonial.name}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon
            key={i}
            name={i < testimonial.rating ? 'Star' : 'Star'}
            size={16}
            className={
              i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted'
            }
          />
        ))}
      </div>

      <p className="text-foreground leading-relaxed">{testimonial.content}</p>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="CheckCircle2" size={16} className="text-success" />
          <span>Verified Client</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;