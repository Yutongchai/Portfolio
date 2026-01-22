// Run this script to populate database with existing images
// Usage: node scripts/populateDatabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function populateHeroImages() {
  console.log('📸 Populating hero images...');
  
  const heroImages = [
    {
      title: 'Main Hero Image',
      image_url: '/Portfolio/components/mainPic.jpg',
      alt_text: 'Team building activity with diverse group',
      display_order: 1,
      is_active: true
    }
  ];

  const { data, error } = await supabase
    .from('hero_images')
    .insert(heroImages);

  if (error) {
    console.error('❌ Error inserting hero images:', error);
  } else {
    console.log('✅ Hero images added successfully');
  }
}

async function populateClientLogos() {
  console.log('🏢 Populating client logos...');
  
  // Add your existing client logos here
  // Example:
  const clientLogos = [
    {
      company_name: 'Example Client',
      logo_url: '/Portfolio/customers/client-logo.png',
      alt_text: 'Example Client Logo',
      display_order: 1,
      is_active: true
    }
  ];

  const { data, error } = await supabase
    .from('client_logos')
    .insert(clientLogos);

  if (error) {
    console.error('❌ Error inserting client logos:', error);
  } else {
    console.log('✅ Client logos added successfully');
  }
}

async function populateProjects() {
  console.log('💼 Populating projects...');
  
  const projects = [
    {
      slug: 'advelsoft-team-building',
      title: 'Advelsoft',
      category: 'Team Building',
      description: 'Empowering teams to make a positive impact through community service and social responsibility projects.',
      long_description: 'Our CSR programs engage teams in meaningful activities that benefit local communities, foster empathy, and build a sense of purpose.',
      featured_image_url: '/Portfolio/events/_JIN3517.jpg',
      image_alt: 'Team participating in a CSR event outdoors',
      year: '2025',
      client: 'GlobalCorp',
      role: 'CSR Facilitator',
      duration: '3 months',
      challenge: 'Engaging employees in CSR activities while balancing work commitments.',
      solution: 'Designed flexible, gamified CSR events that fit team schedules and maximized participation.',
      outcome: 'Increased employee engagement by 50% and raised $20,000 for local charities.',
      display_order: 1,
      is_active: true,
      is_featured: true
    }
  ];

  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .insert(projects)
    .select();

  if (projectError) {
    console.error('❌ Error inserting projects:', projectError);
    return;
  }

  console.log('✅ Projects added successfully');

  // Add metrics for the first project
  if (projectData && projectData.length > 0) {
    const projectId = projectData[0].id;

    const metrics = [
      { project_id: projectId, label: 'Engagement Increase', value: '50%', icon: 'TrendingUp', display_order: 1 },
      { project_id: projectId, label: 'Funds Raised', value: '$20,000', icon: 'Gift', display_order: 2 }
    ];

    await supabase.from('project_metrics').insert(metrics);

    const technologies = [
      { project_id: projectId, technology_name: 'Community Engagement', display_order: 1 },
      { project_id: projectId, technology_name: 'Volunteering', display_order: 2 },
      { project_id: projectId, technology_name: 'Fundraising', display_order: 3 }
    ];

    await supabase.from('project_technologies').insert(technologies);

    console.log('✅ Project metrics and technologies added');
  }
}

async function main() {
  console.log('🚀 Starting database population...\n');
  
  await populateHeroImages();
  await populateClientLogos();
  await populateProjects();
  
  console.log('\n✨ Database population complete!');
}

main().catch(console.error);
