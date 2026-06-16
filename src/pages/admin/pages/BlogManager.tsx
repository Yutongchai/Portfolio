// src/pages/admin/BlogManager.tsx
// Full CRUD + scheduling for blog posts.
// Reads/writes to Supabase `blog_posts` table.
// Falls back to empty state gracefully if the table doesn't exist yet.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Clock, ArrowLeft, Upload, X, Check } from 'lucide-react';

const COLORS = {
    NAVY: '#153462',
    GOLD: '#fcb22f',
    ORANGE: '#f68921',
    TEAL: '#79989f',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPostRow {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image_url: string | null;
    category: string;
    tags: string[];
    author_name: string;
    content_json: string;          // serialised BlogSection[]
    is_published: boolean;
    published_at: string | null;   // ISO — null = draft
    scheduled_at: string | null;   // future date = schedule
    read_time_minutes: number;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;   // comma-separated
    created_at?: string;
    updated_at?: string;
}

type FormMode = 'list' | 'create' | 'edit';

// ─── Slug helper ──────────────────────────────────────────────────────────────
const toSlug = (title: string): string =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

// ─── Blank form ───────────────────────────────────────────────────────────────
const blankForm = (): Partial<BlogPostRow> => ({
    slug: '',
    title: '',
    excerpt: '',
    cover_image_url: null,
    category: 'Team Building',
    tags: [],
    author_name: 'EITO Group',
    content_json: JSON.stringify([
        { type: 'paragraph', text: 'Start writing your article here...' },
    ]),
    is_published: false,
    published_at: null,
    scheduled_at: null,
    read_time_minutes: 5,
    seo_title: null,
    seo_description: null,
    seo_keywords: null,
});

const CATEGORIES = ['Team Building', 'Corporate Events', 'Training', 'CSR', 'General'];

// ─── Component ────────────────────────────────────────────────────────────────
const BlogManager: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<BlogPostRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<FormMode>('list');
    const [form, setForm] = useState<Partial<BlogPostRow>>(blankForm());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Fetch ──
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            setErrorMsg('Could not load posts. Make sure the blog_posts table exists in Supabase.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Auto-slug from title ──
    const handleTitleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            title: value,
            // Only auto-generate slug when creating new
            ...(editingId === null ? { slug: toSlug(value) } : {}),
        }));
    };

    // ── Image upload ──
    const handleImageUpload = async (file: File) => {
        try {
            setUploadingImage(true);
            const ext = file.name.split('.').pop();
            const path = `blog-covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(path, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path);
            setForm(prev => ({ ...prev, cover_image_url: urlData.publicUrl }));
        } catch (err: any) {
            setErrorMsg('Image upload failed: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    // ── Save (create / update) ──
    const handleSave = async (publishNow = false) => {
        if (!form.title?.trim()) {
            setErrorMsg('Title is required.');
            return;
        }
        if (!form.slug?.trim()) {
            setErrorMsg('Slug is required.');
            return;
        }

        setSaving(true);
        setErrorMsg('');

        try {
            const payload: Partial<BlogPostRow> = {
                ...form,
                tags: Array.isArray(form.tags) ? form.tags : [],
                is_published: publishNow || form.is_published,
                published_at:
                    publishNow
                        ? new Date().toISOString()
                        : form.scheduled_at
                            ? null   // not published yet, just scheduled
                            : form.published_at,
                updated_at: new Date().toISOString(),
            };

            if (editingId) {
                const { error } = await (supabase as any)
                    .from('blog_posts')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
                setSuccessMsg('Article updated successfully.');
            } else {
                const { error } = await (supabase as any)
                    .from('blog_posts')
                    .insert({ ...payload, created_at: new Date().toISOString() });
                if (error) throw error;
                setSuccessMsg('Article created successfully.');
            }

            await fetchPosts();
            setMode('list');
            setForm(blankForm());
            setEditingId(null);
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to save article.');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ──
    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase as any).from('blog_posts').delete().eq('id', id);
            if (error) throw error;
            setPosts(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm(null);
            setSuccessMsg('Article deleted.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) {
            setErrorMsg(err.message);
        }
    };

    // ── Toggle publish ──
    const togglePublish = async (post: BlogPostRow) => {
        try {
            const updates = {
                is_published: !post.is_published,
                published_at: !post.is_published ? new Date().toISOString() : post.published_at,
            };
            const { error } = await (supabase as any)
                .from('blog_posts')
                .update(updates)
                .eq('id', post.id);
            if (error) throw error;
            setPosts(prev => prev.map(p => (p.id === post.id ? { ...p, ...updates } : p)));
        } catch (err: any) {
            setErrorMsg(err.message);
        }
    };

    // ── Open edit ──
    const openEdit = (post: BlogPostRow) => {
        setForm({ ...post });
        setEditingId(post.id);
        setTagInput('');
        setMode('edit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Add tag ──
    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !(form.tags ?? []).includes(t)) {
            setForm(prev => ({ ...prev, tags: [...(prev.tags ?? []), t] }));
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setForm(prev => ({ ...prev, tags: (prev.tags ?? []).filter(t => t !== tag) }));
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // ── LIST VIEW ──
    // ─────────────────────────────────────────────────────────────────────────────
    if (mode === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Dashboard
                        </button>
                        <h1 className="text-xl font-black" style={{ color: COLORS.NAVY }}>
                            Blog Manager
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => {
                                setForm(blankForm());
                                setEditingId(null);
                                setTagInput('');
                                setMode('create');
                            }}
                            className="flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} /> New Article
                        </Button>
                        <button
                            onClick={async () => { await signOut(); navigate('/'); }}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto px-6 py-8">
                    {/* Messages */}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 text-sm">
                            <Check size={16} /> {successMsg}
                        </div>
                    )}
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading articles...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 mb-4">No articles yet.</p>
                            <Button onClick={() => setMode('create')}>Create Your First Article</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map(post => {
                                const isScheduled =
                                    !post.is_published &&
                                    post.scheduled_at &&
                                    new Date(post.scheduled_at) > new Date();
                                return (
                                    <div
                                        key={post.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 flex gap-5 items-start"
                                        style={{ border: '1px solid #e8edf2' }}
                                    >
                                        {/* Thumbnail */}
                                        {post.cover_image_url ? (
                                            <img
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                className="w-28 h-20 rounded-xl object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div
                                                className="w-28 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                                                style={{ background: COLORS.NAVY }}
                                            >
                                                No Image
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                                                    style={{ background: COLORS.TEAL }}
                                                >
                                                    {post.category}
                                                </span>
                                                {post.is_published ? (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">
                                                        Published
                                                    </span>
                                                ) : isScheduled ? (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                                                        Scheduled · {new Date(post.scheduled_at!).toLocaleDateString('en-MY')}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-black text-base leading-snug truncate" style={{ color: COLORS.NAVY }}>
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                /blog/{post.slug} &nbsp;·&nbsp; {post.read_time_minutes} min read
                                            </p>
                                            {post.published_at && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Published: {new Date(post.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => togglePublish(post)}
                                                title={post.is_published ? 'Unpublish' : 'Publish now'}
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                style={{ color: post.is_published ? '#16a34a' : COLORS.TEAL }}
                                            >
                                                {post.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button
                                                onClick={() => openEdit(post)}
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                style={{ color: COLORS.NAVY }}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            {deleteConfirm === post.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-bold"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-xs px-2 py-1 bg-gray-200 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(post.id)}
                                                    className="p-2 rounded-xl hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // ── CREATE / EDIT FORM ──
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Bar */}
            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setMode('list'); setForm(blankForm()); setEditingId(null); }}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h1 className="text-xl font-black" style={{ color: COLORS.NAVY }}>
                        {editingId ? 'Edit Article' : 'New Article'}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        {saving ? 'Saving…' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="text-sm"
                    >
                        {saving ? 'Publishing…' : 'Publish Now'}
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Alerts */}
                {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                        <X size={16} /> {errorMsg}
                        <button className="ml-auto" onClick={() => setErrorMsg('')}><X size={14} /></button>
                    </div>
                )}

                {/* ── Basic Info ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-5" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Basic Info</h2>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Title *
                        </label>
                        <input
                            className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your compelling article title"
                            value={form.title ?? ''}
                            onChange={e => handleTitleChange(e.target.value)}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            URL Slug *
                        </label>
                        <div className="flex items-center rounded-xl border overflow-hidden dark:border-gray-600">
                            <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 border-r dark:border-gray-600">
                                /blog/
                            </span>
                            <input
                                className="flex-1 px-3 py-3 text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="url-slug"
                                value={form.slug ?? ''}
                                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Edit if needed.</p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Excerpt
                        </label>
                        <textarea
                            rows={3}
                            className="w-full border rounded-xl px-4 py-3 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="One or two sentences summarising the article..."
                            value={form.excerpt ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        />
                    </div>

                    {/* Category + Read time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                                Category
                            </label>
                            <select
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.category ?? ''}
                                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                            >
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                                Read Time (min)
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={60}
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.read_time_minutes ?? 5}
                                onChange={e => setForm(prev => ({ ...prev, read_time_minutes: Number(e.target.value) }))}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {(form.tags ?? []).map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                                    style={{ background: '#e8edf2', color: COLORS.TEAL }}
                                >
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                        <X size={11} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 border rounded-xl px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Add tag and press Enter"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                            />
                            <button
                                onClick={addTag}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                                style={{ background: COLORS.NAVY }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Cover Image ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Cover Image</h2>

                    {form.cover_image_url && (
                        <div className="relative">
                            <img
                                src={form.cover_image_url}
                                alt="Cover preview"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                            <button
                                onClick={() => setForm(prev => ({ ...prev, cover_image_url: null }))}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            className="hidden"
                            onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploadingImage}
                            className="flex items-center gap-2 text-sm px-4 py-3 border-2 border-dashed rounded-xl w-full justify-center font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                            style={{ borderColor: COLORS.TEAL, color: COLORS.NAVY }}
                        >
                            <Upload size={16} />
                            {uploadingImage ? 'Uploading…' : form.cover_image_url ? 'Change Image' : 'Upload Cover Image'}
                        </button>
                        <p className="text-xs text-gray-400 mt-1">Or paste an image URL below:</p>
                        <input
                            className="w-full border rounded-xl px-4 py-2.5 text-sm mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="https://images.unsplash.com/..."
                            value={form.cover_image_url ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))}
                        />
                    </div>
                </section>

                {/* ── Content (JSON editor) ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Article Content</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                JSON array of content sections. Types: <code>paragraph</code>, <code>heading</code>,{' '}
                                <code>quote</code>, <code>list</code>, <code>image</code>, <code>callout</code>.
                            </p>
                        </div>
                    </div>
                    <textarea
                        rows={16}
                        className="w-full border rounded-xl px-4 py-3 text-xs font-mono resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={form.content_json ?? '[]'}
                        onChange={e => setForm(prev => ({ ...prev, content_json: e.target.value }))}
                        spellCheck={false}
                    />
                    <p className="text-xs text-gray-400">
                        Example section: <code>{`{"type":"paragraph","text":"Your text here."}`}</code>
                    </p>
                </section>

                {/* ── Publishing Schedule ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-5" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Publishing</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Manual publish date (if already published) */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 flex items-center gap-1.5">
                                <Calendar size={13} /> Publish Date
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.published_at ? form.published_at.slice(0, 16) : ''}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                                    }))
                                }
                            />
                            <p className="text-xs text-gray-400 mt-1">Leave blank to set on first publish.</p>
                        </div>

                        {/* Schedule future */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 flex items-center gap-1.5">
                                <Clock size={13} /> Schedule for Future
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ''}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                                    }))
                                }
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Article goes live automatically at this time (requires a Supabase cron job or check on load).
                            </p>
                        </div>
                    </div>

                    {/* Status toggle */}
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={form.is_published ?? false}
                                onChange={e => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
                            />
                            <div
                                className="w-11 h-6 rounded-full transition-colors"
                                style={{ background: form.is_published ? '#16a34a' : '#d1d5db' }}
                            >
                                <div
                                    className="w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5"
                                    style={{ transform: form.is_published ? 'translateX(20px)' : 'translateX(0)' }}
                                />
                            </div>
                        </label>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {form.is_published ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </section>

                {/* ── SEO ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>SEO</h2>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            SEO Title
                        </label>
                        <input
                            className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Defaults to article title + | EITO Group"
                            value={form.seo_title ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, seo_title: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Meta Description
                        </label>
                        <textarea
                            rows={2}
                            className="w-full border rounded-xl px-4 py-3 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="150–160 character description for Google"
                            value={form.seo_description ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, seo_description: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Keywords (comma-separated)
                        </label>
                        <input
                            className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="team building Malaysia, corporate events KL"
                            value={form.seo_keywords ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, seo_keywords: e.target.value }))}
                        />
                    </div>
                </section>

                {/* Sticky save bar */}
                <div className="pb-12 flex gap-3 justify-end">
                    <Button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        {saving ? 'Saving…' : 'Save Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className="text-sm">
                        {saving ? 'Publishing…' : 'Publish Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BlogManager;