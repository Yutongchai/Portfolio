import React from 'react';
import ImageHoverScrollSection from '../../../components/ImageHoverScrollSection';

const BeliefsValuesSection = () => {
  const beliefs = [
    {
      title: "Engagement Through Experience",
      description: "We believe engagement is created through meaningful experiences, not just policies.",
      letter: "E",
      color: "#12a28f", // Equilibrium Green
      accent: "🟢"
    },
    {
      title: "Learning by Living",
      description: "Learning is most effective when it's lived, not lectured.",
      letter: "I",
      color: "#fcb22f", // Integrity Yellow
      accent: "🟡"
    },
    {
      title: "Valued Teams Perform",
      description: "Teams perform better when every member feels seen, heard, and valued.",
      letter: "T",
      color: "#0074b4", // Teamwork Blue
      accent: "🔵"
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fdfdfb] overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header - 增加進場感 */}
        <div className="text-center mb-24 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-9xl font-black text-gray-50 opacity-50 select-none">
            BELIEFS
          </div>
          <h2 className="relative z-10 text-5xl sm:text-6xl font-black text-[#23242b] mb-8 tracking-tight">
            Our Beliefs & <span className="text-[#e1620b]">Values</span>
          </h2>
          <p className="relative z-10 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Strong organisations are not built by structure alone — they are built by
            <span className="font-bold text-[#23242b]"> people who connect</span>, communicate, and grow together.
          </p>
        </div>

        {/* Belief Cards - 增加交互與 Logo 元素 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-4 border border-gray-100 overflow-hidden"
            >
              {/* 背景浮水印字母 (無背景 Logo 元素) */}
              <div
                className="absolute -right-4 -bottom-10 text-[12rem] font-black opacity-[0.03] group-hover:opacity-10 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none"
                style={{ color: belief.color }}
              >
                {belief.letter}
              </div>

              <div className="relative z-10">
                {/* 彩色圓點裝飾 */}
                <div
                  className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center text-2xl shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]"
                  style={{ backgroundColor: `${belief.color}15` }}
                >
                  {belief.accent}
                </div>

                <h3 className="text-2xl font-extrabold text-[#23242b] mb-4 group-hover:text-[#e1620b] transition-colors">
                  {belief.title}
                </h3>

                <p className="text-gray-500 leading-relaxed font-medium">
                  {belief.description}
                </p>
              </div>

              {/* 底部彩色裝飾條 */}
              <div
                className="absolute bottom-0 left-0 h-2 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: belief.color }}
              />
            </div>
          ))}
        </div>

        {/* 中間過渡語句 - 更加大膽的排版 */}
        <div className="py-20 flex justify-center border-y border-gray-100 my-20">
          <div className="text-center">
            <p className="text-4xl sm:text-6xl font-black leading-tight text-[#23242b]">
              That belief is the <br />
              <span
                className="inline-block px-4 py-2 mt-2 rounded-2xl text-white transform -rotate-2"
                style={{ backgroundColor: '#fcb22f' }}
              >
                FOUNDATION
              </span><br />
              <span className="opacity-90">of everything we do.</span>
            </p>
          </div>
        </div>

        {/* EITO Values Section */}
        <div className="">
          <div className="text-center mb-16">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Core Principles</h3>
            <p className="text-2xl font-bold text-[#23242b]">
              The E I T O Fundamentals
            </p>
          </div>
          <ImageHoverScrollSection />
        </div>
      </div>
    </section>
  );
};

export default BeliefsValuesSection;