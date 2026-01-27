import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";
import ContactMethodCard from "./components/ContactMethodCard";
import { HoverEffect } from "../../components/ui/HoverEffect";
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
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: "2",
      type: "email",
      label: "Request Custom Event",
      value: "info@eitogroup.com.my",
      icon: "Mail",
      description: "Tailored team building experiences for your company",
      primary: true,
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

  const socialLinks = [
    {
      title: "WhatsApp",
      description: "Chat with us directly on WhatsApp for quick responses",
      link: "https://wa.me/60123456789",
      icon: "MessageCircle",
    },
    {
      title: "Instagram",
      description: "Follow @eitogroup for updates and behind-the-scenes",
      link: "https://www.instagram.com/eitogroup/",
      icon: "Instagram",
    },
    {
      title: "Email",
      description: "Send us an email at info@eitogroup.com.my",
      link: "mailto:info@eitogroup.com.my",
      icon: "Mail",
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
        navigate("/work-showcase");
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
        <title>EITO Group</title>
        <link rel="icon" type="image/png" href="/Portfolio/EITO bw.png" />
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

        <main className="pt-20 sm:pt-32 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-20"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground primary-last mb-4 sm:mb-6">
                Build Stronger Teams with
              </h1>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground primary-last mb-4 sm:mb-6">
                EITO Group
              </h1>
              {/* <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
                Discover engaging workshops, custom events, and expert coaching
                designed to boost collaboration, trust, and performance in your
                organization.
              </p> */}
            </motion.div>
         {/*    <div className="mb-12 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                  Choose Your Preferred Method
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2">
                  Multiple ways to reach out - pick what works best for you
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
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
            </div> */}

            <div className="mb-12 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Get in Touch Directly
                </h2>
              </motion.div>

              <HoverEffect items={socialLinks} />
            </div>

            {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
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
 */}
            {/*  <div className="mb-20">
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
            </div> */}

            {/* <motion.div
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
                    href="mailto:info@eitogroup.com.my"
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
            </motion.div> */}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConnectionHub;
