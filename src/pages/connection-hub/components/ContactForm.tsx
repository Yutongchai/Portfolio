import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ContactFormData, FormErrors } from '../types';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const budgetOptions = [
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: 'over-50k', label: 'Over $50,000' },
  ];

  const timelineOptions = [
    { value: 'urgent', label: 'Urgent (1-2 weeks)' },
    { value: 'short', label: 'Short term (1-2 months)' },
    { value: 'medium', label: 'Medium term (3-6 months)' },
    { value: 'long', label: 'Long term (6+ months)' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        budget: '',
        timeline: '',
      });
      setErrors({});
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Icon name="Send" size={24} className="text-accent" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            Send a Message
          </h3>
          <p className="text-muted-foreground text-sm">
            I'll respond within 24 hours
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <Input
          label="Subject"
          type="text"
          name="subject"
          placeholder="Project inquiry, collaboration, or general question"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Project Budget"
            placeholder="Select budget range"
            options={budgetOptions}
            value={formData.budget}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, budget: value as string }))
            }
          />

          <Select
            label="Timeline"
            placeholder="Select timeline"
            options={timelineOptions}
            value={formData.timeline}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, timeline: value as string }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            name="message"
            rows={6}
            placeholder="Tell me about your project, goals, and how I can help..."
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-background border ${
              errors.message ? 'border-destructive' : 'border-border'
            } rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 resize-none`}
          />
          {errors.message && (
            <p className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-xl">
          <Icon name="Shield" size={20} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              Your privacy matters
            </p>
            <p>
              Your information is secure and will never be shared with third
              parties. I'll only use it to respond to your inquiry.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isSubmitting}
          iconName="Send"
          iconPosition="right"
          iconSize={18}
          className="bg-accent hover:bg-cta text-accent-foreground font-semibold shadow-button hover:shadow-accent"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </motion.form>
  );
};

export default ContactForm;