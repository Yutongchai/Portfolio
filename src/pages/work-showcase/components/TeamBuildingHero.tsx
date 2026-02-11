import React from "react";
import { motion } from "framer-motion";
import TeamBuildingHeroImg from "../../../assets/team_building/hero.png";

const TeamBuildingHero: React.FC = () => {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <style>{`
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-title {
                    animation: slideInDown 0.8s ease-out;
                }

                .hero-description {
                    animation: slideInUp 0.8s ease-out 0.2s both;
                }
        `}</style>
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
            >
                <img
                    src={TeamBuildingHeroImg}
                    alt="Team building"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#0f1e38]/70 to-[#f68921]/35" />
            </motion.div>

            <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="h-[2px] w-20 bg-[#fcb22f]" />
                    <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">
                        Team Building
                    </span>
                    <div className="h-[2px] w-20 bg-[#fcb22f]" />
                </div>

                <h1 className="hero-title text-3xl md:text-6xl font-black tracking-tight mb-8">
                    Building Stronger Teams Through Meaningful Experiences
                </h1>

                <p className="hero-description text-sm md:text-lg font-medium leading-relaxed text-white/85 mb-10">
                    Tailored games and experiences that bring people together, strengthen teamwork, and fuel performance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#team-building-activities"
                        className="rounded-full bg-[#fcb22f] px-10 py-3 font-bold text-[#153462] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(246,137,33,0.65)]"
                    >
                        Explore Activities
                    </a>
                    <a
                        href="#team-building-questionnaire"
                        className="rounded-full border border-white/70 px-10 py-3 font-bold backdrop-blur transition-colors duration-300 hover:bg-white/10"
                    >
                        Start Planning Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TeamBuildingHero;
