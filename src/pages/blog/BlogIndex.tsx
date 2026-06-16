// src/pages/blog/BlogIndex.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Footer from '../../components/ui/Footer';
import { getAllPosts, BlogPost } from '../../data/blogData';

const COLORS = {
    NAVY: '#153462',
    GOLD: '#fcb22f',
    ORANGE: '#f68921',
    TEAL: '#79989f',
    TEAL_DARK: '#18616e',
};

const CATEGORIES = ['All', 'Team Building', 'Corporate Events', 'Training', 'CSR'];

// ─── Card ───────────────────────────────────────────────────────────────────
const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured }) => {
    const date = new Date(post.published_at).toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Link
            to={`/blog/${post.slug}`}
            className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'md:col-span-2' : ''
                }`}
            style={{ border: '1px solid #e8edf2' }}
        >
            {/* Cover image */}
            <div className={`relative overflow-hidden ${featured ? 'h-72 md:h-96' : 'h-52'}`}>
                <img
                    src={post.cover_image}
                    alt={post.cover_image_alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                {/* Category pill */}
                <span
                    className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: COLORS.NAVY }}
                >
                    {post.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Meta row */}
                <div className="flex items-center gap-4 text-xs mb-3" style={{ color: COLORS.TEAL }}>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {post.read_time_minutes} min read
                    </span>
                </div>

                {/* Title */}
                <h2
                    className={`font-black leading-tight mb-3 group-hover:opacity-80 transition-opacity ${featured ? 'text-xl md:text-2xl' : 'text-lg'
                        }`}
                    style={{ color: COLORS.NAVY }}
                >
                    {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#5a6a7a' }}>
                    {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.slice(0, 3).map(tag => (
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

                {/* CTA */}
                <div
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:gap-3 transition-all"
                    style={{ color: COLORS.ORANGE }}
                >
                    Read Article <ArrowRight size={15} />
                </div>
            </div>
        </Link>
    );
};

// ─── Page ────────────────────────────────────────────────────────────────────
const BlogIndex: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const allPosts = useMemo(() => getAllPosts(), []);

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
                    {/* Decorative blobs */}
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
                    {filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-lg font-semibold" style={{ color: COLORS.NAVY }}>
                                No articles in this category yet.
                            </p>
                            <button
                                className="mt-4 text-sm underline"
                                style={{ color: COLORS.ORANGE }}
                                onClick={() => setActiveCategory('All')}
                            >
                                View all articles
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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