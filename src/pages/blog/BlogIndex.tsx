// src/pages/blog/BlogIndex.tsx
// Fetches published posts directly from Supabase blog_posts table.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, ArrowRight, Tag, ChevronDown } from 'lucide-react';
import Footer from '../../components/ui/Footer';
import { supabase } from '../../config/supabaseClient';

const COLORS = {
    NAVY: '#153462',
    GOLD: '#fcb22f',
    ORANGE: '#f68921',
    TEAL: '#79989f',
    TEAL_DARK: '#18616e',
    CREAM: '#fdf8f0',
    LIGHT_GRAY: '#f5f5f5',
};

const CATEGORIES = ['All', 'Team Building', 'Corporate Events', 'Training', 'CSR'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPostRow {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image_url: string | null;
    category: string;
    tags: string | string[];   // Supabase may return a JSON string or array
    author_name: string;
    content_json: string;
    is_published: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    read_time_minutes: number;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
}

// Safely parse tags regardless of whether Supabase returns a string or array
const parseTags = (raw: string | string[] | null | undefined): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

// ─── Card ───────────────────────────────────────────────────────────────────
const BlogCard: React.FC<{ post: BlogPostRow; featured?: boolean }> = ({ post, featured }) => {
    const date = post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-MY', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '';

    const tags = parseTags(post.tags);

    return (
        <Link
            to={`/blog/${post.slug}`}
            className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'md:col-span-2' : ''
                }`}
            style={{ border: '1px solid #e8edf2' }}
        >
            {/* Cover image */}
            <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
                {post.cover_image_url ? (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: COLORS.NAVY }}
                    >
                        {post.category}
                    </div>
                )}
                <span
                    className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: COLORS.NAVY }}
                >
                    {post.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: COLORS.TEAL }}>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {post.read_time_minutes} min read
                    </span>
                </div>

                <h3
                    className={`font-bold leading-tight mb-2 group-hover:opacity-80 transition-opacity ${featured ? 'text-xl' : 'text-lg'
                        }`}
                    style={{ color: COLORS.NAVY }}
                >
                    {post.title}
                </h3>

                <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: '#5a6a7a' }}>
                    {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.slice(0, 2).map(tag => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: '#f0f4f8', color: COLORS.TEAL_DARK }}
                        >
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>

                <div
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest group-hover:gap-3 transition-all"
                    style={{ color: COLORS.ORANGE }}
                >
                    Read <ArrowRight size={14} />
                </div>
            </div>
        </Link>
    );
};

// ─── Page ────────────────────────────────────────────────────────────────────
const BlogIndex: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [allPosts, setAllPosts] = useState<BlogPostRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { data, error } = await (supabase as any)
                    .from('blog_posts')
                    .select('*')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false });

                if (error) throw error;
                setAllPosts(data || []);
            } catch (err: any) {
                setError('Could not load articles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filtered = useMemo(
        () =>
            activeCategory === 'All'
                ? allPosts
                : allPosts.filter(p => p.category === activeCategory),
        [allPosts, activeCategory]
    );

    const [featured, ...rest] = filtered;

    return (
        <>
            <Helmet>
                <title>Blog & Insights | EITO Group</title>
                <meta
                    name="description"
                    content="Expert insights on team building, corporate events, training programmes, and CSR from EITO Group — Malaysia's leading corporate experience partner."
                />
                <link rel="canonical" href="https://eitogroup.com.my/blog" />
                <meta property="og:title" content="Blog & Insights | EITO Group" />
                <meta
                    property="og:description"
                    content="Expert insights on team building, corporate events, training, and CSR."
                />
                <meta property="og:url" content="https://eitogroup.com.my/blog" />
                <meta property="og:type" content="website" />
            </Helmet>

            <main className="min-h-screen" style={{ background: '#f7f9fc' }}>
                {/* ── Hero Banner ─────────────────────────────────────────── */}
                <section
                    className="relative pt-32 pb-20 overflow-hidden"
                    style={{ background: COLORS.NAVY }}
                >
                    <div
                        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
                        style={{ background: COLORS.GOLD, transform: 'translate(30%, -30%)' }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                        style={{ background: COLORS.TEAL, transform: 'translate(-30%, 30%)' }}
                    />

                    <div className="relative max-w-5xl mx-auto px-6 text-center">
                        <p
                            className="text-xs font-black uppercase tracking-[0.3em] mb-4"
                            style={{ color: COLORS.GOLD }}
                        >
                            EITO Group
                        </p>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            Insights &amp; Ideas
                        </h1>
                        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#a8bfcc' }}>
                            Practical perspectives on building stronger teams, memorable events, and meaningful
                            workplace culture — straight from the field.
                        </p>
                    </div>
                </section>

                {/* ── Category Filter ──────────────────────────────────────── */}
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200"
                                style={
                                    activeCategory === cat
                                        ? { background: COLORS.NAVY, color: '#fff' }
                                        : { background: '#e8edf2', color: COLORS.NAVY }
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Article Grid ─────────────────────────────────────────── */}
                <div className="max-w-5xl mx-auto px-6 pb-24">
                    {loading ? (
                        <div className="text-center py-24">
                            <div
                                className="inline-block w-8 h-8 rounded-full border-4 border-t-transparent animate-spin mb-4"
                                style={{ borderColor: `${COLORS.NAVY} transparent ${COLORS.NAVY} ${COLORS.NAVY}` }}
                            />
                            <p className="text-gray-400 text-sm">Loading articles…</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-24">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            {/* Coming Soon Card */}
                            <div className="max-w-md mx-auto">
                                <div
                                    className="rounded-2xl p-12 text-center"
                                    style={{
                                        background: 'white',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        border: '1px solid #e8edf2'
                                    }}
                                >
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: COLORS.CREAM }}>
                                        <svg
                                            className="w-10 h-10"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={COLORS.NAVY}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        </svg>
                                    </div>

                                    <h3 className="text-2xl font-light mb-3" style={{ color: COLORS.NAVY }}>
                                        <span className="font-bold">Coming Soon!</span>
                                    </h3>

                                    <p className="text-sm mb-6" style={{ color: '#6b7a8a' }}>
                                        We're crafting something amazing for you.
                                        <br />
                                        Stay tuned for our latest articles.
                                    </p>

                                    <button
                                        className="text-sm font-medium transition-colors hover:opacity-80"
                                        style={{ color: COLORS.ORANGE }}
                                        onClick={() => setActiveCategory('All')}
                                    >
                                        View all articles →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featured && <BlogCard post={featured} featured />}
                            {rest.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default BlogIndex;