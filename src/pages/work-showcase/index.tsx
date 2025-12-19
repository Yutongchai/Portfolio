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


const WorkShowcase = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    category: 'Web Development',
    description:
    'Complete redesign and development of a modern e-commerce platform with advanced filtering and checkout experience.',
    longDescription:
    'A comprehensive overhaul of an existing e-commerce platform, focusing on user experience, performance optimization, and conversion rate improvement through data-driven design decisions.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb7c1cb3-1764655134961.png",
    alt: 'Modern e-commerce website interface displayed on laptop screen showing product grid and shopping cart',
    technologies: [
    'React',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Stripe',
    'Tailwind CSS'],

    year: '2024',
    client: 'RetailCo',
    role: 'Lead Frontend Developer',
    duration: '6 months',
    challenge:
    'The existing platform had a 68% cart abandonment rate and slow page load times. Users reported confusion during checkout and difficulty finding products.',
    solution:
    'Implemented a progressive web app architecture with server-side rendering, optimized images and assets, redesigned the checkout flow with clear progress indicators, and added advanced filtering with real-time search.',
    outcome:
    'Reduced cart abandonment by 42%, improved page load times by 65%, and increased conversion rates by 38%. The new platform handles 3x more concurrent users with improved stability.',
    metrics: [
    { label: 'Cart Abandonment Reduction', value: '42%', icon: 'TrendingDown' },
    { label: 'Page Load Improvement', value: '65%', icon: 'Zap' },
    { label: 'Conversion Rate Increase', value: '38%', icon: 'TrendingUp' }],

    testimonial: {
      quote:
      'The redesign exceeded our expectations. Our customers love the new interface, and our sales have increased significantly. The attention to detail and technical expertise was outstanding.',
      author: 'Sarah Johnson',
      position: 'CEO',
      company: 'RetailCo',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0530897-1765819738200.png",
      alt: 'Professional woman with blonde hair in business attire smiling at camera'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1d1b043b3-1764663837267.png",
      alt: 'E-commerce homepage with featured products and promotional banners',
      caption: 'Homepage Design'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_17c6bc05f-1764867260302.png",
      alt: 'Product detail page showing high-quality images and specifications',
      caption: 'Product Detail Page'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_16f39f813-1764818658418.png",
      alt: 'Shopping cart interface with order summary and payment options',
      caption: 'Checkout Experience'
    }],

    link: 'https://example.com',
    featured: true
  },
  {
    id: '2',
    title: 'Healthcare Management System',
    category: 'Web Application',
    description:
    'Comprehensive patient management system with appointment scheduling, medical records, and telemedicine capabilities.',
    longDescription:
    'A HIPAA-compliant healthcare management platform designed to streamline patient care, reduce administrative burden, and enable remote consultations.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a07fec34-1764641716124.png",
    alt: 'Medical professional using tablet displaying patient health records and appointment schedule',
    technologies: [
    'React',
    'TypeScript',
    'Express',
    'PostgreSQL',
    'WebRTC',
    'AWS'],

    year: '2024',
    client: 'MediCare Plus',
    role: 'Full Stack Developer',
    duration: '8 months',
    challenge:
    'The clinic was managing patient records through multiple disconnected systems, leading to data inconsistencies and scheduling conflicts. No telemedicine capabilities existed.',
    solution:
    'Built a unified platform with real-time appointment scheduling, secure medical record storage with encryption, integrated video consultation system, and automated appointment reminders.',
    outcome:
    'Reduced administrative time by 55%, eliminated scheduling conflicts, enabled 200+ successful telemedicine consultations monthly, and improved patient satisfaction scores by 47%.',
    metrics: [
    { label: 'Admin Time Saved', value: '55%', icon: 'Clock' },
    { label: 'Monthly Consultations', value: '200+', icon: 'Video' },
    { label: 'Patient Satisfaction', value: '47%', icon: 'Heart' }],

    testimonial: {
      quote:
      'This system has transformed how we operate. Our staff is more efficient, patients are happier, and we can now serve patients remotely. It is been a game-changer for our practice.',
      author: 'Dr. Michael Chen',
      position: 'Medical Director',
      company: 'MediCare Plus',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_194e533c3-1763301316823.png",
      alt: 'Asian male doctor in white coat with stethoscope smiling professionally'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a07fec34-1764641716124.png",
      alt: 'Dashboard showing patient appointments and health metrics',
      caption: 'Dashboard Overview'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_127c653f6-1764651947994.png",
      alt: 'Patient medical records interface with health history and prescriptions',
      caption: 'Medical Records'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f0fc7718-1764674757767.png",
      alt: 'Video consultation interface showing doctor and patient in split screen',
      caption: 'Telemedicine Feature'
    }],

    featured: true
  },
  {
    id: '3',
    title: 'Real Estate Listing Platform',
    category: 'Mobile App',
    description:
    'Mobile-first property listing platform with virtual tours, mortgage calculator, and real-time chat with agents.',
    longDescription:
    'A comprehensive real estate platform that connects buyers, sellers, and agents through an intuitive mobile experience with advanced search and virtual property viewing.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14a6850ea-1764685734780.png",
    alt: 'Modern luxury home exterior with large windows and landscaped garden at sunset',
    technologies: [
    'React Native',
    'TypeScript',
    'Firebase',
    'Google Maps API',
    'Stripe'],

    year: '2023',
    client: 'PropertyHub',
    role: 'Mobile Developer',
    duration: '5 months',
    challenge:
    'Traditional property viewing required multiple in-person visits, wasting time for both buyers and agents. The existing platform had poor mobile experience and limited search capabilities.',
    solution:
    'Developed a mobile-first platform with 360° virtual tours, advanced filtering by location and amenities, integrated mortgage calculator, real-time chat system, and push notifications for new listings.',
    outcome:
    'Reduced average time-to-purchase by 30%, increased agent productivity by 45%, achieved 50,000+ app downloads in first 3 months, and maintained 4.8-star rating on app stores.',
    metrics: [
    { label: 'Time-to-Purchase', value: '-30%', icon: 'Clock' },
    { label: 'Agent Productivity', value: '45%', icon: 'TrendingUp' },
    { label: 'App Downloads', value: '50K+', icon: 'Download' }],

    testimonial: {
      quote:
      'The virtual tour feature is incredible. My clients can now view multiple properties from home, and we only schedule in-person visits for serious prospects. This has doubled my efficiency.',
      author: 'Jennifer Martinez',
      position: 'Senior Real Estate Agent',
      company: 'PropertyHub',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1673ab31b-1765448056003.png",
      alt: 'Hispanic woman in professional blazer holding tablet and smiling confidently'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a6e5edb6-1765310930375.png",
      alt: 'Property listing grid showing multiple homes with prices and details',
      caption: 'Property Listings'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1dfd41789-1764674766088.png",
      alt: '360-degree virtual tour interface of modern living room',
      caption: 'Virtual Tour Feature'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_154c80e2f-1765114273885.png",
      alt: 'Mortgage calculator interface showing loan details and monthly payments',
      caption: 'Mortgage Calculator'
    }],

    link: 'https://example.com',
    featured: false
  },
  {
    id: '4',
    title: 'Financial Analytics Dashboard',
    category: 'Data Visualization',
    description:
    'Interactive financial analytics platform with real-time data visualization, custom reports, and predictive insights.',
    longDescription:
    'An enterprise-grade analytics platform that transforms complex financial data into actionable insights through intuitive visualizations and AI-powered predictions.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_113617219-1764737686388.png",
    alt: 'Financial dashboard on computer screen showing graphs, charts and market data analytics',
    technologies: [
    'React',
    'D3.js',
    'Python',
    'TensorFlow',
    'PostgreSQL',
    'Redis'],

    year: '2023',
    client: 'FinTech Solutions',
    role: 'Data Visualization Specialist',
    duration: '7 months',
    challenge:
    'Financial analysts were spending hours manually creating reports from multiple data sources. The existing tools provided limited visualization options and no predictive capabilities.',
    solution:
    'Created a unified dashboard with real-time data integration from multiple sources, interactive D3.js visualizations, custom report builder, AI-powered trend predictions, and automated alert system.',
    outcome:
    'Reduced report generation time by 80%, improved decision-making speed by 60%, identified cost-saving opportunities worth $2M annually, and achieved 95% user adoption rate.',
    metrics: [
    { label: 'Report Time Saved', value: '80%', icon: 'Clock' },
    { label: 'Decision Speed', value: '60%', icon: 'Zap' },
    { label: 'Cost Savings', value: '$2M', icon: 'DollarSign' }],

    testimonial: {
      quote:
      'This dashboard has revolutionized how we analyze financial data. The predictive insights have helped us make better investment decisions, and the time savings are incredible.',
      author: 'Robert Williams',
      position: 'Chief Financial Officer',
      company: 'FinTech Solutions',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16de3458d-1764914935802.png",
      alt: 'Caucasian male executive in navy suit with glasses looking professional'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1d5d1e2df-1765918132625.png",
      alt: 'Main dashboard showing revenue trends and key performance indicators',
      caption: 'Main Dashboard'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_147dd6de5-1764669852482.png",
      alt: 'Interactive charts displaying financial forecasts and predictions',
      caption: 'Predictive Analytics'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_14455301b-1765463578364.png",
      alt: 'Custom report builder interface with drag-and-drop components',
      caption: 'Report Builder'
    }],

    featured: false
  },
  {
    id: '5',
    title: 'Social Media Management Tool',
    category: 'SaaS Platform',
    description:
    'All-in-one social media management platform with scheduling, analytics, and team collaboration features.',
    longDescription:
    'A comprehensive SaaS solution that enables businesses to manage multiple social media accounts, schedule content, analyze performance, and collaborate with team members.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1709281d2-1764708843566.png",
    alt: 'Social media management dashboard showing post scheduler and engagement analytics',
    technologies: [
    'React',
    'Node.js',
    'MongoDB',
    'Redis',
    'AWS',
    'Socket.io'],

    year: '2023',
    client: 'SocialBoost',
    role: 'Senior Full Stack Developer',
    duration: '9 months',
    challenge:
    'Marketing teams were using multiple disconnected tools to manage social media, leading to inefficiencies and inconsistent branding. No unified analytics or collaboration features existed.',
    solution:
    'Built a centralized platform with multi-account management, content calendar with drag-and-drop scheduling, unified analytics dashboard, team collaboration tools, and automated posting.',
    outcome:
    'Reduced social media management time by 70%, increased posting consistency by 85%, improved engagement rates by 52%, and onboarded 5,000+ businesses in first 6 months.',
    metrics: [
    { label: 'Time Saved', value: '70%', icon: 'Clock' },
    { label: 'Posting Consistency', value: '85%', icon: 'Calendar' },
    { label: 'Engagement Increase', value: '52%', icon: 'TrendingUp' }],

    testimonial: {
      quote:
      'SocialBoost has streamlined our entire social media workflow. We can now manage all our accounts from one place, and the analytics help us understand what content resonates with our audience.',
      author: 'Emily Davis',
      position: 'Marketing Director',
      company: 'TechStartup Inc',
      avatar: "https://images.unsplash.com/photo-1730575959795-c55aba81e703",
      alt: 'Young woman with red hair in casual business attire smiling warmly'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1709281d2-1764708843566.png",
      alt: 'Content calendar showing scheduled posts across multiple platforms',
      caption: 'Content Calendar'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a8443bcb-1764688209830.png",
      alt: 'Analytics dashboard displaying engagement metrics and audience insights',
      caption: 'Analytics Dashboard'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_192f0f7e9-1764647242492.png",
      alt: 'Team collaboration interface showing comments and approval workflow',
      caption: 'Team Collaboration'
    }],

    link: 'https://example.com',
    featured: false
  },
  {
    id: '6',
    title: 'Educational Learning Platform',
    category: 'EdTech',
    description:
    'Interactive online learning platform with video courses, quizzes, progress tracking, and certification system.',
    longDescription:
    'A modern e-learning platform that provides engaging educational content through interactive courses, assessments, and personalized learning paths.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b4292620-1764671097098.png",
    alt: 'Student using laptop for online learning with educational content on screen',
    technologies: [
    'React',
    'TypeScript',
    'Express',
    'MySQL',
    'AWS S3',
    'Stripe'],

    year: '2024',
    client: 'EduLearn',
    role: 'Lead Developer',
    duration: '10 months',
    challenge:
    'Traditional classroom learning was limiting reach and scalability. Students needed flexible learning options with progress tracking and certification.',
    solution:
    'Developed a comprehensive platform with video streaming, interactive quizzes, progress tracking, discussion forums, certificate generation, and payment integration for course purchases.',
    outcome:
    'Enrolled 25,000+ students across 50+ courses, achieved 88% course completion rate, generated $500K in revenue in first year, and maintained 4.7-star average course rating.',
    metrics: [
    { label: 'Students Enrolled', value: '25K+', icon: 'Users' },
    { label: 'Completion Rate', value: '88%', icon: 'Award' },
    { label: 'Revenue Generated', value: '$500K', icon: 'DollarSign' }],

    testimonial: {
      quote:
      'The platform has exceeded our expectations. Students love the interactive content, and the progress tracking helps them stay motivated. We have seen tremendous growth in enrollment.',
      author: 'Dr. Amanda Foster',
      position: 'Director of Online Education',
      company: 'EduLearn',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1387fd194-1763295664745.png",
      alt: 'Professional woman with glasses in academic setting smiling confidently'
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_17161a5cf-1765971550727.png",
      alt: 'Course catalog showing various educational programs and categories',
      caption: 'Course Catalog'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_10194aa3f-1764756498093.png",
      alt: 'Video player interface with course content and interactive elements',
      caption: 'Learning Interface'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3417d93-1764674755846.png",
      alt: 'Student progress dashboard showing completed courses and achievements',
      caption: 'Progress Tracking'
    }],

    featured: true
  }];


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