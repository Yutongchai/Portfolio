import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import ContactMethodCard from './components/ContactMethodCard';
import SocialMediaGrid from './components/SocialMediaGrid';
import TestimonialCard from './components/TestimonialCard';
import TrustBadges from './components/TrustBadges';
import AvailabilityCalendar from './components/AvailableCalendar';
import ContactForm from './components/ContactForm';
import QuickActions from './components/QuickActions';
import type { QuickAction } from './components/QuickActions';
import {
  ContactMethod,
  SocialLink,
  Testimonial,
  TrustBadge,
  AvailabilitySlot,
  ContactFormData } from
'./types';

const ConnectionHub = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const contactMethods: ContactMethod[] = [
  {
    id: '1',
    type: 'email',
    label: 'Email',
    value: 'hello@portfolio.com',
    icon: 'Mail',
    description: 'Best for detailed project discussions',
    primary: true
  },
  {
    id: '2',
    type: 'phone',
    label: 'Phone',
    value: '+1 (555) 123-4567',
    icon: 'Phone',
    description: 'Quick questions and consultations'
  },
  {
    id: '3',
    type: 'calendar',
    label: 'Schedule Call',
    value: 'Book 30-min session',
    icon: 'Calendar',
    description: 'Free consultation meeting'
  },
  {
    id: '4',
    type: 'social',
    label: 'LinkedIn',
    value: 'Connect professionally',
    icon: 'Linkedin',
    description: 'Professional networking'
  }];


  const socialLinks: SocialLink[] = [
  {
    id: '1',
    platform: 'GitHub',
    url: 'https://github.com',
    icon: 'Github',
    username: 'portfolio',
    followers: '2.5K'
  },
  {
    id: '2',
    platform: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'Linkedin',
    username: 'portfolio',
    followers: '5.2K'
  },
  {
    id: '3',
    platform: 'Twitter',
    url: 'https://twitter.com',
    icon: 'Twitter',
    username: 'portfolio',
    followers: '3.8K'
  },
  {
    id: '4',
    platform: 'Dribbble',
    url: 'https://dribbble.com',
    icon: 'Dribbble',
    username: 'portfolio',
    followers: '1.2K'
  },
  {
    id: '5',
    platform: 'Behance',
    url: 'https://behance.net',
    icon: 'Figma',
    username: 'portfolio',
    followers: '890'
  },
  {
    id: '6',
    platform: 'Medium',
    url: 'https://medium.com',
    icon: 'BookOpen',
    username: 'portfolio',
    followers: '1.5K'
  }];


  const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_115d61d2c-1765988781101.png",
    alt: 'Professional woman with blonde hair in navy blazer smiling at camera in modern office',
    content:
    'Working with this developer was an absolute pleasure. The attention to detail and technical expertise exceeded our expectations. Our project was delivered on time and the results speak for themselves.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateLabs',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_180a4ae64-1763294358352.png",
    alt: 'Asian man in glasses wearing white shirt smiling in bright office environment',
    content:
    'The level of professionalism and communication throughout the project was outstanding. Complex technical challenges were solved with elegant solutions. Highly recommended for any serious project.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Design Director',
    company: 'Creative Studio',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18d4825d1-1763293841178.png",
    alt: 'Hispanic woman with dark hair in red blazer smiling confidently in creative workspace',
    content:
    'A rare combination of technical skill and design sensibility. The collaboration was seamless and the final product exceeded our vision. Will definitely work together again.',
    rating: 5
  }];


  const trustBadges: TrustBadge[] = [
  {
    id: '1',
    label: 'SSL Secured',
    icon: 'Shield',
    description: 'Your data is protected'
  },
  {
    id: '2',
    label: 'WCAG 2.1 AA',
    icon: 'Accessibility',
    description: 'Fully accessible'
  },
  {
    id: '3',
    label: '24h Response',
    icon: 'Clock',
    description: 'Quick turnaround'
  },
  {
    id: '4',
    label: '50+ Projects',
    icon: 'Award',
    description: 'Proven track record'
  }];


  const availabilitySlots: AvailabilitySlot[] = [
  {
    id: '1',
    day: 'Monday',
    time: '10:00 AM - 11:00 AM EST',
    available: true
  },
  {
    id: '2',
    day: 'Tuesday',
    time: '2:00 PM - 3:00 PM EST',
    available: false
  },
  {
    id: '3',
    day: 'Wednesday',
    time: '11:00 AM - 12:00 PM EST',
    available: true
  },
  {
    id: '4',
    day: 'Thursday',
    time: '3:00 PM - 4:00 PM EST',
    available: true
  },
  {
    id: '5',
    day: 'Friday',
    time: '10:00 AM - 11:00 AM EST',
    available: false
  }];


  const quickActions: QuickAction[] = [
  {
    id: '1',
    label: 'Download Resume',
    icon: 'Download',
    description: 'Get my latest CV in PDF format',
    action: () => {
      console.log('Downloading resume...');
    }
  },
  {
    id: '2',
    label: 'View Case Studies',
    icon: 'FileText',
    description: 'Explore detailed project breakdowns',
    action: () => {
      window.location.href = '/work-showcase';
    }
  },
  {
    id: '3',
    label: 'Schedule Video Call',
    icon: 'Video',
    description: 'Book a face-to-face consultation',
    action: () => {
      console.log('Opening calendar...');
    }
  },
  {
    id: '4',
    label: 'Request Quote',
    icon: 'DollarSign',
    description: 'Get a project estimate',
    action: () => {
      document.
      getElementById('contact-form')?.
      scrollIntoView({ behavior: 'smooth' });
    }
  }];


  const handleContactMethod = (method: ContactMethod) => {
    switch (method.type) {
      case 'email':
        window.location.href = `mailto:${method.value}`;
        break;
      case 'phone':
        window.location.href = `tel:${method.value}`;
        break;
      case 'calendar':
        document.
        getElementById('availability-calendar')?.
        scrollIntoView({ behavior: 'smooth' });
        break;
      case 'social':
        window.open('https://linkedin.com', '_blank');
        break;
    }
  };

  const handleBookSlot = (slot: AvailabilitySlot) => {
    console.log('Booking slot:', slot);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormSubmit = (data: ContactFormData) => {
    console.log('Form submitted:', data);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Connection Hub - Let's Work Together | Portfolio</title>
        <meta
          name="description"
          content="Get in touch for project inquiries, collaborations, or consultations. Multiple ways to connect including email, phone, social media, and calendar booking." />

        <meta
          name="keywords"
          content="contact, hire developer, project inquiry, consultation, collaboration" />

      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {showSuccessMessage &&
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-6 z-50 bg-success text-success-foreground px-6 py-4 rounded-xl shadow-elevation flex items-center space-x-3">

            <Icon name="CheckCircle2" size={20} />
            <span className="font-medium">
              Success! I'll get back to you soon.
            </span>
          </motion.div>
        }

        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16">

              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Icon name="Sparkles" size={16} />
                <span>Let's Connect</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Start a Conversation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Whether you have a project in mind, want to collaborate, or just
                want to say hello, I'm always open to discussing new
                opportunities and ideas.
              </p>
            </motion.div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12">

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Choose Your Preferred Method
                </h2>
                <p className="text-muted-foreground">
                  Multiple ways to reach out - pick what works best for you
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {contactMethods.map((method, index) =>
                <ContactMethodCard
                  key={method.id}
                  method={method}
                  index={index}
                  onAction={handleContactMethod} />

                )}
              </div>

              <QuickActions actions={quickActions} />
            </div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12">

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Connect on Social Media
                </h2>
                <p className="text-muted-foreground">
                  Follow my work and stay updated with latest projects
                </p>
              </motion.div>

              <SocialMediaGrid socialLinks={socialLinks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              <div id="availability-calendar">
                <AvailabilityCalendar
                  slots={availabilitySlots}
                  onBookSlot={handleBookSlot} />

              </div>

              <div id="contact-form">
                <ContactForm onSubmit={handleFormSubmit} />
              </div>
            </div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12">

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What Clients Say
                </h2>
                <p className="text-muted-foreground">
                  Trusted by professionals and companies worldwide
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) =>
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index} />

                )}
              </div>
            </div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12">

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Trust & Security
                </h2>
                <p className="text-muted-foreground">
                  Your information is safe and secure
                </p>
              </motion.div>

              <TrustBadges badges={trustBadges} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-12 text-center">

              <div className="max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name="MessageCircle" size={32} className="text-accent-foreground" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Let's discuss how we can work together to bring your ideas to
                  life. I'm excited to hear about your project and explore how I
                  can help.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="mailto:hello@portfolio.com"
                    className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-cta text-accent-foreground font-semibold px-8 py-4 rounded-xl shadow-button hover:shadow-accent transition-all duration-300 hover:scale-105">

                    <Icon name="Mail" size={20} />
                    <span>Send Email</span>
                  </a>
                  <button
                    onClick={() =>
                    document.
                    getElementById('availability-calendar')?.
                    scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center justify-center space-x-2 bg-card hover:bg-muted text-foreground font-semibold px-8 py-4 rounded-xl border border-border hover:border-accent transition-all duration-300">

                    <Icon name="Calendar" size={20} />
                    <span>Book Consultation</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <footer className="border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/personal-story-section"
                      className="text-muted-foreground hover:text-accent transition-colors duration-300">

                      About Me
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work-showcase"
                      className="text-muted-foreground hover:text-accent transition-colors duration-300">

                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="/connection-hub"
                      className="text-muted-foreground hover:text-accent transition-colors duration-300">

                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Contact Info
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <Icon name="Mail" size={16} />
                    <span>hello@portfolio.com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} />
                    <span>San Francisco, CA</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Follow Me
                </h3>
                <div className="flex items-center space-x-4">
                  {socialLinks.slice(0, 4).map((social) =>
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-accent/10 flex items-center justify-center transition-all duration-300 hover:scale-110">

                      <Icon
                      name={social.icon}
                      size={20}
                      className="text-foreground hover:text-accent" />

                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
              <p>
                © {new Date().getFullYear()} Portfolio. All rights reserved.
                Built with React, TypeScript & Tailwind CSS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>);

};

export default ConnectionHub;