import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Icon from '../../../components/AppIcon';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const CyberpunkHero: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const particleCount = 50;
    const colors = ['#00ffff', '#ff00ff', '#0066ff', '#ff00aa', '#00ff88'];
    
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - distance / 750})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-background scanlines"
      onMouseMove={handleMouseMove}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Particle canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Mouse-reactive glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-neon-cyan) 0%, transparent 70%)',
          x: mouseXSpring,
          y: mouseYSpring,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-neon-magenta) 0%, transparent 70%)',
          x: mouseXSpring,
          y: mouseYSpring,
          translateX: '-30%',
          translateY: '-30%'
        }}
        transition={{ delay: 0.05 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-accent/20 border border-accent px-6 py-3 rounded-sm mb-8 glow-cyan"
          >
            <Icon name="Zap" size={20} className="text-accent" />
            <span className="text-accent font-bold text-sm tracking-widest uppercase">
              Portfolio 2025
            </span>
          </motion.div>

          {/* Main title with glitch effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-7xl lg:text-9xl font-black mb-6 relative"
            data-text="WORK SHOWCASE"
          >
            <span className="glitch glow-text-cyan text-primary">
              WORK SHOWCASE
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl lg:text-3xl text-foreground/80 mb-12 font-light tracking-wide"
          >
            Cutting-Edge Digital Experiences
            <span className="text-accent glow-text-magenta"> // </span>
            Where Innovation Meets Design
          </motion.p>

          {/* Interactive stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-12"
          >
            {[
              { value: '50+', label: 'Projects Delivered', icon: 'Briefcase' },
              { value: '98%', label: 'Client Satisfaction', icon: 'Heart' },
              { value: '24/7', label: 'Innovation Mode', icon: 'Zap' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="border border-primary/30 rounded-sm p-6 bg-card/50 backdrop-blur-sm hover-glow cursor-pointer"
              >
                <Icon name={stat.icon as any} size={32} className="text-accent mb-3 mx-auto" />
                <div className="text-4xl font-bold text-primary glow-text-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const projectsSection = document.getElementById('projects-section');
              projectsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center space-x-3 bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 rounded-sm font-bold text-lg uppercase tracking-widest transition-all duration-300 glow-magenta overflow-hidden"
          >
            <span className="relative z-10">Explore Projects</span>
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Icon name="ChevronDown" size={24} />
            </motion.div>
            
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent via-cta to-accent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent to-transparent" />
            <Icon name="MousePointer" size={24} className="text-accent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-accent opacity-50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-accent opacity-50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-accent opacity-50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-accent opacity-50" />
    </div>
  );
};

export default CyberpunkHero;