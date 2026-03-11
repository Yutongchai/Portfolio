import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/ui/Hero';
import { BASE_URL } from '../config/seoConfig';
import ServiceQuestionnaire from './services/components/Questionnaire';
import QuestionnaireTP from './services/components/QuestionnaireTP';
import TeamWorkshopImg from '../assets/team_building/team_workshop.webp';
import TrainingImg from '../assets/corporate_training/training.webp';
import AnnualDinnerImg from '../assets/corporate_events/annual_dinner.webp';
import EnvironmentImg from '../assets/csr/environment.webp';

const Questionnaire: React.FC = () => {
  const [searchParams] = useSearchParams();
  const formKey = (searchParams.get('form') || 'team_building').toLowerCase();

  const formTypeMap: Record<string, any> = {
    'team_building': 'team_building',
    'training_program': 'team_building',
    'corporate_event': 'corporate_event',
    'csr': 'csr'
  };

  const heroMap: Record<string, any> = {
    'team_building': TeamWorkshopImg,
    'training_program': TrainingImg,
    'corporate_event': AnnualDinnerImg,
    'csr': EnvironmentImg,
  };

  const heroBg = heroMap[formKey] || TeamWorkshopImg;
  const formType = (formTypeMap[formKey] || 'team_building') as 'csr' | 'team_building' | 'corporate_event';

  return (
    <div className="bg-[#fdfdfb] text-[#23242b] overflow-x-hidden">
      <Hero background={heroBg} overlayClassName="bg-black/40" minHeightClass="min-h-[60vh]">
        <div className="absolute left-0 top-0 z-30 p-2 rounded-xl bg-white/95 shadow-2xl border border-white/60 -translate-y-2">
          <a href="/" aria-label="EITO home">
            <img src={`${BASE_URL}/EITO-bw.webp`} alt="EITO" className="w-28 md:w-36 block" />
          </a>
        </div>
        <div className="relative z-20 text-center text-white px-4">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
            <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">{formKey.replace('_',' ')}</span>
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
          </div>

          <h1 className="hero-title text-3xl md:text-6xl font-black tracking-tight mb-4 md:whitespace-nowrap">{formKey === 'team_building' ? 'Team Building' : formKey === 'training_program' ? 'Training Program' : formKey === 'corporate_event' ? 'Corporate Event' : 'CSR'}</h1>
          <p className="hero-description text-sm md:text-lg font-medium leading-relaxed text-white/85 mb-6">Tell us about your needs — we'll prepare a tailored proposal.</p>
        </div>
      </Hero>

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {formKey === 'training_program' ? (
            <QuestionnaireTP />
          ) : (
            <ServiceQuestionnaire formType={formType} />
          )}
        </div>
      </main>

      
    </div>
  );
};

export default Questionnaire;
