import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';
import PageHeader from '../../../components/PageHeader';
import './BeliefsValuesSection.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// --- Types ---
type Belief = {
  title: string;
  description: string;
  letter: string;
  color: string;
  accent: React.ReactNode;
  bgImage?: string; // Added image property
};

type TiltCardProps = {
  belief: Belief;
};

// Accent: three-line 'stripes' (like adidas) using footer stripe colors
const LinesAccent: React.FC = () => {
  const stripeColors = ['#f68921', '#79989f', '#18616e'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, transform: 'rotate(-18deg)', alignItems: 'center' }}>
      <span style={{ display: 'block', width: 16, height: 3, background: stripeColors[0], borderRadius: 2 }} />
      <span style={{ display: 'block', width: 20, height: 3, background: stripeColors[1], borderRadius: 2 }} />
      <span style={{ display: 'block', width: 24, height: 3, background: stripeColors[2], borderRadius: 2 }} />
    </div>
  );
};

// --- 3D Tilt Card with Image Background ---
const TiltCard: React.FC<TiltCardProps> = ({ belief }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl"
    >
      {/* 1. The Background Image Layer */}
      {belief.bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${belief.bgImage}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}

      {/* 2. Glassmorphism Overlay (Ensures readability) */}
      <div className="absolute inset-0 bg-white/80 group-hover:bg-white/70 transition-colors duration-500" />

      {/* 3. Watermark Letter */}
      <div
        className="absolute -right-4 -bottom-10 text-[12rem] font-black opacity-[0.05] group-hover:opacity-10 group-hover:-translate-y-8 transition-all duration-700 pointer-events-none"
        style={{ color: belief.color, transform: "translateZ(30px)" }}
      >
        {belief.letter}
      </div>

      {/* 4. Content Layer */}
      <div className="relative z-10 p-10 h-full flex flex-col" style={{ transform: "translateZ(75px)" }}>
        <div
          className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]"
          style={{ backgroundColor: `${belief.color}20` }}
        >
          <LinesAccent />
        </div>

        <h3 className="text-2xl font-extrabold text-[#23242b] mb-4 group-hover:text-[#e1620b] transition-colors">
          {belief.title}
        </h3>

        <p className="text-gray-600 leading-relaxed font-medium mb-auto">
          {belief.description}
        </p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
          style={{ color: belief.color }}
        >
          View Details
          <span className="w-8 h-8 rounded-full flex items-center justify-center border border-current">↗</span>
        </motion.div>
      </div>

      {/* Animated accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 h-2 w-0 group-hover:w-full transition-all duration-700"
        style={{ backgroundColor: belief.color }}
      />
    </motion.div>
  );
};

const BeliefsValuesSection = () => {
  // Added your requested image paths here
  const beliefs: Belief[] = [
    {
      title: "PLAY",
      description: "Where fun turns into teamwork",
      letter: "E",
      color: "#12a28f",
      accent: "🟢",
      bgImage: import.meta.env.BASE_URL + "/Engagement.jpg"
    },
    {
      title: "LEARN",
      description: "Where experiences turn into growth",
      letter: "I",
      color: "#fcb22f",
      accent: "🟡",
      bgImage: import.meta.env.BASE_URL + "/Living.jpg"
    },
    {
      title: "LEAD",
      description: "Where teams turn into leaders",
      letter: "T",
      color: "#0074b4",
      accent: "🔵",
      bgImage: import.meta.env.BASE_URL + "/Valued.jpg" // You can change this to /t.jpg if available
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyBgRef = useRef<HTMLDivElement | null>(null);
  const stickyInnerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0, isOver: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  // Logo entrance animation on scroll past FOUNDATION
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const logoEl = document.querySelector('.eito-traveling-logo') as HTMLElement | null
    if (!logoEl) return
    gsap.set(logoEl, { opacity: 0, scale: 0.7 })
    const st = ScrollTrigger.create({
      trigger: '#foundation-phrase',
      start: 'bottom center',
      end: '+=200',
      scrub: true,
      onUpdate: self => {
        const p = self.progress
        gsap.to(logoEl, { opacity: p, scale: 0.7 + 0.3 * p, duration: 0.1, overwrite: 'auto' })
      }
    })
    return () => {
      try { st.kill() } catch (e) { }
      try { ScrollTrigger.getAll().forEach(t => t.kill()) } catch (e) { }
    }
  }, [])

  // Sticky background clip-path reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = stickyBgRef.current
    if (!root || !containerRef.current) return

    const stickyInner = root.querySelector('.sticky') as HTMLElement | null
    const layer = root.querySelector('.sticky-bg-layer') as HTMLElement | null
    if (!layer) return

    // set sticky inner height to the section height so it doesn't overflow other sections
    const setStickyHeight = () => {
      try {
        const h = containerRef.current!.getBoundingClientRect().height
        if (stickyInner) {
          stickyInner.style.height = `${h}px`
        }
      } catch (e) {}
    }

    setStickyHeight()
    window.addEventListener('resize', setStickyHeight)

    // ensure initial clip-path (small circle in center-top area)
    // On small screens, disable clip animation and fully reveal background to avoid layout overlap
    const isSmall = window.innerWidth < 768
    if (isSmall) {
      gsap.set(layer, { clipPath: 'circle(150% at 50% 45%)' })
      // don't create scrollTrigger
      return () => {
        window.removeEventListener('resize', setStickyHeight)
      }
    }

    gsap.set(layer, { clipPath: 'circle(0% at 50% 45%)' })

    const anim = gsap.to(layer, {
      clipPath: 'circle(150% at 50% 45%)',
      ease: 'power1.out',
      paused: true,
      onUpdate: () => {},
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    })

    return () => {
      try { anim.kill() } catch (e) {}
      try { ScrollTrigger.getAll().forEach(t => t.kill()) } catch (e) {}
      window.removeEventListener('resize', setStickyHeight)
    }
  }, [])

  return (
    <section
      id="beliefs-values"
      ref={containerRef}
      className="pt-0 pb-24 px-4 overflow-hidden relative"
    >
      {/* STICKY SHARED BACKGROUND (clip-path reveal) */}
      <div ref={stickyBgRef} className="absolute inset-0 z-0 pointer-events-none">
        <div ref={stickyInnerRef} className="sticky top-0 relative overflow-hidden">
          <div className="sticky-bg-layer absolute inset-0 will-change-[clip-path,transform]">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#f5f7fa] via-[#FFEBD2] to-white"
              style={{ backgroundAttachment: 'scroll' }}
            />

            {/* Static floating shapes (will be revealed by clip-path) */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
                style={{ backgroundColor: '#12a28f', animation: 'none', willChange: 'transform' }}
              />
              <div
                className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: '#fcb22f', animation: 'none', willChange: 'transform' }}
              />
              <div
                className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full opacity-8 blur-3xl"
                style={{ backgroundColor: '#0074b4', animation: 'none', willChange: 'transform' }}
              />
              <div
                className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: '#f68921', animation: 'none', willChange: 'transform' }}
              />
              <div
                className="absolute -bottom-20 -right-10 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
                style={{ backgroundColor: '#153462', animation: 'none', willChange: 'transform' }}
              />

              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(circle, #23242b 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Light overlay for content readability (promoted to its own layer; avoid costly backdrop blur) */}
      <div
        className="absolute inset-0 bg-white/40 z-0"
        style={{ willChange: 'opacity, transform', transform: 'translateZ(0)', pointerEvents: 'none' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="pt-10">
          <PageHeader
            title={(
              <>
                Our Beliefs & <span className="text-[#fcb22f]">Values</span>
              </>
            )}
            subtitle={"Real experiences. Real connections. Real growth."}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32" style={{ perspective: "1200px" }}>
          {beliefs.map((belief, index) => (
            <TiltCard key={index} belief={belief} />
          ))}
        </div>

        {/* Foundation Phrase */}
        <div id="foundation-phrase" className="py-6 flex flex-col items-center">
          <p className="text-4xl sm:text-6xl font-black text-center text-[#23242b] leading-tight">
            That belief is the <br />
            <span className="relative inline-block mt-4">
              {mouse.isOver && (
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, #fcb22f66 0%, transparent 100%)`,
                  }}
                />
              )}
              <motion.span
                style={{
                  y: smoothY,
                  scale,
                  opacity,
                  rotate: "-15deg", // Set your desired tilt degree here
                  backgroundColor: '#fcb22f',
                }}
                className="px-8 py-2 rounded-2xl text-white shadow-xl relative z-10"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, isOver: true });
                }}
                onMouseLeave={() => setMouse(m => ({ ...m, isOver: false }))}
              >
                FOUNDATION
              </motion.span>
            </span>
            <br />
            <span className="opacity-90">of everything we do.</span>
          </p>
        </div>
        
      </div>
    </section>
  );
}

export default BeliefsValuesSection;