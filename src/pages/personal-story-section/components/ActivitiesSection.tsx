import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ActivityCard from "../components/ActivityCard";
import ActivityModal from "../components/ActivityModal";
import { Activity } from "../types/activities";

const ActivitiesSection = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/rest/v1/activities?order=featured.desc,created_at.desc`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Fallback to sample data
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedActivity(null), 300);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Indoor: "from-blue-500 to-cyan-500",
      Outdoor: "from-green-500 to-emerald-500",
      Workshop: "from-purple-500 to-pink-500",
      Virtual: "from-amber-500 to-orange-500",
    };
    return colors[category] || "from-blue-500 to-cyan-500";
  };

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-white">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16"
        style={{ y }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-4">
            What To Play
          </h2>
          <p className="text-2xl handwritten text-primary">
            Popular Activities
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background rounded-3xl p-8 shadow-xl animate-pulse"
              >
                <div className="w-full h-48 bg-muted rounded-2xl mb-6" />
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          /* Activities Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onViewMore={handleViewMore}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground">
              No activities available at the moment. Check back soon!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Activity Modal */}
      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ActivitiesSection;
