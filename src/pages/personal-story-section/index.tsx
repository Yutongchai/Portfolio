import { useEffect } from "react";
import { Helmet } from "react-helmet";
import myPhoto from "../../components/mainPic.jpg";
import Footer from "../../components/ui/Footer";
import HeroSection from "./components/HeroSection";
import BeliefsValuesSection from "./components/BeliefsValuesSection";
import ActionsSection from "./components/ActionsSection";
import OurRoleSection from "./components/OurRoleSection";
import JourneySection from "./components/JourneySection";
import PhilosophySection from "./components/PhilosophySection";
import SectionWrapper from "./components/SectionWrapper";
import CorePrinciple from "./components/CorePrinciple";
import { PersonalInfo, Journey, Philosophy } from "./types";

const PersonalStorySection = () => {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Handle hash navigation for direct links
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const personalInfo: PersonalInfo = {
    name: "EITO Group",
    title:
      "We Build Unforgettable Team Experiences — For People, For Culture, For Growth.",
    tagline: " ",
    bio: " When people connect, companies grow. ",
    image: myPhoto, // Use your local image
    alt: "A diverse group of professionals participating in a fun team-building activity, smiling and collaborating together.",
  };


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
        <link rel="icon" type="image/webp" href="/Portfolio/EITO-bw.webp" />
      </Helmet>
      <div className="min-h-screen bg-background relative">
        <main className="relative z-10">
          <HeroSection personalInfo={personalInfo} />

          <SectionWrapper delay={0.1}>
            <BeliefsValuesSection />
          </SectionWrapper>

          <CorePrinciple />
          <ActionsSection />
          {/* <SectionWrapper delay={0.3}>
            <OurRoleSection />
          </SectionWrapper> */}


          {/*  <SectionWrapper delay={0.5}>
            <div className="py-20 px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Ready to See What We've Done?
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                  Explore our portfolio of memorable team experiences, successful workshops, and transformative events.
                </p>
                <a
                  href="/work-showcase"
                  className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-primary text-accent-foreground font-semibold px-10 py-5 rounded-xl shadow-button hover:shadow-accent transition-all duration-300 hover:scale-105 text-lg"
                >
                  <span>View Our Work</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            </div>
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
