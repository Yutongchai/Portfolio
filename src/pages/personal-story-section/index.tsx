import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import myPhoto from "../../components/mainPic.jpg";
import { motion, useScroll, useSpring } from "framer-motion";
import PillNav from "../../components/ui/PillNav";
import Footer from "../../components/ui/Footer";
import LogoImg from "../../components/Logo.png";
import HeroSection from "./components/HeroSection";
import BeliefsValuesSection from "./components/BeliefsValuesSection";
import SolutionsSection from "./components/SolutionsSection";
import OurRoleSection from "./components/OurRoleSection";
import JourneySection from "./components/JourneySection";
import PhilosophySection from "./components/PhilosophySection";
import SectionWrapper from "./components/SectionWrapper";
import { PersonalInfo, Journey, Philosophy } from "./types";

const PersonalStorySection = () => {
  const location = useLocation();
  
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
    title:
      "We Build Unforgettable Team Experiences — For People, For Culture, For Growth.",
    tagline: " ",
    bio: "When people connect, companies grow. ",
    image: myPhoto, // Use your local image
    alt: "A diverse group of professionals participating in a fun team-building activity, smiling and collaborating together.",
  };

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
    <>
      <Helmet>
        <title>EITO Group</title>
        <link rel="icon" type="image/png" href="/Portfolio/EITO bw.png" />
      </Helmet>
      <div className="min-h-screen bg-background relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />

      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: 'Story', href: '/personal-story-section' },
          { label: 'Work', href: '/work-showcase' },
          { label: 'Connect', href: '/connection-hub' }
        ]}
        activeHref={location.pathname}
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#000000"
        pillTextColor="#000000"
        initialLoadAnimation={false}
      />

      <main className="pt-20 relative z-10">
        <HeroSection personalInfo={personalInfo} />

        <SectionWrapper delay={0.1}>
          <BeliefsValuesSection />
        </SectionWrapper>

        <SectionWrapper delay={0.2}>
          <SolutionsSection />
        </SectionWrapper>

        <SectionWrapper delay={0.25}>
          <OurRoleSection />
        </SectionWrapper>

   {/*      <SectionWrapper delay={0.3}>
          <JourneySection journeys={journeys} />
        </SectionWrapper> */}

        <SectionWrapper delay={0.4}>
          <PhilosophySection philosophies={philosophies} />
        </SectionWrapper>
      </main>

      <Footer />
      </div>
    </>
  );
};

export default PersonalStorySection;
