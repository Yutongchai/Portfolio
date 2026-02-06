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

const TeamBuilding = () => (
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
    <section id="team-building-questionnaire" className="py-20 px-8 bg-white">
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
);

export default TeamBuilding;
