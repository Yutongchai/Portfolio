import { useEffect } from "react";
import myPhoto from "../../components/mainPic.jpg";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "../../components/ui/Header";
import HeroSection from "./components/HeroSection";
import CoreValuesSection from "./components/CoreValuesSection";
import ActivitiesSection from "./components/ActivitiesSection";
import JourneySection from "./components/JourneySection";
import PhilosophySection from "./components/PhilosophySection";
import ParallaxBackground from "./components/ParallaxBackground";
import SectionWrapper from "./components/SectionWrapper";
import { PersonalInfo, CoreValue, Journey, Philosophy } from "./types";

const PersonalStorySection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const personalInfo: PersonalInfo = {
    name: "EITO Group",
    title: "Team Building & Collaboration Experts",
    tagline: "Building stronger teams, one connection at a time",
    bio: "At EITO Group, we believe that the foundation of every successful organization is a united, motivated, and collaborative team. With years of experience in designing and facilitating engaging team-building experiences, our mission is to help groups unlock their full potential, foster trust, and create lasting bonds that drive collective success.",
    image: myPhoto, // Use your local image
    alt: "A diverse group of professionals participating in a fun team-building activity, smiling and collaborating together.",
  };

  const coreValues: CoreValue[] = [
    {
      id: 1,
      icon: "Users",
      title: "Collaboration",
      description:
        "We believe that the best results come from working together, sharing ideas, and supporting one another as a team.",
    },
    {
      id: 2,
      icon: "Sparkles",
      title: "Engagement",
      description:
        "Our activities are designed to energize, inspire, and involve every participant, making teamwork fun and memorable.",
    },
    {
      id: 3,
      icon: "Lightbulb",
      title: "Growth Mindset",
      description:
        "We encourage continuous learning, open communication, and embracing challenges as opportunities to grow together.",
    },
    {
      id: 4,
      icon: "Heart",
      title: "Trust & Respect",
      description:
        "We foster an environment where every voice is valued, and trust is built through honesty, empathy, and mutual respect.",
    },
  ];

  const journeys: Journey[] = [
    {
      id: 1,
      year: "2018",
      title: "EITO Group Founded",
      description:
        "A group of passionate facilitators came together to create unique team-building experiences, inspired by the power of collaboration and community.",
      icon: "Rocket",
    },
    {
      id: 2,
      year: "2019",
      title: "First Corporate Retreat",
      description:
        "Organized our first large-scale retreat, helping teams break down barriers, build trust, and discover new strengths through creative challenges.",
      icon: "Briefcase",
    },
    {
      id: 3,
      year: "2021",
      title: "Virtual Team Building",
      description:
        "Adapted to the changing world by launching engaging virtual programs, keeping teams connected and motivated no matter where they are.",
      icon: "Globe",
    },
    {
      id: 4,
      year: "2023",
      title: "Community Impact",
      description:
        "Partnered with local organizations to bring team-building activities to schools and nonprofits, spreading the spirit of collaboration beyond the workplace.",
      icon: "Users",
    },
    {
      id: 5,
      year: "2025",
      title: "Expanding Horizons",
      description:
        "Launched new programs focused on leadership, diversity, and inclusion, empowering teams to thrive in a rapidly evolving world.",
      icon: "Star",
    },
  ];

  const philosophies: Philosophy[] = [
    {
      id: 1,
      quote: "Alone we can do so little; together we can do so much.",
      author: "Helen Keller",
      context:
        "This reminds us that teamwork multiplies our impact and helps us achieve what we couldn't do alone.",
    },
    {
      id: 2,
      quote:
        "Coming together is a beginning. Keeping together is progress. Working together is success.",
      author: "Henry Ford",
      context: "True success is built on ongoing collaboration and unity.",
    },
    {
      id: 3,
      quote: "None of us is as smart as all of us.",
      author: "Ken Blanchard",
      context:
        "We value every team member's input and believe in the power of collective wisdom.",
    },
    {
      id: 4,
      quote:
        "Trust is knowing that when a team member does push you, they're doing it because they care about the team.",
      author: "Patrick Lencioni",
      context:
        "Healthy teams challenge each other to grow, always with respect and trust.",
    },
    {
      id: 5,
      quote:
        "Great things in business are never done by one person. They're done by a team of people.",
      author: "Steve Jobs",
      context: "We celebrate the achievements that come from working together.",
    },
    {
      id: 6,
      quote: "Teamwork divides the task and multiplies the success.",
      author: "Unknown",
      context:
        "By sharing the load, we make every challenge more manageable and every victory sweeter.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />

      <ParallaxBackground />

      <Header />

      <main className="pt-20 relative z-10">
        <HeroSection personalInfo={personalInfo} />

        <SectionWrapper delay={0.1}>
          <CoreValuesSection values={coreValues} />
        </SectionWrapper>

        <SectionWrapper delay={0.2}>
          <ActivitiesSection />
        </SectionWrapper>

        <SectionWrapper delay={0.3}>
          <JourneySection journeys={journeys} />
        </SectionWrapper>

        <SectionWrapper delay={0.4}>
          <PhilosophySection philosophies={philosophies} />
        </SectionWrapper>
      </main>
    </div>
  );
};

export default PersonalStorySection;
