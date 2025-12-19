
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import EnergeticHero from './components/EnergeticHero';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ProjectFilters from './components/ProjectFilters';
import ProjectStats from './components/ProjectStats';
import { Project, FilterOption, SortOption } from './types';
import { Button } from '../../components/ui/Button';

// Import images and video as ES modules
import differentImg from '../../components/different.jpg';
import collageImg from '../../components/collage.jpg';
import mainPicImg from '../../components/mainPic.jpg';
import trainingImg from '../../components/training.jpg';
import discussImg from '../../components/discuss.jpg';
import stationGamesVideo from '../../components/station_games.mp4';
import teamworkImg from '../../components/teamwork.jpg';


const WorkShowcase = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const projects: Project[] = [
    {
      id: 'csr',
      title: 'CSR Initiative',
      category: 'Corporate Social Responsibility',
      description: 'Empowering teams to make a positive impact through community service and social responsibility projects.',
      longDescription: 'Our CSR programs engage teams in meaningful activities that benefit local communities, foster empathy, and build a sense of purpose. From volunteering to fundraising, we help organizations create lasting change together.',
      image: differentImg,
      alt: 'Team participating in a CSR event outdoors',
      technologies: ['Community Engagement', 'Volunteering', 'Fundraising'],
      year: '2025',
      client: 'GlobalCorp',
      role: 'CSR Facilitator',
      duration: '3 months',
      challenge: 'Engaging employees in CSR activities while balancing work commitments.',
      solution: 'Designed flexible, gamified CSR events that fit team schedules and maximized participation.',
      outcome: 'Increased employee engagement by 50% and raised $20,000 for local charities.',
      metrics: [
        { label: 'Engagement Increase', value: '50%', icon: 'TrendingUp' },
        { label: 'Funds Raised', value: '$20,000', icon: 'Gift' }
      ],
      testimonial: {
        quote: 'The CSR program brought our team closer and made a real difference in our community.',
        author: 'Emily Chen',
        position: 'HR Manager',
        company: 'GlobalCorp',
        avatar: mainPicImg,
        alt: 'Smiling woman at CSR event'
      },
      gallery: [
        { url: differentImg, alt: 'CSR event group photo', caption: 'Group Photo' },
        { url: collageImg, alt: 'Collage of CSR activities', caption: 'Activities Collage' }
      ],
      featured: true
    },
    {
      id: 'gamified',
      title: 'Gamified Training',
      category: 'Training & Development',
      description: 'Boosting learning outcomes with interactive, game-based training modules for teams.',
      longDescription: 'Our gamified training solutions use challenges, leaderboards, and rewards to make learning fun and effective. Teams collaborate, compete, and grow their skills in a dynamic environment.',
      image: trainingImg,
      alt: 'Team engaged in gamified training session',
      technologies: ['Gamification', 'eLearning', 'Team Challenges'],
      year: '2025',
      client: 'EduTech',
      role: 'Training Designer',
      duration: '2 months',
      challenge: 'Making training engaging for remote and in-person teams.',
      solution: 'Developed hybrid modules with interactive games and real-time feedback.',
      outcome: 'Training completion rates rose to 95% and team satisfaction improved.',
      metrics: [
        { label: 'Completion Rate', value: '95%', icon: 'CheckCircle' },
        { label: 'Satisfaction', value: 'High', icon: 'Smile' }
      ],
      testimonial: {
        quote: 'The gamified training kept everyone motivated and made learning enjoyable.',
        author: 'Michael Lee',
        position: 'Team Lead',
        company: 'EduTech',
        avatar: discussImg,
        alt: 'Team lead at training session'
      },
      gallery: [
        { url: trainingImg, alt: 'Training session', caption: 'Training Session' },
        { url: stationGamesVideo, alt: 'Gamified video', caption: 'Training Video' }
      ],
      featured: true
    },
    {
      id: 'teambuilding',
      title: 'Team Building Adventure',
      category: 'Team Building',
      description: 'Strengthening collaboration and trust through immersive team building experiences.',
      longDescription: 'Our team building adventures are designed to challenge, inspire, and unite teams. From outdoor activities to creative workshops, we help teams discover new strengths and build lasting bonds.',
      image: teamworkImg,
      alt: 'Team working together outdoors',
      technologies: ['Collaboration', 'Workshops', 'Outdoor Activities'],
      year: '2025',
      client: 'InnovateX',
      role: 'Team Building Coach',
      duration: '1 month',
      challenge: 'Encouraging collaboration among diverse team members.',
      solution: 'Facilitated activities that promoted communication and trust.',
      outcome: 'Team performance improved and feedback was overwhelmingly positive.',
      metrics: [
        { label: 'Performance Boost', value: '30%', icon: 'TrendingUp' },
        { label: 'Positive Feedback', value: '98%', icon: 'ThumbsUp' }
      ],
      testimonial: {
        quote: 'The team building adventure was transformative for our group.',
        author: 'Samantha Wong',
        position: 'Project Manager',
        company: 'InnovateX',
        avatar: teamworkImg,
        alt: 'Project manager at team building event'
      },
      gallery: [
        { url: teamworkImg, alt: 'Teamwork outdoors', caption: 'Outdoor Teamwork' },
        { url: collageImg, alt: 'Team building collage', caption: 'Event Collage' }
      ],
      featured: true
    }
  ];


  const categories: FilterOption[] = useMemo(() => {
    const categoryMap = new Map<string, number>();

    projects.forEach((project) => {
      const count = categoryMap.get(project.category) || 0;
      categoryMap.set(project.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([value, count]) => ({
      value,
      label: value,
      count
    }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => b.year.localeCompare(a.year));
      case 'featured':
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
      case 'alphabetical':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [projects, selectedCategory, sortBy]);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <Helmet>
        <title>Work Showcase - Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of web development projects, mobile applications, and digital solutions. View detailed case studies and technical implementations." />

      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <EnergeticHero />

        <main className="pt-32 pb-20 px-6 lg:px-12" id="projects-section">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16">

              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Icon name="Briefcase" size={16} />
                <span>Featured Work</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Project Showcase
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore a curated collection of projects that demonstrate
                technical expertise, creative problem-solving, and commitment to
                delivering exceptional digital experiences.
              </p>
            </motion.div>

            <ProjectStats
              totalProjects={projects.length}
              filteredCount={filteredProjects.length}
              categories={categories.length} />


            <ProjectFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy} />


            {filteredProjects.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) =>
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails} />

              )}
              </div> :

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20">

                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <Icon name="Search" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No Projects Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSortBy('featured');
                }}>

                  Reset Filters
                </Button>
              </motion.div>
            }

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20 text-center">

              <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Interested in Working Together?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's discuss how we can bring your ideas to life with
                  innovative solutions and exceptional execution.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-accent hover:bg-cta text-accent-foreground font-semibold"
                  iconName="Mail"
                  iconPosition="right"
                  onClick={() => window.location.href = '/connection-hub'}>

                  Start a Conversation
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal} />

      </div>
    </>);

};

export default WorkShowcase;