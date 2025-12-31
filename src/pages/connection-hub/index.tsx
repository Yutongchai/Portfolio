import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import ContactMethodCard from "./components/ContactMethodCard";
import SocialMediaGrid from "./components/SocialMediaGrid";
import TestimonialCard from "./components/TestimonialCard";
import TrustBadges from "./components/TrustBadges";
import AvailabilityCalendar from "./components/AvailableCalendar";
import ContactForm from "./components/ContactForm";
import QuickActions from "./components/QuickActions";
import type { QuickAction } from "./components/QuickActions";
import {
  ContactMethod,
  SocialLink,
  Testimonial,
  TrustBadge,
  AvailabilitySlot,
  ContactFormData,
} from "./types";

const ConnectionHub = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: "1",
      type: "calendar",
      label: "Book Team Building Workshop",
      value: "Schedule a session",
      icon: "Calendar",
      description: "Reserve a date for your team building event",
      primary: true,
    },
    {
      id: "2",
      type: "email",
      label: "Request Custom Event",
      value: "events@hiveandthrive.com",
      icon: "Mail",
      description: "Tailored team building experiences for your company",
    },
    {
      id: "3",
      type: "phone",
      label: "Consult Team Coach",
      value: "+1 (555) 987-6543",
      icon: "Phone",
      description: "Speak with a certified team building coach",
    },
    {
      id: "4",
      type: "social",
      label: "Corporate Inquiry",
      value: "Connect with us",
      icon: "Briefcase",
      description: "For HR and corporate partnership inquiries",
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      id: "1",
      platform: "GitHub",
      url: "https://github.com",
      icon: "Github",
      username: "portfolio",
      followers: "2.5K",
    },
    {
      id: "2",
      platform: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      username: "portfolio",
      followers: "5.2K",
    },
    {
      id: "3",
      platform: "Twitter",
      url: "https://twitter.com",
      icon: "Twitter",
      username: "portfolio",
      followers: "3.8K",
    },
    {
      id: "4",
      platform: "Dribbble",
      url: "https://dribbble.com",
      icon: "Dribbble",
      username: "portfolio",
      followers: "1.2K",
    },
    {
      id: "5",
      platform: "Behance",
      url: "https://behance.net",
      icon: "Figma",
      username: "portfolio",
      followers: "890",
    },
    {
      id: "6",
      platform: "Medium",
      url: "https://medium.com",
      icon: "BookOpen",
      username: "portfolio",
      followers: "1.5K",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Jessica Lee",
      role: "HR Director",
      company: "BrightWorks Inc",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_115d61d2c-1765988781101.png",
      alt: "Smiling woman at team building event",
      content:
        "EITO Group created an unforgettable team building experience for our staff. The activities were fun, meaningful, and brought our team closer together. Highly recommended!",
      rating: 5,
    },
    {
      id: "2",
      name: "David Kim",
      role: "Operations Manager",
      company: "Synergy Group",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_180a4ae64-1763294358352.png",
      alt: "Team leader at outdoor workshop",
      content:
        "Our team loved the custom workshop from EITO Group. The facilitators were engaging and the results were immediate—better communication and more trust.",
      rating: 5,
    },
    {
      id: "3",
      name: "Priya Patel",
      role: "Project Lead",
      company: "InnovateX",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_18d4825d1-1763293841178.png",
      alt: "Project lead at team building session",
      content:
        "The team building adventure was a game changer for our project team. We left energized, motivated, and ready to tackle new challenges together. Thank you EITO Group!",
      rating: 5,
    },
  ];

  const trustBadges: TrustBadge[] = [
    {
      id: "1",
      label: "Certified Facilitators",
      icon: "UserCheck",
      description: "Expert team building coaches",
    },
    {
      id: "2",
      label: "Customizable Events",
      icon: "Settings",
      description: "Tailored workshops for every team",
    },
    {
      id: "3",
      label: "Satisfaction Guarantee",
      icon: "Smile",
      description: "We ensure a positive experience",
    },
    {
      id: "4",
      label: "Trusted by 100+ Companies",
      icon: "Award",
      description: "Proven results and happy clients",
    },
  ];

  const availabilitySlots: AvailabilitySlot[] = [
    {
      id: "1",
      day: "Monday",
      time: "10:00 AM - 11:00 AM EST",
      available: true,
    },
    {
      id: "2",
      day: "Tuesday",
      time: "2:00 PM - 3:00 PM EST",
      available: false,
    },
    {
      id: "3",
      day: "Wednesday",
      time: "11:00 AM - 12:00 PM EST",
      available: true,
    },
    {
      id: "4",
      day: "Thursday",
      time: "3:00 PM - 4:00 PM EST",
      available: true,
    },
    {
      id: "5",
      day: "Friday",
      time: "10:00 AM - 11:00 AM EST",
      available: false,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "1",
      label: "Download Service Brochure",
      icon: "Download",
      description: "Get our team building services PDF",
      action: () => {
        window.open("/public/hiveandthrive-brochure.pdf", "_blank");
      },
    },
    {
      id: "2",
      label: "View Event Gallery",
      icon: "Image",
      description: "See photos and videos from past events",
      action: () => {
        window.location.href = "/Portfolio/work-showcase";
      },
    },
    {
      id: "3",
      label: "Book Discovery Call",
      icon: "Video",
      description: "Schedule a free team building consultation",
      action: () => {
        document
          .getElementById("availability-calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "4",
      label: "Request Quote",
      icon: "DollarSign",
      description: "Get a custom event estimate",
      action: () => {
        document
          .getElementById("contact-form")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const handleContactMethod = (method: ContactMethod) => {
    switch (method.type) {
      case "calendar":
        document
          .getElementById("availability-calendar")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "email":
        window.location.href = `mailto:${method.value}`;
        break;
      case "phone":
        window.location.href = `tel:${method.value}`;
        break;
      case "social":
        document
          .getElementById("contact-form")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  };

  const handleBookSlot = (slot: AvailabilitySlot) => {
    console.log("Booking slot:", slot);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>EITO Group - Team Building Services</title>
        <meta
          name="description"
          content="Contact EITO Group for team building workshops, custom events, and corporate training. Multiple ways to connect and book your next team experience."
        />
        <meta
          name="keywords"
          content="team building, corporate events, workshops, group activities, EITO Group"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-success text-success-foreground px-6 py-4 rounded-xl shadow-elevation flex items-center space-x-3"
          >
            <Icon name="CheckCircle2" size={20} />
            <span className="font-medium">
              Success! I'll get back to you soon.
            </span>
          </motion.div>
        )}

        <main className="pt-5 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="relative w-full mb-10">
              {/* Full-width video background and overlay, sized to cover hero text only */}
              <div className="relative w-full" style={{ height: '600px', maxHeight: '85vh' }}>
                <div className="absolute inset-0 w-screen left-1/2 -translate-x-1/2 h-full">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-xl"
                  >
                    <source
                      src="/Portfolio/station_games.mp4"
                      type="video/mp4"
                    />
                  </video>
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-transparent rounded-3xl"></div>
                </div>

                {/* Content centered over video */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 text-center pt-32 pb-16 px-6"
                >
                  <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                    <Icon name="Users" size={16} />
                    <span>Team Building Services</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                    Build Stronger Teams with EITO Group
                  </h1>
                  <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
                    Discover engaging workshops, custom events, and expert
                    coaching designed to boost collaboration, trust, and
                    performance in your organization.
                  </p>
                </motion.div>
              </div>
            </div>
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Choose Your Preferred Method
                </h2>
                <p className="text-muted-foreground">
                  Multiple ways to reach out - pick what works best for you
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <ContactMethodCard
                    key={method.id}
                    method={method}
                    index={index}
                    onAction={handleContactMethod}
                  />
                ))}
              </div>

              <QuickActions actions={quickActions} />
            </div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
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
                  onBookSlot={handleBookSlot}
                />
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What Clients Say
                </h2>
                <p className="text-muted-foreground">
                  Trusted by professionals and companies worldwide
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
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
              className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-12 text-center"
            >
              <div className="max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon
                    name="MessageCircle"
                    size={32}
                    className="text-accent-foreground"
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Energize Your Team?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Book a team building workshop, request a custom event, or
                  consult with our expert coaches. EITO Group is here to help
                  your team connect, grow, and succeed together!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="mailto:events@hiveandthrive.com"
                    className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-cta text-accent-foreground font-semibold px-8 py-4 rounded-xl shadow-button hover:shadow-accent transition-all duration-300 hover:scale-105"
                  >
                    <Icon name="Mail" size={20} />
                    <span>Request Custom Event</span>
                  </a>
                  <button
                    onClick={() =>
                      document
                        .getElementById("availability-calendar")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center space-x-2 bg-card hover:bg-muted text-foreground font-semibold px-8 py-4 rounded-xl border border-border hover:border-accent transition-all duration-300"
                  >
                    <Icon name="Calendar" size={20} />
                    <span>Book Team Workshop</span>
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
                      className="text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
                      About Me
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work-showcase"
                      className="text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="/connection-hub"
                      className="text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
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
                  {socialLinks.slice(0, 4).map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted hover:bg-accent/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <Icon
                        name={social.icon}
                        size={20}
                        className="text-foreground hover:text-accent"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
              <p>
                © {new Date().getFullYear()} Portfolio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ConnectionHub;
