// src/pages/blog/BlogPost.tsx
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, ChevronRight } from 'lucide-react';
import Footer from '../../components/ui/Footer';
import { getPostBySlug, getOtherPosts, BlogPost as BlogPostType, BlogSection } from '../../data/blogData';

const COLORS = {
  NAVY: '#153462',
  GOLD: '#fcb22f',
  ORANGE: '#f68921',
  TEAL: '#79989f',
  TEAL_DARK: '#18616e',
};

// ─── Content Renderer ────────────────────────────────────────────────────────
const ContentSection: React.FC<{ section: BlogSection }> = ({ section }) => {
  switch (section.type) {
    case 'heading':
      return section.level === 2 ? (
        <h2
          className="text-2xl md:text-3xl font-black mt-12 mb-4 leading-tight"
          style={{ color: COLORS.NAVY }}
        >
          {section.text}
        </h2>
      ) : (
        <h3
          className="text-xl font-bold mt-8 mb-3 leading-tight"
          style={{ color: COLORS.NAVY }}
        >
          {section.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: '#3a4a5a' }}>
          {section.text}
        </p>
      );

    case 'quote':
      return (
        <blockquote
          className="relative my-10 pl-6 py-4 italic text-lg md:text-xl leading-relaxed"
          style={{
            borderLeft: `4px solid ${COLORS.GOLD}`,
            color: COLORS.NAVY,
          }}
        >
          {section.text}
        </blockquote>
      );

    case 'list':
      return (
        <ul className="mb-6 space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base" style={{ color: '#3a4a5a' }}>
              <span
                className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: COLORS.ORANGE }}
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <figure className="my-10">
          <img
            src={section.src}
            alt={section.alt}
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: '480px' }}
            loading="lazy"
          />
          {section.caption && (
            <figcaption
              className="text-center text-sm mt-3 italic"
              style={{ color: COLORS.TEAL }}
            >
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'callout':
      return (
        <div
          className="my-10 p-6 rounded-2xl flex gap-4 items-start"
          style={{ background: `${COLORS.NAVY}0d`, border: `1px solid ${COLORS.NAVY}22` }}
        >
          <span className="text-2xl select-none">💡</span>
          <p className="text-base leading-relaxed font-medium" style={{ color: COLORS.NAVY }}>
            {section.text}
          </p>
        </div>
      );

    default:
      return null;
  }
};

// ─── Sidebar Other Articles ───────────────────────────────────────────────────
const SidebarCard: React.FC<{ post: BlogPostType }> = ({ post }) => {
  const date = new Date(post.published_at).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="flex gap-3 group py-4 border-b last:border-b-0"
      style={{ borderColor: '#e8edf2' }}
    >
      <img
        src={post.cover_image}
        alt={post.cover_image_alt}
        className="w-20 h-16 rounded-xl object-cover flex-shrink-0 group-hover:opacity-90 transition-opacity"
      />
      <div>
        <p className="text-xs mb-1" style={{ color: COLORS.TEAL }}>
          {date}
        </p>
        <p
          className="text-sm font-bold leading-snug group-hover:opacity-75 transition-opacity line-clamp-2"
          style={{ color: COLORS.NAVY }}
        >
          {post.title}
        </p>
      </div>
    </Link>
  );
};

// ─── See Other Articles row ───────────────────────────────────────────────────
const OtherArticleCard: React.FC<{ post: BlogPostType }> = ({ post }) => {
  const date = new Date(post.published_at).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={{ border: '1px solid #e8edf2' }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={post.cover_image}
          alt={post.cover_image_alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
          style={{ background: COLORS.NAVY }}
        >
          {post.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs mb-2 flex items-center gap-1" style={{ color: COLORS.TEAL }}>
          <Calendar size={12} /> {date}
        </p>
        <h3
          className="font-black text-base leading-snug mb-2 group-hover:opacity-75 transition-opacity line-clamp-2"
          style={{ color: COLORS.NAVY }}
        >
          {post.title}
        </h3>
        <div
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mt-1"
          style={{ color: COLORS.ORANGE }}
        >
          Read <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const BlogPost: React.FC = () => {
  const { slug } = useParams() as { slug?: string };
  const navigate = useNavigate();

  const post = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug]);
  const others = useMemo(() => (slug ? getOtherPosts(slug, 3) : []), [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // 404-like redirect if post not found
  useEffect(() => {
    if (slug && !post) {
      navigate('/blog', { replace: true });
    }
  }, [post, slug, navigate]);

  if (!post) return null;

  const publishDate = new Date(post.published_at).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canonicalUrl = `https://eitogroup.com.my/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.seo_title ?? post.title + ' | EITO Group'}</title>
        <meta name="description" content={post.seo_description ?? post.excerpt} />
        {post.seo_keywords && (
          <meta name="keywords" content={post.seo_keywords.join(', ')} />
        )}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.seo_title ?? post.title} />
        <meta property="og:description" content={post.seo_description ?? post.excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.cover_image} />
        <meta property="article:published_time" content={post.published_at} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              image: post.cover_image,
              datePublished: post.published_at,
              author: { '@type': 'Organization', name: post.author_name },
              publisher: {
                '@type': 'Organization',
                name: 'EITO Group',
                url: 'https://eitogroup.com.my',
              },
              url: canonicalUrl,
            }),
          }}
        />
      </Helmet>

      <main className="min-h-screen" style={{ background: '#f7f9fc' }}>
        {/* ── 1. Cover / Hero Image ─────────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ height: 'min(70vh, 560px)' }}>
          <img
            src={post.cover_image}
            alt={post.cover_image_alt}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(21,52,98,0.35) 0%, rgba(21,52,98,0.75) 100%)',
            }}
          />

          {/* Breadcrumb */}
          <nav
            className="absolute top-28 left-6 md:left-12 flex items-center gap-2 text-xs font-semibold text-white/80"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={13} />
            <Link to="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight size={13} />
            <span className="text-white/60 truncate max-w-[180px]">{post.category}</span>
          </nav>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
            <div className="max-w-3xl">
              <span
                className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white mb-4"
                style={{ background: COLORS.ORANGE }}
              >
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {publishDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.read_time_minutes} min read
                </span>
                <span className="font-semibold text-white">— {post.author_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Content Area ───────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Main content */}
          <article>
            {/* Excerpt / lead */}
            <p
              className="text-lg md:text-xl leading-relaxed font-medium mb-8 pb-8"
              style={{
                color: '#3a4a5a',
                borderBottom: `2px solid ${COLORS.GOLD}`,
              }}
            >
              {post.excerpt}
            </p>

            {/* Rich sections */}
            {post.content.map((section, i) => (
              <ContentSection key={i} section={section} />
            ))}

            {/* Tags */}
            <div className="mt-10 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid #e8edf2' }}>
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold"
                  style={{ background: '#e8edf2', color: COLORS.TEAL_DARK }}
                >
                  <Tag size={11} />
                  {tag}
                </span>
              ))}
            </div>

            {/* ── 4. See Other Articles button ─────────────────── */}
            <div className="mt-12 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm text-white transition-all hover:opacity-90 hover:gap-3"
                style={{ background: COLORS.NAVY }}
              >
                <ArrowLeft size={16} />
                See Other Articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-28 bg-white rounded-2xl p-6"
              style={{ border: '1px solid #e8edf2' }}
            >
              <h4
                className="text-xs font-black uppercase tracking-[0.2em] mb-4 pb-3"
                style={{ color: COLORS.NAVY, borderBottom: `2px solid ${COLORS.GOLD}` }}
              >
                More Articles
              </h4>
              {others.map(p => (
                <SidebarCard key={p.id} post={p} />
              ))}
              <Link
                to="/blog"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: COLORS.ORANGE }}
              >
                All Articles <ArrowRight size={13} />
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Mobile "See other articles" cards row ────────────── */}
        {others.length > 0 && (
          <section
            className="lg:hidden max-w-6xl mx-auto px-6 pb-16"
            aria-label="Other articles"
          >
            <div
              className="flex items-center justify-between mb-6 pb-3"
              style={{ borderBottom: `2px solid ${COLORS.GOLD}` }}
            >
              <h2 className="text-lg font-black uppercase tracking-wider" style={{ color: COLORS.NAVY }}>
                More Articles
              </h2>
              <Link
                to="/blog"
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                style={{ color: COLORS.ORANGE }}
              >
                See all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {others.slice(0, 2).map(p => (
                <OtherArticleCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Desktop "See other articles" full row */}
        {others.length > 0 && (
          <section
            className="hidden lg:block max-w-6xl mx-auto px-6 pb-20"
            aria-label="Other articles"
          >
            <div
              className="flex items-center justify-between mb-8 pb-3"
              style={{ borderBottom: `2px solid ${COLORS.GOLD}` }}
            >
              <h2
                className="text-xl font-black uppercase tracking-wider"
                style={{ color: COLORS.NAVY }}
              >
                See Other Articles
              </h2>
              <Link
                to="/blog"
                className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 hover:gap-2.5 transition-all"
                style={{ color: COLORS.ORANGE }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {others.map(p => (
                <OtherArticleCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── 5. Footer ────────────────────────────────────────────── */}
      <Footer />
    </>
  );
};

export default BlogPost;