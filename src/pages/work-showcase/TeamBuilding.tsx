import PillNav from "../../components/ui/PillNav";
import Footer from "../../components/ui/Footer";
import LogoImg from "../../components/Logo.png";
import Questionnaire from "./components/Questionnaire";
import HRDCorBanner from "./components/HRDCorBanner";
import ActivityCards, { Activity } from "./components/ActivityCards";
import TeamBuildingHero from "./components/TeamBuildingHero";
import TeamWorkshopImg from "../../assets/team_building/team_workshop.png";
import VirtualTeamEventsImg from "../../assets/team_building/virtual_team_events.png";
import AdventureActivitiesImg from "../../assets/team_building/adventures_activities.png";
import HikingImg from "../../assets/team_building/hiking.jpg";
import Obstacles from "../../assets/team_building/obstacles.jpg";
import SurvivalChallengeImg from "../../assets/team_building/survival.jpg";
import TreasureHuntImg from "../../assets/team_building/treasure_hunt.jpg";
import CommunicationImg from "../../assets/team_building/communication.png";
import WorkshopImg from "../../assets/team_building/workshop.png";
import LeadershipImg from "../../assets/team_building/leadership.png";
import LabsImg from "../../assets/team_building/solving.png";
import RemoteImg from "../../assets/team_building/remote.jpg";
import ScavengerImg from "../../assets/team_building/scavenger.jpg";
import EscapeImg from "../../assets/team_building/escape.png";
import TriviaImg from "../../assets/team_building/trivia.png";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import ClientMarquee from '../../pages/personal-story-section/components/ClientMarquee';

const teamBuildingActivities: Activity[] = [
  {
    id: "workshop",
    title: "Team Workshops",
    shortDescription:
      "Interactive sessions designed to enhance team dynamics and skills",
    longDescription:
      "Customized workshops that focus on communication, problem-solving, and leadership skills while building stronger team bonds.",
    backgroundImage: TeamWorkshopImg,
    highlights: [
      "Tailored content",
      "Hands-on activities",
      "Expert facilitators",
      "Measurable outcomes",
    ],
  },
  {
    id: "adventure",
    title: "Adventure Activities",
    shortDescription: "Outdoor experiences that build trust and confidence",
    longDescription:
      "Exciting outdoor adventures including obstacle courses, team challenges, and nature-based activities that push boundaries and build trust.",
    backgroundImage: AdventureActivitiesImg,
    highlights: [
      "Physical challenges",
      "Trust building",
      "Adrenaline rush",
      "Team bonding",
    ],
  },
  {
    id: "virtual",
    title: "Virtual Team Events",
    shortDescription: "Online experiences for remote and hybrid teams",
    longDescription:
      "Engaging virtual activities including online games, trivia, escape rooms, and interactive sessions perfect for distributed teams.",
    backgroundImage: VirtualTeamEventsImg,
    highlights: [
      "Flexible scheduling",
      "Global reach",
      "Easy participation",
      "Fun & engaging",
    ],
  },
];

const detailedActivities = [
  {
    category: "Adventure Activities",
    mainImage: AdventureActivitiesImg,
    subItems: [
      { name: "Mountain Hiking", desc: "Scale new heights and foster peak performance through guided nature treks that challenge your team physically and mentally.", img: HikingImg },
      { name: "Treasure Hunt", desc: "A high-stakes urban or jungle race requiring strategy, collaboration, and rapid problem-solving under pressure.", img: TreasureHuntImg },
      { name: "Survival Challenge", desc: "Build raw trust and resilience through fire-starting, shelter-building, and wilderness navigation simulations.", img: SurvivalChallengeImg },
      { name: "Obstacle Course", desc: "Navigate challenging physical barriers that require teamwork, communication, and unwavering mutual support.", img: Obstacles },
    ]
  },
  {
    category: "Team Workshops",
    mainImage: TeamWorkshopImg,
    subItems: [
      { name: "Communication Mastery", desc: "Interactive sessions that break down communication barriers and build authentic connections across your organization.", img: CommunicationImg },
      { name: "Leadership Development", desc: "Transform potential into performance with hands-on leadership training that creates confident, capable team leaders.", img: LeadershipImg },
      { name: "Problem-Solving Labs", desc: "Collaborative exercises that sharpen critical thinking and creative solution-finding under real-world constraints.", img: LabsImg },
      { name: "Innovation Workshops", desc: "Unlock creative potential through design thinking exercises and innovation frameworks that drive breakthrough ideas.", img: WorkshopImg },
    ]
  },
  {
    category: "Virtual Team Events",
    mainImage: VirtualTeamEventsImg,
    subItems: [
      { name: "Online Escape Rooms", desc: "Digital adventures that require coordination, communication, and clever thinking to solve puzzles and 'escape' together.", img: EscapeImg },
      { name: "Virtual Trivia Night", desc: "Competitive team trivia sessions that spark friendly rivalry and celebrate diverse knowledge across your workforce.", img: TriviaImg },
      { name: "Remote Team Games", desc: "Engaging online activities from drawing challenges to murder mysteries that keep distributed teams connected and energized.", img: RemoteImg },
      { name: "Digital Scavenger Hunt", desc: "Tech-powered treasure hunts that blend physical and digital worlds for hybrid team engagement.", img: ScavengerImg },
    ]
  },
];

type DetailCardProps = {
  item: { name: string; desc: string; img: string };
  index: number;
};

const DetailCard: React.FC<DetailCardProps> = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[400px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content - Simple text overlay at bottom */}
      <div className="relative h-full p-6 flex flex-col justify-end">
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {item.name}
        </h3>
      </div>
    </motion.div>
  );
};

type DetailedSectionProps = {
  categoryData: {
    category: string;
    mainImage: string;
    subItems: Array<{ name: string; desc: string; img: string }>;
  };
  index: number;
};

const DetailedSection: React.FC<DetailedSectionProps> = ({ categoryData, index }) => {
  const backgrounds = [
    "bg-gray-100",
    "bg-gradient-to-br from-blue-50 to-indigo-50",
    "bg-white"
  ];

  const bgClass = backgrounds[index % backgrounds.length];

  return (
    <div className={`py-24 px-6 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[#4a90e2] uppercase tracking-tight mb-6"
          >
            {categoryData.category}
          </motion.h2>
        </div>

        {/* Horizontal Grid of Cards - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.subItems.map((item, idx) => (
            <DetailCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamBuilding = () => {
  const [clients, setClients] = useState<string[]>([]);
  const clientSectionRef = useRef(null);

  // Parallax Scroll Logic for floating background elements
  const { scrollYProgress } = useScroll({
    target: clientSectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('client_logos')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const logoUrls = data.map(logo => logo.logo_url);
          setClients(logoUrls);
          console.log('Fetched client logos:', logoUrls);
        } else {
          console.log('No active client logos found');
        }
      } catch (error) {
        console.error('Error fetching client logos:', error);
      }
    };

    fetchClientLogos();
  }, []);

  return (
    <>
      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: "Home", href: "/personal-story-section" },
          { label: "Services", href: "/work-showcase" },
          { label: "Connect", href: "/connection-hub" },
        ]}
        activeHref={"/work-showcase"}
      />
      <TeamBuildingHero />
      <HRDCorBanner />
      <section id="team-building-activities" className="py-20 px-8">
        <style>{`
        @keyframes activitiesTitleSlide {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes activitiesAccentGlow {
          0%, 100% {
            width: 48px;
            opacity: 0.6;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
        }
        .activities-title {
          position: relative;
          display: inline-block;
          padding-bottom: 12px;
          animation: activitiesTitleSlide 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .activities-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f68921 0%, #fcb22f 100%);
          animation: activitiesAccentGlow 2.4s ease-in-out infinite;
        }
        .activities-highlight {
          background: linear-gradient(90deg, #f68921 0%, #fcb22f 100%);
          -webkit-background-clip: text;
          color: transparent;
          animation: activitiesTitleSlide 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
      `}</style>
        <div className="max-w-7xl mx-auto mb-10 flex flex-col gap-12">
          <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-[#fcb22f] font-bold uppercase tracking-[0.25em] text-sm block mb-4">
                Our Activities
              </span>
              <h2 className="activities-title text-4xl md:text-5xl font-black text-[#153462] leading-tight uppercase tracking-tighter">
                <span className="whitespace-nowrap">Elevate Your Team,</span>
                <br />
                <span className="activities-highlight">Inspire Success.</span>
              </h2>
            </div>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed md:max-w-xl text-center md:text-left md:pb-5">
              Explore our diverse range of team building activities designed to
              energize culture, strengthen trust, and align teams around shared
              goals.
            </p>
          </div>
          <ActivityCards activities={teamBuildingActivities} />
        </div>
      </section>

      {/* --- DETAILED DEEP DIVE --- */}
      <section className="bg-white">
        {detailedActivities.map((cat, i) => (
          <DetailedSection key={i} categoryData={cat} index={i} />
        ))}
      </section>

      {/* --- WHO WE WORKED WITH --- */}
      {clients.length > 0 && (
        <section 
          ref={clientSectionRef}
          className="relative py-20 px-8 bg-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-[#f68921] mb-4">
                Trusted Partnerships
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tight">
                Who We Worked With
              </h2>
              <div className="h-1 w-96 mx-auto bg-gradient-to-r from-transparent via-[#4a90e2] to-transparent" />
            </motion.div>

            <div className="relative">
              <ClientMarquee
                logos={clients}
                autoScrollSpeed={0.5}
                pauseOnHover={true}
              />
            </div>
          </div>
        </section>
      )}

      <section id="team-building-questionnaire" className="pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-[#fcb22f] font-bold uppercase tracking-[0.35em] text-xs sm:text-sm block mb-4">
              Plan Your Session
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#153462] leading-tight uppercase tracking-tight mb-4">
              Craft an Experience That Fits Your Team
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">
              Tell us about your goals, group dynamics, and timelines. We will build a tailored programme that energizes your people and delivers measurable outcomes.
            </p>
          </div>
          <Questionnaire formType="team_building" />
        </div>
      </section>
      <Footer />
    </>
    
  )
};

export default TeamBuilding;
