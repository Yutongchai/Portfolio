import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Carousel, Card } from "./components/ProjectCarousel";
import EnergeticHero from "./components/EnergeticHero";
import { Project } from "./types";
import { Button } from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";
import { supabase } from "../../config/supabaseClient";


const WorkShowcase = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Map database fields to Project type
      // Fetch gallery rows separately so we use the exact `url` stored in `project_gallery`
      const projectIds = (data || []).map((p: any) => p.id).filter(Boolean);
      let galleryRows: any[] = [];
      if (projectIds.length > 0) {
        const { data: gdata, error: gerror } = await supabase
          .from('project_gallery')
          .select('*')
          .in('project_id', projectIds);
        if (gerror) throw gerror;
        galleryRows = gdata || [];
      }

      const mappedProjects: Project[] = (data || []).map(project => {
        // DB rows may have legacy fields; use casts to avoid TS errors
        const featured_image_url = (project as any).featured_image_url || '';
        const image_alt = (project as any).image_alt || project.title || '';

        const gallery = galleryRows
          .filter((g) => g.project_id === project.id)
          .map((g) => ({ ...g }));

        // Determine type description if available
        const typeDescription = (project as any).type_id ? (/* will be filled below */ null) : null;

        return {
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          longDescription: project.long_description,
          technologies: project.technologies || [],
          year: project.year,
          client: project.client,
          role: project.role || '',
          duration: project.duration,
          outcome: project.outcome,
          metrics: project.metrics || [],
          testimonial: project.testimonial || undefined,
          gallery,
          featured: project.featured || false,
          featured_image_url,
          image_alt,
        } as Project;
      });

      // Fetch project types and replace category with type description when available
      try {
        const { data: typesData, error: typesError } = await supabase
          .from('project_types')
          .select('id, type_key, description');
        if (typesError) throw typesError;
        const typeMap = new Map((typesData || []).map((t: any) => [t.id, t.description || t.type_key]));
        // Apply mapping
        for (const p of mappedProjects) {
          const raw = (data || []).find((d: any) => d.id === p.id);
          if (raw && raw.type_id && typeMap.has(raw.type_id)) {
            p.category = typeMap.get(raw.type_id);
          }
        }
      } catch (err) {
        console.warn('Could not fetch project types:', err);
      }

      setProjects(mappedProjects);
      console.log('Fetched projects:', mappedProjects);
      console.log('First project gallery:', mappedProjects[0]?.gallery);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const cards = projects.map((project) => ({
    src: project.featured_image_url,
    title: project.title,
    category: project.category,
    content: (
      <div className="space-y-6">
        {/* Main Project Image */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={project.featured_image_url}
            alt={project.image_alt}
            className="w-full h-40 md:h-96 object-cover"
          />
        </div>

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

    {/*     {project.testimonial && (
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
        )} */}

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

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600 dark:text-gray-400">Loading projects...</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600 dark:text-gray-400">No projects available</div>
              </div>
            ) : (
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
            )}

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
