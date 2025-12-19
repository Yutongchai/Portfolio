import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import CoreValuesSection from './components/CoreValuesSection';
import SkillsSection from './components/SkillsSection';
import JourneySection from './components/JourneySection';
import PhilosophySection from './components/PhilosophySection';
import ParallaxBackground from './components/ParallaxBackground';
import SectionWrapper from './components/SectionWrapper';
import { PersonalInfo, CoreValue, Skill, Journey, Philosophy } from './types';

const PersonalStorySection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const personalInfo: PersonalInfo = {
    name: "Alexandra Chen",
    title: "Creative Technologist & Design Engineer",
    tagline: "Bridging the gap between imagination and implementation",
    bio: "I'm a passionate creator who believes that the best digital experiences are born at the intersection of elegant design and robust engineering. With over 8 years of experience crafting interactive web experiences, I've learned that great work comes from understanding both the art and science of the web.",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11094aa78-1763296768439.png",
    alt: "Professional woman with dark hair in casual business attire smiling confidently at camera in modern office setting with natural lighting"
  };

  const coreValues: CoreValue[] = [
  {
    id: 1,
    icon: "Sparkles",
    title: "Craft & Detail",
    description: "Every pixel, every interaction, every line of code matters. I believe that attention to detail is what separates good work from exceptional work."
  },
  {
    id: 2,
    icon: "Users",
    title: "Human-Centered",
    description: "Technology should serve people, not the other way around. I design and build with empathy, always keeping the end user at the heart of every decision."
  },
  {
    id: 3,
    icon: "Zap",
    title: "Performance First",
    description: "Beautiful design means nothing if it doesn't load fast. I optimize relentlessly to ensure every experience is smooth, responsive, and accessible."
  },
  {
    id: 4,
    icon: "Lightbulb",
    title: "Continuous Learning",
    description: "The web evolves constantly, and so do I. I'm committed to staying current with emerging technologies and design trends to deliver cutting-edge solutions."
  }];


  const skills: Skill[] = [
  { id: 1, name: "React & Next.js", level: 95, category: "Frontend Development" },
  { id: 2, name: "TypeScript", level: 90, category: "Frontend Development" },
  { id: 3, name: "Tailwind CSS", level: 92, category: "Frontend Development" },
  { id: 4, name: "Framer Motion", level: 88, category: "Frontend Development" },
  { id: 5, name: "UI/UX Design", level: 85, category: "Design" },
  { id: 6, name: "Figma & Adobe XD", level: 90, category: "Design" },
  { id: 7, name: "Design Systems", level: 87, category: "Design" },
  { id: 8, name: "Prototyping", level: 83, category: "Design" },
  { id: 9, name: "Node.js & Express", level: 80, category: "Backend Development" },
  { id: 10, name: "REST APIs", level: 85, category: "Backend Development" },
  { id: 11, name: "Database Design", level: 78, category: "Backend Development" },
  { id: 12, name: "Git & CI/CD", level: 88, category: "Backend Development" }];


  const journeys: Journey[] = [
  {
    id: 1,
    year: "2016",
    title: "The Beginning",
    description: "Started my journey as a self-taught developer, building my first website and falling in love with the creative possibilities of code. Spent countless nights learning HTML, CSS, and JavaScript fundamentals.",
    icon: "Rocket"
  },
  {
    id: 2,
    year: "2018",
    title: "Professional Breakthrough",
    description: "Joined a fast-growing startup as a junior frontend developer. Learned to work in agile teams, contribute to production codebases, and understand the business side of technology.",
    icon: "Briefcase"
  },
  {
    id: 3,
    year: "2020",
    title: "Design Awakening",
    description: "Discovered my passion for design and began studying UX principles, typography, and visual design. Started bridging the gap between design and development in my projects.",
    icon: "Palette"
  },
  {
    id: 4,
    year: "2022",
    title: "Leadership & Mentorship",
    description: "Promoted to senior developer role, leading a team of talented engineers. Found joy in mentoring junior developers and helping them grow their skills and confidence.",
    icon: "Users"
  },
  {
    id: 5,
    year: "2024",
    title: "Independent Creator",
    description: "Launched my freelance practice to work on diverse projects and collaborate with innovative teams. Focusing on creating exceptional digital experiences that make a real impact.",
    icon: "Star"
  }];


  const philosophies: Philosophy[] = [
  {
    id: 1,
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    context: "This quote reminds me that beautiful interfaces mean nothing without thoughtful functionality and user experience."
  },
  {
    id: 2,
    quote: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    context: "I strive to write clean, self-documenting code that other developers can understand and maintain easily."
  },
  {
    id: 3,
    quote: "The details are not the details. They make the design.",
    author: "Charles Eames",
    context: "Every micro-interaction, every animation timing, every color choice contributes to the overall experience."
  },
  {
    id: 4,
    quote: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
    context: "Simplicity is the ultimate sophistication. I believe in removing complexity, not adding features."
  },
  {
    id: 5,
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    context: "This three-step approach guides my development process, ensuring functionality, quality, and performance."
  },
  {
    id: 6,
    quote: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
    context: "The best interfaces disappear, allowing users to focus on their goals rather than figuring out how to use the tool."
  }];


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
          <SkillsSection skills={skills} />
        </SectionWrapper>
        
        <SectionWrapper delay={0.3}>
          <JourneySection journeys={journeys} />
        </SectionWrapper>
        
        <SectionWrapper delay={0.4}>
          <PhilosophySection philosophies={philosophies} />
        </SectionWrapper>
      </main>
    </div>);

};

export default PersonalStorySection;