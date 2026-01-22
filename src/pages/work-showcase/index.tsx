import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Carousel, Card } from "./components/ProjectCarousel";
import EnergeticHero from "./components/EnergeticHero";
import { Project } from "./types";
import { Button } from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

// Import images and video as ES modules
import differentImg from "../../components/different.jpg";
import collageImg from "../../components/collage.jpg";
import mainPicImg from "../../components/mainPic.jpg";
import trainingImg from "../../components/training.jpg";
import discussImg from "../../components/discuss.jpg";
import stationGamesVideo from "../../components/station_games.mp4";
import teamworkImg from "../../components/teamwork.jpg";

const WorkShowcase = () => {
  const navigate = useNavigate();

  const projects: Project[] = [
    {
      id: "csr",
      title: "Advelsoft",
      category: "Team Building",
      description:
        "Empowering teams to make a positive impact through community service and social responsibility projects.",
      longDescription:
        "Our CSR programs engage teams in meaningful activities that benefit local communities, foster empathy, and build a sense of purpose. From volunteering to fundraising, we help organizations create lasting change together.",
      image: "/Portfolio/events/_JIN3517.jpg",
      alt: "Team participating in a CSR event outdoors",
      technologies: ["Community Engagement", "Volunteering", "Fundraising"],
      year: "2025",
      client: "GlobalCorp",
      role: "CSR Facilitator",
      duration: "3 months",
      challenge:
        "Engaging employees in CSR activities while balancing work commitments.",
      solution:
        "Designed flexible, gamified CSR events that fit team schedules and maximized participation.",
      outcome:
        "Increased employee engagement by 50% and raised $20,000 for local charities.",
      metrics: [
        { label: "Engagement Increase", value: "50%", icon: "TrendingUp" },
        { label: "Funds Raised", value: "$20,000", icon: "Gift" },
      ],
      testimonial: {
        quote:
          "The CSR program brought our team closer and made a real difference in our community.",
        author: "Emily Chen",
        position: "HR Manager",
        company: "GlobalCorp",
        avatar: mainPicImg,
        alt: "Smiling woman at CSR event",
      },
      gallery: [
       
        {
          url: "/Portfolio/events/_JIN3347.jpg",
          alt: "Team celebrating with raised fists",
          caption: "Team Victory",
        },
        {
          url: "/Portfolio/events/_JIN3300.jpg",
          alt: "Team hands forming huddle with wristbands",
          caption: "Team Unity",
        },
        {
          url: "/Portfolio/events/_JIN3303.jpg",
          alt: "Team members at workshop table",
          caption: "Workshop Session",
        },
        {
          url: "/Portfolio/events/_JIN3367.jpg",
          alt: "Team engaged in sorting activity",
          caption: "Team Challenge",
        },
      ],
      featured: true,
    },
    {
      id: "gamified",
      title: "Gamified Training",
      category: "Training & Development",
      description:
        "Boosting learning outcomes with interactive, game-based training modules for teams.",
      longDescription:
        "Our gamified training solutions use challenges, leaderboards, and rewards to make learning fun and effective. Teams collaborate, compete, and grow their skills in a dynamic environment.",
      image: trainingImg,
      alt: "Team engaged in gamified training session",
      technologies: ["Gamification", "eLearning", "Team Challenges"],
      year: "2025",
      client: "EduTech",
      role: "Training Designer",
      duration: "2 months",
      challenge: "Making training engaging for remote and in-person teams.",
      solution:
        "Developed hybrid modules with interactive games and real-time feedback.",
      outcome:
        "Training completion rates rose to 95% and team satisfaction improved.",
      metrics: [
        { label: "Completion Rate", value: "95%", icon: "CheckCircle" },
        { label: "Satisfaction", value: "High", icon: "Smile" },
      ],
      testimonial: {
        quote:
          "The gamified training kept everyone motivated and made learning enjoyable.",
        author: "Michael Lee",
        position: "Team Lead",
        company: "EduTech",
        avatar: discussImg,
        alt: "Team lead at training session",
      },
      gallery: [
        {
          url: trainingImg,
          alt: "Training session",
          caption: "Training Session",
        },
        {
          url: stationGamesVideo,
          alt: "Gamified video",
          caption: "Training Video",
        },
      ],
      featured: true,
    },
    {
      id: "teambuilding",
      title: "Team Building Adventure",
      category: "Team Building",
      description:
        "Strengthening collaboration and trust through immersive team building experiences.",
      longDescription:
        "Our team building adventures are designed to challenge, inspire, and unite teams. From outdoor activities to creative workshops, we help teams discover new strengths and build lasting bonds.",
      image: teamworkImg,
      alt: "Team working together outdoors",
      technologies: ["Collaboration", "Workshops", "Outdoor Activities"],
      year: "2025",
      client: "InnovateX",
      role: "Team Building Coach",
      duration: "1 month",
      challenge: "Encouraging collaboration among diverse team members.",
      solution: "Facilitated activities that promoted communication and trust.",
      outcome:
        "Team performance improved and feedback was overwhelmingly positive.",
      metrics: [
        { label: "Performance Boost", value: "30%", icon: "TrendingUp" },
        { label: "Positive Feedback", value: "98%", icon: "ThumbsUp" },
      ],
      testimonial: {
        quote: "The team building adventure was transformative for our group.",
        author: "Samantha Wong",
        position: "Project Manager",
        company: "InnovateX",
        avatar: teamworkImg,
        alt: "Project manager at team building event",
      },
      gallery: [
        {
          url: teamworkImg,
          alt: "Teamwork outdoors",
          caption: "Outdoor Teamwork",
        },
        {
          url: collageImg,
          alt: "Team building collage",
          caption: "Event Collage",
        },
      ],
      featured: true,
    },
  ];

  const cards = projects.map((project) => ({
    src: project.image,
    title: project.title,
    category: project.category,
    content: (
      <div className="space-y-6">
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          {project.longDescription}
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Client
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {project.client}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Duration
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {project.duration}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Year
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {project.year}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Challenge
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {project.challenge}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Solution
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {project.solution}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Outcome
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {project.outcome}
          </p>
        </div>

        {project.metrics && (
          <div className="grid grid-cols-2 gap-4">
            {project.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4"
              >
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {metric.value}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {project.testimonial && (
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6 mt-6">
            <p className="text-sm italic text-neutral-700 dark:text-neutral-300 mb-4">
              "{project.testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={project.testimonial.avatar}
                alt={project.testimonial.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {project.testimonial.author}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {project.testimonial.position} at{" "}
                  {project.testimonial.company}
                </p>
              </div>
            </div>
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Gallery
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
              {project.gallery.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-64 snap-center">
                  <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    {item.url.endsWith(".mp4") ? (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  {item.caption && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-center">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <>
      <Helmet>
        <title>EITO Group</title>
        <link rel="icon" type="image/png" href="/Portfolio/EITO bw.png" />
        <meta
          name="description"
          content="Explore our portfolio of team building projects and corporate services. View detailed case studies and successful implementations."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EnergeticHero />

        <main
          className="pt-20 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-12"
          id="projects-section"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Project Showcase
              </h1>

              {/* <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
                Explore a curated collection of projects that demonstrate
                technical expertise, creative problem-solving, and commitment to
                delivering exceptional digital experiences.
              </p> */}
            </motion.div>

            <Carousel
              items={cards.map((card, index) => (
                <Card
                  key={card.title}
                  card={card}
                  index={index}
                  layout={true}
                />
              ))}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 sm:mt-20 text-center"
            >
              <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-xl sm:rounded-2xl p-6 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  Interested in Working Together?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Let's discuss how we can bring your ideas to life with
                  innovative solutions and exceptional execution.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-accent hover:bg-cta text-accent-foreground font-semibold text-sm sm:text-base"
                  iconName="Mail"
                  iconPosition="right"
                  onClick={() => navigate("/connection-hub")}
                >
                  Start a Conversation
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkShowcase;
