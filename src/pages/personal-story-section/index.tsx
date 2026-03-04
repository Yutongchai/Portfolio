import { useEffect } from "react";
import { Helmet } from "react-helmet";
import myPhoto from "../../components/mainPic.jpg";
import Footer from "../../components/ui/Footer";
import HeroSection from "./components/HeroSection";
import BeliefsValuesSection from "./components/BeliefsValuesSection";
import ActionsSection from "./components/ActionsSection";
import JourneySection from "./components/JourneySection";
import PhilosophySection from "./components/PhilosophySection";
import SectionWrapper from "./components/SectionWrapper";
import CorePrinciple from "./components/CorePrinciple";
import { PersonalInfo, Journey, Philosophy } from "./types";

const PersonalStorySection = () => {
  // Removed per-section loader — Home.tsx already shows a page-level
  // PageLoader that waits for fonts + hero image. A second loader here
  // caused a sequential 400 ms+ extra delay on every page load.

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
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
    image: myPhoto,
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

          <BeliefsValuesSection />

          <CorePrinciple />
          <ActionsSection />

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