// src/data/blogData.ts
// Hardcoded seed data — mirrors the Supabase `blog_posts` table schema exactly.
// Once the table is live, replace `getAllPosts()` / `getPostBySlug()` with Supabase queries.

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string;
    cover_image_alt: string;
    category: string;
    tags: string[];
    author_name: string;
    author_avatar?: string;
    published_at: string;        // ISO string — only shown when <= now()
    scheduled_at?: string | null; // future date means "scheduled"
    is_published: boolean;
    read_time_minutes: number;
    content: BlogSection[];      // rich content sections
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string[];
}

export interface BlogSection {
    type: 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'callout';
    level?: 2 | 3;          // for heading
    text?: string;
    items?: string[];        // for list
    src?: string;            // for image
    alt?: string;            // for image
    caption?: string;        // for image
}

// ─── Seed Articles ──────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        slug: 'why-team-building-drives-real-results',
        title: 'Why Team Building Actually Drives Real Business Results',
        excerpt:
            'Beyond the fun and games — how intentional team building translates directly into stronger collaboration, lower turnover, and measurable productivity gains.',
        cover_image:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
        cover_image_alt: 'Team collaborating outdoors during a team building activity',
        category: 'Team Building',
        tags: ['team building', 'corporate culture', 'employee engagement'],
        author_name: 'EITO Group',
        published_at: '2025-05-10T08:00:00.000Z',
        is_published: true,
        read_time_minutes: 5,
        seo_title: 'Why Team Building Drives Real Business Results | EITO Group',
        seo_description:
            'Discover how intentional team building programs improve collaboration, reduce turnover, and deliver measurable ROI for Malaysian corporates.',
        seo_keywords: ['team building Malaysia', 'corporate team building', 'employee engagement'],
        content: [
            {
                type: 'paragraph',
                text: 'Most companies treat team building as a reward — a nice day out after a tough quarter. But organisations that consistently outperform their peers treat it as a strategic investment with a measurable return.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Hidden Cost of Poor Team Cohesion',
            },
            {
                type: 'paragraph',
                text: 'Research from Gallup consistently shows that disengaged teams cost businesses 18% of their annual salary bill in lost productivity. Poor communication alone adds friction to every project, slows decision-making, and quietly erodes margins.',
            },
            {
                type: 'quote',
                text: '"Teamwork is the ability to work together toward a common vision — the ability to direct individual accomplishments toward organisational objectives."',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What Well-Designed Programs Deliver',
            },
            {
                type: 'list',
                items: [
                    'Psychological safety — people voice ideas without fear of ridicule',
                    'Shared vocabulary and faster cross-department communication',
                    'Stronger trust that reduces micro-management overhead',
                    'Leaders discovered in low-stakes experiential environments',
                    'Reduced attrition — people stay for their team, not just their salary',
                ],
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
                alt: 'Employees celebrating a team win',
                caption: 'Shared wins reinforce the culture of collaboration far beyond the event itself.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Designing for Lasting Impact',
            },
            {
                type: 'paragraph',
                text: 'The difference between a forgettable team outing and a program that shifts culture lies in intentional design. Every activity should map to a specific behavioural goal — trust, communication, leadership, or resilience — with a debrief that anchors the lesson back to daily work.',
            },
            {
                type: 'callout',
                text: 'EITO Group designs every program around your organisational objectives. Whether you are onboarding a new department or realigning after a restructure, we match activities to outcomes.',
            },
        ],
    },

    {
        id: '2',
        slug: 'planning-a-corporate-annual-dinner-that-people-remember',
        title: 'Planning a Corporate Annual Dinner People Actually Remember',
        excerpt:
            'The annual dinner is the highlight of your corporate calendar. Here is how to move beyond the standard format and create an evening that genuinely reflects your brand.',
        cover_image:
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
        cover_image_alt: 'Elegantly decorated corporate dinner venue',
        category: 'Corporate Events',
        tags: ['annual dinner', 'event planning', 'corporate events'],
        author_name: 'EITO Group',
        published_at: '2025-06-02T08:00:00.000Z',
        is_published: true,
        read_time_minutes: 6,
        seo_title: 'Planning a Corporate Annual Dinner | EITO Group',
        seo_description:
            'Step-by-step guidance on planning a corporate annual dinner that reinforces brand culture and leaves a lasting impression on your team.',
        seo_keywords: ['corporate annual dinner Malaysia', 'event planning', 'annual dinner ideas'],
        content: [
            {
                type: 'paragraph',
                text: 'The annual dinner sits at the intersection of recognition, culture, and celebration. Done well, it recharges your team heading into a new year. Done poorly, it becomes the punchline of office jokes for the next twelve months.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Start with Your "Why"',
            },
            {
                type: 'paragraph',
                text: 'Before venues, themes, or menus — clarify the purpose. Is this primarily a recognition evening? A cultural reset? A client-facing showcase? The answer shapes every decision that follows.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Five Pillars of a Memorable Evening',
            },
            {
                type: 'list',
                items: [
                    'Immersive theme that connects to your brand story',
                    'Emcee who can read the room and keep energy alive',
                    'Recognition segment with genuine, personalised awards',
                    'Entertainment that surprises without overshadowing the message',
                    'Post-event moment — a shared memory people talk about the next day',
                ],
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
                alt: 'Award ceremony at a corporate dinner',
                caption: 'Recognition moments hit hardest when they are specific and sincere.',
            },
            {
                type: 'callout',
                text: 'EITO Group handles everything from venue scouting and creative theming to emcee talent, entertainment bookings, and on-the-night coordination — so your leadership team enjoys the evening too.',
            },
        ],
    },

    {
        id: '3',
        slug: 'hrd-corp-claimable-training-what-hr-needs-to-know',
        title: 'HRD Corp Claimable Training: What Every HR Manager Needs to Know in 2025',
        excerpt:
            'A plain-language guide to navigating HRD Corp claims for your training programmes — eligibility, the SBL-Khas scheme, and common mistakes to avoid.',
        cover_image:
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
        cover_image_alt: 'HR manager reviewing training documents',
        category: 'Training',
        tags: ['HRD Corp', 'training', 'HR Malaysia', 'SBL-Khas'],
        author_name: 'EITO Group',
        published_at: '2025-06-15T08:00:00.000Z',
        is_published: true,
        read_time_minutes: 7,
        seo_title: 'HRD Corp Claimable Training Guide 2025 | EITO Group',
        seo_description:
            'Everything Malaysian HR teams need to know about HRD Corp claimable training in 2025 — schemes, eligibility, claim process, and tips from a registered provider.',
        seo_keywords: ['HRD Corp claimable training', 'SBL-Khas Malaysia', 'HRD Corp 2025', 'HR training Malaysia'],
        content: [
            {
                type: 'paragraph',
                text: 'HRD Corp (formerly HRDF) remains one of the most underutilised benefits available to Malaysian companies. Many eligible employers leave levy money on the table simply because the claim process feels complex. It does not have to be.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Who Is Eligible?',
            },
            {
                type: 'paragraph',
                text: 'All employers in Peninsular Malaysia and Labuan with 10 or more Malaysian employees are mandatory contributors. Companies with fewer than 10 employees may opt in voluntarily and still enjoy the same claim benefits.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Understanding SBL-Khas',
            },
            {
                type: 'paragraph',
                text: 'The Skim Bantuan Latihan Khas (SBL-Khas) scheme allows employers to send employees for training with a registered provider, then submit a claim for reimbursement against their HRD Corp levy account. Claims can cover trainer fees, materials, venue, and certain allowances.',
            },
            {
                type: 'list',
                items: [
                    'Training must be conducted by a registered HRD Corp provider',
                    'Minimum 75% attendance required per participant',
                    'Claims must be submitted within 30 days of training completion',
                    'Supporting documents: attendance list, invoice, programme outline',
                ],
            },
            {
                type: 'callout',
                text: 'EITO Group is a registered HRD Corp training provider. We handle the full documentation process so your HR team spends zero time on paperwork.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Common Mistakes That Lead to Rejected Claims',
            },
            {
                type: 'list',
                items: [
                    'Missing pre-approval before the training date',
                    'Incorrect participant count on the claim form',
                    'Training content not matching the approved outline',
                    'Submitting after the 30-day window',
                ],
            },
        ],
    },
];

// ─── Helper Functions (mirrors Supabase query signatures) ────────────────────

/** Returns all published posts, sorted by published_at descending */
export function getAllPosts(): BlogPost[] {
    const now = new Date();
    return BLOG_POSTS
        .filter(p => p.is_published && new Date(p.published_at) <= now)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

/** Returns a single post by slug, or undefined if not found / not yet published */
export function getPostBySlug(slug: string): BlogPost | undefined {
    const now = new Date();
    return BLOG_POSTS.find(
        p => p.slug === slug && p.is_published && new Date(p.published_at) <= now
    );
}

/** Returns up to `limit` posts excluding the given slug (for "See other articles") */
export function getOtherPosts(excludeSlug: string, limit = 3): BlogPost[] {
    return getAllPosts()
        .filter(p => p.slug !== excludeSlug)
        .slice(0, limit);
}