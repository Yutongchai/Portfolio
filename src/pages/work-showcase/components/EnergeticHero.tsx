import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const EnergeticHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const floatingOrbs = [
    {
      size: 'w-96 h-96',
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      position: 'top-20 -left-48',
      delay: 0,
    },
    {
      size: 'w-[500px] h-[500px]',
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      position: 'top-1/3 -right-64',
      delay: 0.2,
    },
    {
      size: 'w-80 h-80',
      gradient: 'from-cyan-400 via-blue-400 to-cyan-500',
      position: 'bottom-32 left-1/4',
      delay: 0.4,
    },
    {
      size: 'w-72 h-72',
      gradient: 'from-green-400 via-emerald-400 to-green-500',
      position: 'bottom-20 right-1/4',
      delay: 0.6,
    },
  ];

  return (
    <div ref={ref} className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-background via-slate-50 to-blue-50">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingOrbs.map((orb, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: orb.delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`absolute ${orb.size} ${orb.position} rounded-full bg-gradient-to-br ${orb.gradient} blur-3xl animate-float`}
            style={{
              animationDelay: `${orb.delay}s`,
              animationDuration: `${4 + index}s`
            }}
          />
        ))}

        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3B82F6 1px, transparent 1px),
              linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-electric rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-butter" />
              <div className="relative glass px-6 py-3 rounded-full flex items-center space-x-2">
            {/*     <Icon name="Sparkles" size={18} className="text-primary animate-pulse-glow" />
               */}
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 leading-none"
          >
            <span className="inline-block animate-bounce-in text-gradient-vivid">
              Work Showcase
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Crafting exceptional digital experiences with
            <span className="text-gradient font-semibold"> creativity</span>,
            <span className="text-gradient font-semibold"> innovation</span>, and
            <span className="text-gradient font-semibold"> passion</span>
          </motion.p>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          >
            {[
              { value: '50+', label: 'Projects Delivered', icon: 'Briefcase', gradient: 'from-blue-500 to-cyan-500' },
              { value: '98%', label: 'Client Satisfaction', icon: 'Heart', gradient: 'from-purple-500 to-pink-500' },
              { value: '24/7', label: 'Innovation Mode', icon: 'Zap', gradient: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-butter`} />
                <div className="relative glass rounded-3xl p-8 card-energetic">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon name={stat.icon} size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const projectsSection = document.getElementById('projects-section');
                projectsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-butter"
            >
              <div className="absolute inset-0 bg-gradient-electric animate-gradient" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-butter" />
              <span className="relative z-10 text-white">Explore Projects</span>
              <motion.div
                className="relative z-10"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Icon name="ArrowDown" size={20} className="text-white" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-3"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-gradient-electric rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      </motion.div>
    </div>
  );
};

export default EnergeticHero;
