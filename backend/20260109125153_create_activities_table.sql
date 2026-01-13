/*
  # Create Activities Table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Activity name
      - `category` (text) - Activity category (e.g., "Outdoor", "Indoor", "Virtual")
      - `description` (text) - Short description for card
      - `long_description` (text) - Detailed description for modal
      - `experience` (text) - What participants will experience
      - `price` (numeric) - Activity price
      - `duration` (text) - Activity duration
      - `min_participants` (integer) - Minimum number of participants
      - `max_participants` (integer) - Maximum number of participants
      - `image_url` (text) - Image URL
      - `featured` (boolean) - Whether activity is featured
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `activities` table
    - Add policy for public read access (activities are public information)
    - Add policy for authenticated admin users to manage activities
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL,
  experience text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration text NOT NULL,
  min_participants integer NOT NULL DEFAULT 5,
  max_participants integer NOT NULL DEFAULT 50,
  image_url text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities"
  ON activities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample activities
INSERT INTO activities (title, category, description, long_description, experience, price, duration, min_participants, max_participants, image_url, featured) VALUES
(
  'Escape Room Challenge',
  'Indoor',
  'Work together to solve puzzles and escape within 60 minutes. Perfect for building problem-solving skills and teamwork.',
  'Our Escape Room Challenge is an immersive team-building experience where groups work against the clock to solve intricate puzzles, decode clues, and unlock secrets. Teams must communicate effectively, delegate tasks, and think creatively under pressure. Each room is themed with unique storylines that challenge both logic and creativity.',
  'Participants will experience: High-energy problem solving, enhanced communication skills, strategic thinking under pressure, collaborative decision making, and a thrilling sense of accomplishment when the team succeeds together.',
  299.00,
  '60-90 minutes',
  6,
  12,
  '/Portfolio/assets/different-CoRPocwn.jpg',
  true
),
(
  'Outdoor Adventure Quest',
  'Outdoor',
  'Navigate through outdoor challenges, build trust, and strengthen team bonds in nature.',
  'The Outdoor Adventure Quest takes teams into nature for a day of physical and mental challenges. From rope courses to team navigation exercises, this activity combines physical fitness with strategic planning. Teams will face obstacles that require trust, clear communication, and mutual support to overcome.',
  'Participants will experience: Fresh air and physical activity, trust-building exercises, leadership development, enhanced team communication, problem-solving in dynamic environments, and a deep sense of team unity.',
  450.00,
  '3-4 hours',
  8,
  25,
  '/Portfolio/assets/teamwork-C0G_me8Z.jpg',
  true
),
(
  'Innovation Workshop',
  'Workshop',
  'Unleash creativity through design thinking exercises and collaborative innovation challenges.',
  'Our Innovation Workshop guides teams through the design thinking process, from ideation to prototyping. Teams will tackle real business challenges or creative scenarios using proven innovation methodologies. This workshop is perfect for teams looking to break out of routine thinking and develop a culture of innovation.',
  'Participants will experience: Creative brainstorming techniques, hands-on prototyping, design thinking methodology, cross-functional collaboration, innovative problem-solving approaches, and actionable ideas they can implement.',
  375.00,
  '2-3 hours',
  8,
  20,
  '/Portfolio/assets/training-KlvQReAD.jpg',
  true
),
(
  'Cooking Team Challenge',
  'Indoor',
  'Cook up team spirit! Collaborate in the kitchen to create delicious dishes together.',
  'The Cooking Team Challenge brings teams together in a professional kitchen environment. Divided into smaller cooking teams, participants must plan, prepare, and present restaurant-quality dishes. This activity emphasizes coordination, time management, creativity, and the importance of each team member contribution.',
  'Participants will experience: Hands-on culinary creation, time management under pressure, creative collaboration, role delegation and coordination, presentation skills, and of course, enjoying a delicious meal together at the end.',
  425.00,
  '2.5-3 hours',
  10,
  30,
  '/Portfolio/assets/discuss-DSTPzqQy.jpg',
  false
),
(
  'Virtual Team Building',
  'Virtual',
  'Engage remote teams with interactive online activities, games, and challenges.',
  'Our Virtual Team Building program is specifically designed for remote and hybrid teams. Through a mix of interactive games, collaborative challenges, and facilitated discussions, we help distributed teams build connections and strengthen relationships. Activities range from virtual escape rooms to trivia competitions and creative challenges.',
  'Participants will experience: Connection despite distance, fun interactive games, inclusive team activities, improved virtual communication, team bonding across time zones, and memorable shared experiences online.',
  250.00,
  '90 minutes',
  5,
  50,
  '/Portfolio/assets/collage-CaZY0wac.jpg',
  false
),
(
  'Leadership Development Day',
  'Workshop',
  'Develop leadership skills through experiential learning and practical exercises.',
  'The Leadership Development Day is an intensive program designed to identify and nurture leadership potential within your team. Through a combination of experiential activities, group discussions, and individual reflection, participants explore different leadership styles, practice decision-making under pressure, and learn to inspire and motivate others.',
  'Participants will experience: Self-awareness and personal growth, practical leadership tools, confidence building, emotional intelligence development, strategic thinking exercises, mentorship opportunities, and actionable leadership strategies.',
  525.00,
  '4-6 hours',
  10,
  25,
  '/Portfolio/assets/mainPic-WL16ORcX.jpg',
  false
);
