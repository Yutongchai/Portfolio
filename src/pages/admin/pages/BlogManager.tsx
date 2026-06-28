// src/pages/admin/BlogManager.tsx
// Full CRUD + scheduling for blog posts.
// Access is restricted to DEV_EMAIL — other admins see a locked view.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import {
    Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Clock,
    ArrowLeft, Upload, X, Check, Lock, ChevronDown, ChevronUp,
    Image as ImageIcon, ExternalLink, ClipboardList,
    Bold, Italic, Underline, Strikethrough, Link as LinkIcon,
} from 'lucide-react';

// ── YOUR email — only this account gets full edit access ──────────────────────
const DEV_EMAIL = 'yutongchai2@gmail.com';

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
    content_json: string;
    is_published: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    read_time_minutes: number;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    created_at?: string;
    updated_at?: string;
}

type FormMode = 'list' | 'create' | 'edit';

const toSlug = (title: string): string =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

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
    ], null, 2),
    is_published: false,
    published_at: null,
    scheduled_at: null,
    read_time_minutes: 5,
    seo_title: null,
    seo_description: null,
    seo_keywords: null,
});

const CATEGORIES = ['Team Building', 'Corporate Events', 'Training', 'CSR', 'General'];

// ─── Snippet templates ────────────────────────────────────────────────────────
const SNIPPETS = [
    {
        label: 'Paragraph',
        icon: '¶',
        color: '#6366f1',
        json: { type: 'paragraph', text: 'Your paragraph text here.' },
    },
    {
        label: 'Heading H2',
        icon: 'H2',
        color: COLORS.NAVY,
        json: { type: 'heading', level: 2, text: 'Section Title' },
    },
    {
        label: 'Heading H3',
        icon: 'H3',
        color: COLORS.NAVY,
        json: { type: 'heading', level: 3, text: 'Sub-heading' },
    },
    {
        label: 'Quote',
        icon: '"',
        color: COLORS.GOLD,
        json: { type: 'quote', text: 'An inspiring quote goes here.' },
    },
    {
        label: 'Numbered List',
        icon: '1.',
        color: COLORS.ORANGE,
        json: { type: 'list', items: ['First point', 'Second point', 'Third point'] },
    },
    {
        label: 'Image',
        icon: '🖼',
        color: COLORS.TEAL,
        json: { type: 'image', src: 'https://YOUR-IMAGE-URL.jpg', alt: 'Description', caption: 'Optional caption' },
    },
    {
        label: 'Callout Box',
        icon: '💡',
        color: '#16a34a',
        json: { type: 'callout', text: 'Key insight or takeaway to highlight.' },
    },
    {
        label: 'Clickable Link',
        icon: '🔗',
        color: COLORS.ORANGE,
        json: { type: 'link', href: 'https://example.com', label: 'Click here to learn more' },
    },
];

// ─── Rich Text Editor Component ──────────────────────────────────────────────
// ─── Rich Text Editor Component ──────────────────────────────────────────────
interface RichTextEditorProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className = '' }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [selectionRange, setSelectionRange] = useState<Range | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const isInternalChange = useRef(false);

    // Initialize and update content - ONLY when external value changes
    useEffect(() => {
        if (editorRef.current && !isInternalChange.current) {
            const currentHtml = editorRef.current.innerHTML;
            const newHtml = value || '';
            if (currentHtml !== newHtml) {
                // Save selection
                const sel = window.getSelection();
                let savedRange: Range | null = null;
                let savedOffset = 0;
                let savedNode: Node | null = null;

                if (sel && sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    if (editorRef.current.contains(range.commonAncestorContainer)) {
                        savedRange = range.cloneRange();
                        savedNode = range.startContainer;
                        savedOffset = range.startOffset;
                    }
                }

                editorRef.current.innerHTML = newHtml;

                // Try to restore cursor position
                if (savedRange) {
                    try {
                        // Try to find the text node at the saved position
                        const walker = document.createTreeWalker(
                            editorRef.current,
                            NodeFilter.SHOW_TEXT,
                            null,
                        );

                        let textNode: Node | null = null;
                        let found = false;

                        while (walker.nextNode()) {
                            const node = walker.currentNode;
                            if (node.textContent && node.textContent.length > 0) {
                                // If we can find a reasonable position, restore it
                                const range = document.createRange();
                                try {
                                    range.setStart(node, Math.min(savedOffset, node.textContent.length));
                                    range.collapse(true);
                                    sel?.removeAllRanges();
                                    sel?.addRange(range);
                                    found = true;
                                    break;
                                } catch (e) {
                                    continue;
                                }
                            }
                        }

                        if (!found) {
                            // Fallback: put cursor at end
                            const range = document.createRange();
                            range.selectNodeContents(editorRef.current);
                            range.collapse(false);
                            sel?.removeAllRanges();
                            sel?.addRange(range);
                        }
                    } catch (e) {
                        // Fallback: put cursor at end
                        const range = document.createRange();
                        range.selectNodeContents(editorRef.current);
                        range.collapse(false);
                        sel?.removeAllRanges();
                        sel?.addRange(range);
                    }
                }
            }
        }
        isInternalChange.current = false;
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            // Only trigger onChange if content actually changed
            if (html !== value) {
                isInternalChange.current = true;
                onChange(html);
            }
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value || '');
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            isInternalChange.current = true;
            onChange(html);
        }
        editorRef.current?.focus();
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleUnderline = () => execCommand('underline');
    const handleStrikethrough = () => execCommand('strikeThrough');

    const handleLink = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setLinkText('');
            setLinkUrl('');
            setShowLinkModal(true);
            return;
        }

        const range = selection.getRangeAt(0);
        const parentLink = range.commonAncestorContainer.parentElement?.closest?.('a');
        if (parentLink) {
            const text = parentLink.textContent || '';
            const parent = parentLink.parentNode;
            if (parent) {
                const textNode = document.createTextNode(text);
                parent.replaceChild(textNode, parentLink);
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(parent);
                selection.addRange(newRange);
                if (editorRef.current) {
                    const html = editorRef.current.innerHTML;
                    isInternalChange.current = true;
                    onChange(html);
                }
            }
            return;
        }

        const selectedText = selection.toString();
        if (selectedText) {
            setLinkText(selectedText);
            setLinkUrl('');
            setSelectionRange(range.cloneRange());
            setShowLinkModal(true);
        }
    };

    const insertLink = () => {
        if (!linkUrl) return;

        const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://')
            ? linkUrl
            : `https://${linkUrl}`;

        if (selectionRange) {
            selectionRange.deleteContents();
            const linkNode = document.createElement('a');
            linkNode.href = url;
            linkNode.target = '_blank';
            linkNode.rel = 'noopener noreferrer';
            linkNode.textContent = linkText || url;

            selectionRange.insertNode(linkNode);

            const range = document.createRange();
            range.setStartAfter(linkNode);
            range.collapse(true);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        } else {
            const sel = window.getSelection();
            if (sel) {
                const range = sel.getRangeAt(0);
                const linkNode = document.createElement('a');
                linkNode.href = url;
                linkNode.target = '_blank';
                linkNode.rel = 'noopener noreferrer';
                linkNode.textContent = linkText || url;
                range.insertNode(linkNode);

                const newRange = document.createRange();
                newRange.setStartAfter(linkNode);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
            }
        }

        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            isInternalChange.current = true;
            onChange(html);
        }
        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
        setSelectionRange(null);
        editorRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertParagraph');
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();

        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        if (html) {
            document.execCommand('insertHTML', false, html);
        } else if (text) {
            document.execCommand('insertText', false, text);
        }
    };

    return (
        <div className="rich-text-editor">
            {/* Toolbar */}
            <div className="flex items-center gap-1 flex-wrap mb-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={handleBold}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    type="button"
                    onClick={handleItalic}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    type="button"
                    onClick={handleUnderline}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Underline (Ctrl+U)"
                >
                    <Underline size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    type="button"
                    onClick={handleStrikethrough}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Strikethrough"
                >
                    <Strikethrough size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                    type="button"
                    onClick={handleLink}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Insert Link (Ctrl+K)"
                >
                    <LinkIcon size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <div className="flex-1" />
                <span className="text-xs text-gray-400">
                    {isFocused ? 'Editing...' : 'Click to edit'}
                </span>
            </div>

            {/* Editor - NO dangerouslySetInnerHTML, just render the ref */}
            <div
                ref={editorRef}
                contentEditable
                className={`rich-text-content min-h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                    lineHeight: '1.7',
                    fontSize: '15px',
                }}
            />

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" style={{ border: '1px solid #e8edf2' }}>
                        <h3 className="font-black text-lg mb-4" style={{ color: COLORS.NAVY }}>Insert Link</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Link Text</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Text to display"
                                    value={linkText}
                                    onChange={e => setLinkText(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">URL</label>
                                <input
                                    type="url"
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={e => setLinkUrl(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && insertLink()}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                    setSelectionRange(null);
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertLink}
                                className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                                style={{ background: COLORS.NAVY }}
                                disabled={!linkUrl}
                            >
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .rich-text-content a {
                    color: #2563eb;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .rich-text-content a:hover {
                    color: #1d4ed8;
                }
                .rich-text-content strong {
                    font-weight: 700;
                }
                .rich-text-content em {
                    font-style: italic;
                }
                .rich-text-content u {
                    text-decoration: underline;
                }
                .rich-text-content del {
                    text-decoration: line-through;
                }
                .rich-text-content p {
                    margin-bottom: 0.75rem;
                    min-height: 1.2em;
                }
                .rich-text-content p:last-child {
                    margin-bottom: 0;
                }
                .rich-text-content div {
                    min-height: 1.2em;
                }
                .rich-text-content br {
                    display: block;
                    content: "";
                    margin: 0.5rem 0;
                }
            `}</style>
        </div>
    );
};

// ─── Locked View ──────────────────────────────────────────────────────────────
const LockedView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm" style={{ border: '1px solid #e8edf2' }}>
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${COLORS.NAVY}15` }}
            >
                <Lock size={28} style={{ color: COLORS.NAVY }} />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: COLORS.NAVY }}>Blog Manager</h2>
            <p className="text-sm text-gray-500 mb-6">
                This section is managed by the developer. Contact your developer to publish or update articles.
            </p>
            <button
                onClick={onBack}
                className="text-sm font-semibold flex items-center gap-2 mx-auto"
                style={{ color: COLORS.NAVY }}
            >
                <ArrowLeft size={15} /> Back to Dashboard
            </button>
        </div>
    </div>
);

// ─── Pre-deploy Checklist Modal ───────────────────────────────────────────────
const CHECKLIST_ITEMS = [
    { id: 'title', label: 'Title is filled in and compelling' },
    { id: 'slug', label: 'URL slug is set (no spaces, lowercase)' },
    { id: 'excerpt', label: 'Excerpt is 1–2 sentences summarising the article' },
    { id: 'cover', label: 'Cover image is uploaded or URL is set' },
    { id: 'content', label: 'content_json is valid JSON (no red errors in the editor)' },
    { id: 'seo_desc', label: 'Meta Description is filled (150–160 characters ideal)' },
    { id: 'seo_title', label: 'SEO Title is set (or leave blank to use article title)' },
    { id: 'published', label: 'Published toggle is ON or "Publish Now" will be clicked' },
    { id: 'live', label: 'After saving, visit /blog and confirm article appears' },
    { id: 'post_link', label: 'Click into the article and confirm content renders correctly' },
    { id: 'og', label: 'Share the URL on WhatsApp / Telegram — og:image preview looks good' },
    { id: 'google', label: '(Optional) Submit URL in Google Search Console for faster indexing' },
];

const PreDeployChecklist: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    const doneCount = Object.values(checked).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{ border: '1px solid #e8edf2' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8edf2' }}>
                    <div className="flex items-center gap-2">
                        <ClipboardList size={18} style={{ color: COLORS.NAVY }} />
                        <h3 className="font-black text-base" style={{ color: COLORS.NAVY }}>Pre-Deploy Checklist</h3>
                    </div>
                    <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
                </div>

                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/40">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span style={{ color: COLORS.NAVY }}>{doneCount} / {CHECKLIST_ITEMS.length} done</span>
                        {doneCount === CHECKLIST_ITEMS.length && (
                            <span className="text-green-600 flex items-center gap-1"><Check size={12} /> All clear — ready to deploy!</span>
                        )}
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200">
                        <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${(doneCount / CHECKLIST_ITEMS.length) * 100}%`, background: doneCount === CHECKLIST_ITEMS.length ? '#16a34a' : COLORS.ORANGE }}
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                    {CHECKLIST_ITEMS.map(item => (
                        <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                            <div
                                className="w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all"
                                style={{
                                    background: checked[item.id] ? '#16a34a' : 'transparent',
                                    borderColor: checked[item.id] ? '#16a34a' : '#d1d5db',
                                }}
                                onClick={() => toggle(item.id)}
                            >
                                {checked[item.id] && <Check size={12} className="text-white" />}
                            </div>
                            <span
                                className="text-sm leading-snug transition-colors"
                                style={{ color: checked[item.id] ? '#9ca3af' : '#374151', textDecoration: checked[item.id] ? 'line-through' : 'none' }}
                                onClick={() => toggle(item.id)}
                            >
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: '#e8edf2' }}>
                    <Button onClick={onClose} className="text-sm">Done</Button>
                </div>
            </div>
        </div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
const BlogManager: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // ── Access gate ──
    const isDevUser = user?.email === DEV_EMAIL;

    const [posts, setPosts] = useState<BlogPostRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<FormMode>('list');
    const [form, setForm] = useState<Partial<BlogPostRow>>(blankForm());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingContentImage, setUploadingContentImage] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showGuide, setShowGuide] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);
    const [jsonError, setJsonError] = useState('');
    const [draftRestored, setDraftRestored] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [editorBlocks, setEditorBlocks] = useState<any[]>([]);
    const [editorMode, setEditorMode] = useState<'visual' | 'json'>('visual');
    const fileRef = useRef<HTMLInputElement>(null);
    const contentImageRef = useRef<HTMLInputElement>(null);

    const DRAFT_KEY = 'blog_manager_draft';

    // ── Restore draft from localStorage on mount ──
    useEffect(() => {
        if (!isDevUser) return;
        try {
            const saved = localStorage.getItem(DRAFT_KEY);
            if (saved) {
                const { form: savedForm, editingId: savedEditingId, mode: savedMode } = JSON.parse(saved);
                if (savedForm && savedForm.title?.trim()) {
                    setForm(savedForm);
                    setEditingId(savedEditingId ?? null);
                    setMode(savedMode ?? 'create');
                    setDraftRestored(true);
                }
            }
        } catch { /* ignore corrupt drafts */ }
        fetchPosts();
    }, [isDevUser]);

    // ── Auto-save form to localStorage whenever it changes ──
    useEffect(() => {
        if (mode === 'list') return;
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, editingId, mode }));
        } catch { /* ignore quota errors */ }
    }, [form, editingId, mode]);

    const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch { } };

    // ── Sync editorBlocks ↔ form.content_json ──
    const blocksToJson = (blocks: any[]) => JSON.stringify(blocks, null, 2);
    const jsonToBlocks = (json: string): any[] => { try { return JSON.parse(json) || []; } catch { return []; } };

    useEffect(() => {
        setEditorBlocks(jsonToBlocks(form.content_json ?? '[]'));
    }, [mode]);

    const updateBlocks = (blocks: any[]) => {
        setEditorBlocks(blocks);
        const newJson = blocksToJson(blocks);
        setForm(prev => ({ ...prev, content_json: newJson }));
        try { JSON.parse(newJson); setJsonError(''); } catch { setJsonError('⚠️ JSON is invalid.'); }
    };

    const updateBlock = (index: number, updated: any) => {
        const blocks = [...editorBlocks];
        blocks[index] = updated;
        updateBlocks(blocks);
    };

    const deleteBlock = (index: number) => {
        const blocks = editorBlocks.filter((_, i) => i !== index);
        updateBlocks(blocks);
    };

    const moveBlock = (index: number, dir: 'up' | 'down') => {
        const blocks = [...editorBlocks];
        const swap = dir === 'up' ? index - 1 : index + 1;
        if (swap < 0 || swap >= blocks.length) return;
        [blocks[index], blocks[swap]] = [blocks[swap], blocks[index]];
        updateBlocks(blocks);
    };

    const insertBlockAt = (index: number, block: any) => {
        const blocks = [...editorBlocks];
        blocks.splice(index + 1, 0, block);
        updateBlocks(blocks);
    };

    // ── Paste text → JSON converter ──
    const convertPasteToBlocks = (text: string): any[] => {
        const sections = text.split(/\n\s*\n/).filter(s => s.trim());
        const blocks: any[] = [];

        for (const section of sections) {
            const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) continue;

            const firstLine = lines[0];

            if (lines.length === 1) {
                const line = lines[0];
                if (/^#{1,3}\s/.test(line)) {
                    const level = line.startsWith('##') ? 3 : 2;
                    blocks.push({ type: 'heading', level, text: line.replace(/^#+\s*/, '') });
                    continue;
                }
                if (line.length < 80 && line === line.toUpperCase() && /[A-Z]/.test(line) && !line.endsWith('.')) {
                    blocks.push({ type: 'heading', level: 2, text: line });
                    continue;
                }
                if (line.startsWith('> ') || (line.startsWith('"') && line.endsWith('"'))) {
                    blocks.push({ type: 'quote', text: line.replace(/^>\s*/, '').replace(/^"|"$/g, '') });
                    continue;
                }
                if (line.startsWith('💡') || line.toLowerCase().startsWith('note:') || line.toLowerCase().startsWith('tip:')) {
                    blocks.push({ type: 'callout', text: line.replace(/^💡|^note:|^tip:/i, '').trim() });
                    continue;
                }
                if (/^[-•*]\s/.test(line) || /^\d+\.\s/.test(line)) {
                    blocks.push({ type: 'list', items: [line.replace(/^[-•*\d.]+\s*/, '')] });
                    continue;
                }
                blocks.push({ type: 'paragraph', text: line });
                continue;
            }

            const isList = lines.every(l => /^[-•*]\s/.test(l) || /^\d+\.\s/.test(l));
            if (isList) {
                const items = lines.map(l => l.replace(/^[-•*\d.]+\s*/, ''));
                blocks.push({ type: 'list', items });
                continue;
            }

            const isQuoteBlock = lines.every(l => l.startsWith('> '));
            if (isQuoteBlock) {
                const text = lines.map(l => l.replace(/^>\s*/, '')).join(' ');
                blocks.push({ type: 'quote', text });
                continue;
            }

            const firstIsHeading = /^#{1,3}\s/.test(firstLine) ||
                (firstLine.length < 80 && firstLine === firstLine.toUpperCase() && /[A-Z]/.test(firstLine) && !firstLine.endsWith('.'));

            if (firstIsHeading) {
                let headingText = firstLine;
                if (/^#{1,3}\s/.test(firstLine)) {
                    const level = firstLine.startsWith('##') ? 3 : 2;
                    headingText = firstLine.replace(/^#+\s*/, '');
                    blocks.push({ type: 'heading', level, text: headingText });
                } else {
                    blocks.push({ type: 'heading', level: 2, text: firstLine });
                }
                const remaining = lines.slice(1);
                if (remaining.length > 0) {
                    blocks.push({ type: 'paragraph', text: remaining.join(' ') });
                }
                continue;
            }

            blocks.push({ type: 'paragraph', text: lines.join(' ') });
        }

        return blocks;
    };

    const handlePasteConvert = () => {
        if (!pasteText.trim()) return;
        const newBlocks = convertPasteToBlocks(pasteText);
        const existing = editorBlocks.filter(b => b.type !== 'paragraph' || b.text !== 'Start writing your article here...');
        updateBlocks([...existing, ...newBlocks]);
        setPasteText('');
        setShowPasteModal(false);
        setEditorMode('visual');
    };

    // ── Fetch posts ──
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from('blog_posts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            setErrorMsg('Could not load posts. Make sure the blog_posts table exists in Supabase.');
        } finally {
            setLoading(false);
        }
    };

    // ── Non-dev users see locked screen ──
    if (!isDevUser) return <LockedView onBack={() => navigate('/admin/dashboard')} />;

    // ── Title → slug ──
    const handleTitleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            title: value,
            ...(editingId === null ? { slug: toSlug(value) } : {}),
        }));
    };

    // ── Validate JSON on change ──
    const handleContentChange = (value: string) => {
        setForm(prev => ({ ...prev, content_json: value }));
        try { JSON.parse(value); setJsonError(''); } catch { setJsonError('⚠️ JSON is invalid — fix before saving.'); }
    };

    // ── Insert snippet into content ──
    const insertSnippet = (snippet: typeof SNIPPETS[0]) => {
        updateBlocks([...editorBlocks, { ...snippet.json }]);
    };

    // ── Cover image upload ──
    const handleCoverUpload = async (file: File) => {
        try {
            setUploadingImage(true);
            const ext = file.name.split('.').pop();
            const path = `blog-covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('blog-images').upload(path, file, { cacheControl: '3600', upsert: false });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path);
            setForm(prev => ({ ...prev, cover_image_url: urlData.publicUrl }));
        } catch (err: any) {
            setErrorMsg('Cover upload failed: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    // ── Content image upload ──
    const handleContentImageUpload = async (file: File) => {
        try {
            setUploadingContentImage(true);
            const ext = file.name.split('.').pop();
            const path = `blog-content/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('blog-images').upload(path, file, { cacheControl: '3600', upsert: false });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path);
            updateBlocks([...editorBlocks, { type: 'image', src: urlData.publicUrl, alt: file.name.replace(/\.[^/.]+$/, ''), caption: '' }]);
            setJsonError('');
            setSuccessMsg('Image uploaded and added to content!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) {
            setErrorMsg('Content image upload failed: ' + err.message);
        } finally {
            setUploadingContentImage(false);
        }
    };

    // ── Save ──
    const handleSave = async (publishNow = false) => {
        if (!form.title?.trim()) { setErrorMsg('Title is required.'); return; }
        if (!form.slug?.trim()) { setErrorMsg('Slug is required.'); return; }
        if (jsonError) { setErrorMsg('Fix the JSON error before saving.'); return; }
        setSaving(true); setErrorMsg('');
        try {
            const payload: Partial<BlogPostRow> = {
                ...form,
                tags: Array.isArray(form.tags) ? form.tags : [],
                is_published: publishNow || form.is_published,
                published_at: publishNow ? new Date().toISOString() : form.published_at,
                updated_at: new Date().toISOString(),
            };
            if (editingId) {
                const { error } = await (supabase as any).from('blog_posts').update(payload).eq('id', editingId);
                if (error) throw error;
                setSuccessMsg('Article updated successfully.');
            } else {
                const { error } = await (supabase as any).from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
                if (error) throw error;
                setSuccessMsg('Article created successfully.');
            }
            await fetchPosts();
            clearDraft();
            setMode('list'); setForm(blankForm()); setEditingId(null);
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to save article.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase as any).from('blog_posts').delete().eq('id', id);
            if (error) throw error;
            setPosts(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm(null);
            setSuccessMsg('Article deleted.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) { setErrorMsg(err.message); }
    };

    const togglePublish = async (post: BlogPostRow) => {
        try {
            const updates = { is_published: !post.is_published, published_at: !post.is_published ? new Date().toISOString() : post.published_at };
            const { error } = await (supabase as any).from('blog_posts').update(updates).eq('id', post.id);
            if (error) throw error;
            setPosts(prev => prev.map(p => (p.id === post.id ? { ...p, ...updates } : p)));
        } catch (err: any) { setErrorMsg(err.message); }
    };

    const openEdit = (post: BlogPostRow) => {
        setForm({ ...post });
        setEditingId(post.id);
        setTagInput('');
        setMode('edit');
        setJsonError('');
        setDraftRestored(false);
        clearDraft();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !(form.tags ?? []).includes(t)) setForm(prev => ({ ...prev, tags: [...(prev.tags ?? []), t] }));
        setTagInput('');
    };
    const removeTag = (tag: string) => setForm(prev => ({ ...prev, tags: (prev.tags ?? []).filter(t => t !== tag) }));

    // ─────────────────────────────────────────────────────────────────────────────
    // ── LIST VIEW ──
    // ─────────────────────────────────────────────────────────────────────────────
    if (mode === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {showChecklist && <PreDeployChecklist onClose={() => setShowChecklist(false)} />}
                <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={16} /> Dashboard
                        </button>
                        <h1 className="text-xl font-black" style={{ color: COLORS.NAVY }}>Blog Manager</h1>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: COLORS.TEAL }}>Dev Only</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowChecklist(true)}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors hover:bg-gray-50"
                            style={{ borderColor: COLORS.NAVY, color: COLORS.NAVY }}
                        >
                            <ClipboardList size={14} /> Pre-Deploy Checklist
                        </button>
                        <Button onClick={() => { setForm(blankForm()); setEditingId(null); setTagInput(''); setMode('create'); }} className="flex items-center gap-2 text-sm">
                            <Plus size={16} /> New Article
                        </Button>
                        <button onClick={async () => { await signOut(); navigate('/'); }} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto px-6 py-8">
                    {successMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 text-sm"><Check size={16} />{successMsg}</div>}
                    {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{errorMsg}</div>}

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
                                const isScheduled = !post.is_published && post.scheduled_at && new Date(post.scheduled_at) > new Date();
                                return (
                                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 flex gap-5 items-start" style={{ border: '1px solid #e8edf2' }}>
                                        {post.cover_image_url ? (
                                            <img src={post.cover_image_url} alt={post.title} className="w-28 h-20 rounded-xl object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-28 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: COLORS.NAVY }}>No Image</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: COLORS.TEAL }}>{post.category}</span>
                                                {post.is_published ? (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">Published</span>
                                                ) : isScheduled ? (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">Scheduled · {new Date(post.scheduled_at!).toLocaleDateString('en-MY')}</span>
                                                ) : (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">Draft</span>
                                                )}
                                            </div>
                                            <h3 className="font-black text-base leading-snug truncate" style={{ color: COLORS.NAVY }}>{post.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">/blog/{post.slug} &nbsp;·&nbsp; {post.read_time_minutes} min read</p>
                                            {post.published_at && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Published: {new Date(post.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            {post.is_published && (
                                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.TEAL }} title="View live">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                            <button onClick={() => togglePublish(post)} title={post.is_published ? 'Unpublish' : 'Publish now'} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: post.is_published ? '#16a34a' : COLORS.TEAL }}>
                                                {post.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button onClick={() => openEdit(post)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.NAVY }}>
                                                <Edit2 size={18} />
                                            </button>
                                            {deleteConfirm === post.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleDelete(post.id)} className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-bold">Confirm</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="text-xs px-2 py-1 bg-gray-200 rounded-lg">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirm(post.id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors text-red-400 hover:text-red-600">
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
            {showChecklist && <PreDeployChecklist onClose={() => setShowChecklist(false)} />}

            <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={e => { if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]); }} />
            <input type="file" accept="image/*" ref={contentImageRef} className="hidden" onChange={e => { if (e.target.files?.[0]) handleContentImageUpload(e.target.files[0]); }} />

            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button onClick={() => { setMode('list'); setForm(blankForm()); setEditingId(null); clearDraft(); }} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-xl font-black" style={{ color: COLORS.NAVY }}>{editingId ? 'Edit Article' : 'New Article'}</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowChecklist(true)}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors hover:bg-gray-50"
                        style={{ borderColor: COLORS.NAVY, color: COLORS.NAVY }}
                    >
                        <ClipboardList size={13} /> Checklist
                    </button>
                    <Button onClick={() => handleSave(false)} disabled={saving} className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300">
                        {saving ? 'Saving…' : 'Save Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className="text-sm">
                        {saving ? 'Publishing…' : 'Publish Now'}
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {draftRestored && (
                    <div className="p-3 rounded-xl text-sm flex items-center gap-2" style={{ background: `${COLORS.GOLD}20`, border: `1px solid ${COLORS.GOLD}` }}>
                        <span>📋</span>
                        <span className="font-semibold" style={{ color: COLORS.NAVY }}>Draft restored — your unsaved work is back.</span>
                        <button
                            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ background: COLORS.NAVY, color: '#fff' }}
                            onClick={() => { setForm(blankForm()); setEditingId(null); clearDraft(); setDraftRestored(false); }}
                        >
                            Discard draft
                        </button>
                        <button onClick={() => setDraftRestored(false)} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>
                    </div>
                )}

                {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                        <X size={16} /> {errorMsg}
                        <button className="ml-auto" onClick={() => setErrorMsg('')}><X size={14} /></button>
                    </div>
                )}
                {successMsg && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                        <Check size={16} /> {successMsg}
                    </div>
                )}

                {/* ── Basic Info ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-5" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Basic Info</h2>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Title *</label>
                        <input className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Your compelling article title" value={form.title ?? ''} onChange={e => handleTitleChange(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">URL Slug *</label>
                        <div className="flex items-center rounded-xl border overflow-hidden dark:border-gray-600">
                            <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 border-r dark:border-gray-600">/blog/</span>
                            <input className="flex-1 px-3 py-3 text-sm dark:bg-gray-700 dark:text-white" placeholder="url-slug" value={form.slug ?? ''} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Edit if needed. This becomes the live URL.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Excerpt <span className="normal-case font-normal text-gray-400">(shown on blog listing page)</span></label>
                        <textarea rows={3} className="w-full border rounded-xl px-4 py-3 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="1–2 sentences that hook the reader. Also shown under the article title on the blog card." value={form.excerpt ?? ''} onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Category</label>
                            <select className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={form.category ?? ''} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Read Time (min)</label>
                            <input type="number" min={1} max={60} className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={form.read_time_minutes ?? 5} onChange={e => setForm(prev => ({ ...prev, read_time_minutes: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Tags</label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {(form.tags ?? []).map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#e8edf2', color: COLORS.TEAL }}>
                                    {tag}<button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={11} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input className="flex-1 border rounded-xl px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Add tag and press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                            <button onClick={addTag} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: COLORS.NAVY }}>Add</button>
                        </div>
                    </div>
                </section>

                {/* ── Cover Image ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Cover Image <span className="text-xs font-normal text-gray-400 normal-case">(shown on blog listing + article hero)</span></h2>

                    {form.cover_image_url && (
                        <div className="relative">
                            <img src={form.cover_image_url} alt="Cover preview" className="w-full h-48 object-cover rounded-xl" />
                            <button onClick={() => setForm(prev => ({ ...prev, cover_image_url: null }))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={14} /></button>
                        </div>
                    )}

                    <button onClick={() => fileRef.current?.click()} disabled={uploadingImage} className="flex items-center gap-2 text-sm px-4 py-3 border-2 border-dashed rounded-xl w-full justify-center font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderColor: COLORS.TEAL, color: COLORS.NAVY }}>
                        <Upload size={16} />
                        {uploadingImage ? 'Uploading…' : form.cover_image_url ? 'Change Cover Image' : 'Upload Cover Image'}
                    </button>
                    <p className="text-xs text-gray-400">Or paste an image URL directly:</p>
                    <input className="w-full border rounded-xl px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="https://images.unsplash.com/..." value={form.cover_image_url ?? ''} onChange={e => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))} />
                </section>

                {/* ── Article Content ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Article Content</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{editorBlocks.length} block{editorBlocks.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setShowPasteModal(true)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white"
                                style={{ background: COLORS.ORANGE }}
                            >
                                📋 Paste & Convert
                            </button>
                            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: '#e8edf2' }}>
                                <button onClick={() => setEditorMode('visual')} className="text-xs px-3 py-2 font-bold transition-colors" style={{ background: editorMode === 'visual' ? COLORS.NAVY : '#f8f9fa', color: editorMode === 'visual' ? '#fff' : '#6b7280' }}>
                                    Visual
                                </button>
                                <button onClick={() => { setEditorMode('json'); }} className="text-xs px-3 py-2 font-bold transition-colors" style={{ background: editorMode === 'json' ? COLORS.NAVY : '#f8f9fa', color: editorMode === 'json' ? '#fff' : '#6b7280' }}>
                                    JSON
                                </button>
                            </div>
                            <button onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl border" style={{ borderColor: COLORS.TEAL, color: COLORS.TEAL }}>
                                {showGuide ? <><ChevronUp size={12} /> Hide Guide</> : <><ChevronDown size={12} /> Guide</>}
                            </button>
                        </div>
                    </div>

                    {showGuide && (
                        <div className="rounded-xl p-4 space-y-2 text-xs" style={{ background: `${COLORS.NAVY}08`, border: `1px solid ${COLORS.NAVY}20` }}>
                            <p className="font-bold" style={{ color: COLORS.NAVY }}>📖 Rich Text Editor</p>
                            <p className="text-gray-600">Use the toolbar above each paragraph to format text: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <del>strikethrough</del>, and <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>inline links</a>.</p>
                            <p className="text-gray-600"><strong>Tips:</strong> Select text and click the link icon to create a link. Use the modal to set custom link text. Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline).</p>
                        </div>
                    )}

                    {showPasteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col" style={{ border: '1px solid #e8edf2', maxHeight: '85vh' }}>
                                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8edf2' }}>
                                    <div>
                                        <h3 className="font-black text-base" style={{ color: COLORS.NAVY }}>Paste & Convert</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Paste your full article from Word, Google Docs, Notion, or any editor</p>
                                    </div>
                                    <button onClick={() => setShowPasteModal(false)}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
                                </div>
                                <div className="px-6 py-3 flex-1 overflow-y-auto">
                                    <div className="rounded-xl p-3 mb-3 text-xs space-y-1" style={{ background: `${COLORS.GOLD}15`, border: `1px solid ${COLORS.GOLD}50` }}>
                                        <p className="font-bold" style={{ color: COLORS.NAVY }}>Auto-detected formatting:</p>
                                        <p className="text-gray-600">• <strong>ALL CAPS lines</strong> or <strong># Heading</strong> → Section heading</p>
                                        <p className="text-gray-600">• <strong>- item</strong> or <strong>1. item</strong> → Numbered list</p>
                                        <p className="text-gray-600">• <strong>"quoted text"</strong> or <strong>&gt; text</strong> → Blockquote</p>
                                        <p className="text-gray-600">• <strong>💡 text</strong> or <strong>Tip: text</strong> → Callout box</p>
                                        <p className="text-gray-600">• Everything else → Paragraph (with rich text support)</p>
                                        <p className="text-gray-500 mt-1">Blank lines create new paragraph blocks.</p>
                                    </div>
                                    <textarea
                                        rows={16}
                                        className="w-full border rounded-xl px-4 py-3 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Paste your full article text here..."
                                        value={pasteText}
                                        onChange={e => setPasteText(e.target.value)}
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-400 mt-2">{pasteText.split(/\n\s*\n/).filter(s => s.trim()).length} paragraph(s) detected</p>
                                </div>
                                <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: '#e8edf2' }}>
                                    <button onClick={() => { setPasteText(''); setShowPasteModal(false); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { const b = convertPasteToBlocks(pasteText); updateBlocks(b); setPasteText(''); setShowPasteModal(false); setEditorMode('visual'); }}
                                            className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                                            style={{ background: COLORS.NAVY }}
                                            disabled={!pasteText.trim()}
                                        >
                                            Replace content
                                        </button>
                                        <button
                                            onClick={handlePasteConvert}
                                            className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                                            style={{ background: COLORS.ORANGE }}
                                            disabled={!pasteText.trim()}
                                        >
                                            Append to existing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {editorMode === 'visual' && (
                        <div className="space-y-2">
                            {editorBlocks.length === 0 && (
                                <div className="text-center py-10 rounded-xl border-2 border-dashed text-sm text-gray-400" style={{ borderColor: '#e8edf2' }}>
                                    No blocks yet. Paste your article or use Insert buttons below.
                                </div>
                            )}
                            {editorBlocks.map((block, idx) => (
                                <div key={idx} className="group rounded-xl border bg-gray-50 dark:bg-gray-700/40 p-3 relative" style={{ borderColor: '#e8edf2' }}>
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: block.type === 'heading' ? COLORS.NAVY : block.type === 'image' ? COLORS.TEAL : block.type === 'quote' ? COLORS.GOLD : block.type === 'list' ? COLORS.ORANGE : block.type === 'callout' ? '#16a34a' : block.type === 'link' ? COLORS.ORANGE : '#6366f1' }}>
                                            {block.type}{block.level ? ` H${block.level}` : ''}
                                        </span>
                                        <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs" title="Move up">↑</button>
                                            <button onClick={() => moveBlock(idx, 'down')} disabled={idx === editorBlocks.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs" title="Move down">↓</button>
                                            <button onClick={() => deleteBlock(idx)} className="p-1 rounded text-red-400 hover:text-red-600 text-xs" title="Delete block"><X size={13} /></button>
                                        </div>
                                    </div>

                                    {block.type === 'paragraph' && (
                                        <RichTextEditor
                                            value={block.text || ''}
                                            onChange={(html) => updateBlock(idx, { ...block, text: html })}
                                            placeholder="Write your paragraph here..."
                                            className="min-h-[60px]"
                                        />
                                    )}
                                    {block.type === 'heading' && (
                                        <div className="flex gap-2">
                                            <select className="border rounded-lg px-2 py-1.5 text-xs dark:bg-gray-700 dark:text-white" value={block.level ?? 2} onChange={e => updateBlock(idx, { ...block, level: Number(e.target.value) })}>
                                                <option value={2}>H2 (big)</option>
                                                <option value={3}>H3 (small)</option>
                                            </select>
                                            <input className="flex-1 text-sm font-bold bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" value={block.text ?? ''} onChange={e => updateBlock(idx, { ...block, text: e.target.value })} placeholder="Heading text..." />
                                        </div>
                                    )}
                                    {block.type === 'quote' && (
                                        <RichTextEditor
                                            value={block.text || ''}
                                            onChange={(html) => updateBlock(idx, { ...block, text: html })}
                                            placeholder="Quote text..."
                                            className="min-h-[40px] italic"
                                        />
                                    )}
                                    {block.type === 'callout' && (
                                        <RichTextEditor
                                            value={block.text || ''}
                                            onChange={(html) => updateBlock(idx, { ...block, text: html })}
                                            placeholder="Callout text..."
                                            className="min-h-[40px]"
                                        />
                                    )}
                                    {block.type === 'list' && (
                                        <div className="space-y-1.5">
                                            {(block.items ?? []).map((item: string, ii: number) => (
                                                <div key={ii} className="flex gap-2 items-start">
                                                    <span className="text-xs font-bold w-5 text-center flex-shrink-0 mt-1" style={{ color: COLORS.ORANGE }}>{ii + 1}.</span>
                                                    <RichTextEditor
                                                        value={item || ''}
                                                        onChange={(html) => {
                                                            const items = [...(block.items ?? [])];
                                                            items[ii] = html;
                                                            updateBlock(idx, { ...block, items });
                                                        }}
                                                        placeholder="List item..."
                                                        className="min-h-[30px] flex-1"
                                                    />
                                                    <button onClick={() => { const items = (block.items ?? []).filter((_: string, i: number) => i !== ii); updateBlock(idx, { ...block, items }); }} className="text-red-400 hover:text-red-600 mt-1"><X size={13} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => updateBlock(idx, { ...block, items: [...(block.items ?? []), ''] })} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ color: COLORS.ORANGE, background: `${COLORS.ORANGE}15` }}>+ Add item</button>
                                        </div>
                                    )}
                                    {block.type === 'image' && (
                                        <div className="space-y-2">
                                            {block.src && !block.src.includes('YOUR-IMAGE') && (
                                                <img src={block.src} alt={block.alt} className="w-full max-h-48 object-cover rounded-lg" />
                                            )}
                                            <div className="flex gap-2">
                                                <input className="flex-1 text-xs bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" placeholder="Image URL" value={block.src ?? ''} onChange={e => updateBlock(idx, { ...block, src: e.target.value })} />
                                                <button
                                                    onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = async (e: any) => { const f = e.target.files?.[0]; if (!f) return; setUploadingContentImage(true); try { const ext = f.name.split('.').pop(); const path = `blog-content/${Date.now()}.${ext}`; await supabase.storage.from('blog-images').upload(path, f, { cacheControl: '3600', upsert: false }); const { data } = supabase.storage.from('blog-images').getPublicUrl(path); updateBlock(idx, { ...block, src: data.publicUrl, alt: f.name.replace(/\.[^/.]+$/, '') }); } catch (err: any) { setErrorMsg('Upload failed: ' + err.message); } finally { setUploadingContentImage(false); } }; inp.click(); }}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg text-white flex-shrink-0"
                                                    style={{ background: COLORS.TEAL }}
                                                >
                                                    {uploadingContentImage ? '…' : '↑ Upload'}
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <input className="flex-1 text-xs bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" placeholder="Alt text (description)" value={block.alt ?? ''} onChange={e => updateBlock(idx, { ...block, alt: e.target.value })} />
                                                <select className="text-xs bg-white dark:bg-gray-700 border rounded-lg px-2 py-1.5 dark:text-white" value={block.position ?? 'full'} onChange={e => updateBlock(idx, { ...block, position: e.target.value })}>
                                                    <option value="full">Full width</option>
                                                    <option value="center">Centered</option>
                                                    <option value="left">Left</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                            <input className="w-full text-xs bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" placeholder="Caption (optional)" value={block.caption ?? ''} onChange={e => updateBlock(idx, { ...block, caption: e.target.value })} />
                                        </div>
                                    )}
                                    {block.type === 'link' && (
                                        <div className="flex gap-2">
                                            <input className="flex-1 text-sm bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" placeholder="Label text" value={block.label ?? ''} onChange={e => updateBlock(idx, { ...block, label: e.target.value })} />
                                            <input className="flex-1 text-sm bg-white dark:bg-gray-700 border rounded-lg px-3 py-1.5 dark:text-white" placeholder="https://..." value={block.href ?? ''} onChange={e => updateBlock(idx, { ...block, href: e.target.value })} />
                                        </div>
                                    )}

                                    <div className="mt-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-1 flex-wrap justify-center">
                                            {[
                                                { label: '+ Para', type: 'paragraph', text: '' },
                                                { label: '+ H2', type: 'heading', level: 2, text: '' },
                                                { label: '+ Image', type: 'image', src: '', alt: '', caption: '' },
                                                { label: '+ List', type: 'list', items: [''] },
                                                { label: '+ Callout', type: 'callout', text: '' },
                                            ].map(b => (
                                                <button key={b.label} onClick={() => insertBlockAt(idx, b)} className="text-xs px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: '#d1d5db', color: '#6b7280' }}>
                                                    {b.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Add Block ↓</p>
                                <div className="flex flex-wrap gap-2">
                                    {SNIPPETS.map(s => (
                                        <button key={s.label} onClick={() => insertSnippet(s)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold border transition-all hover:opacity-80" style={{ borderColor: s.color, color: s.color, background: `${s.color}10` }}>
                                            <span>{s.icon}</span> {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${COLORS.TEAL}10`, border: `1px dashed ${COLORS.TEAL}` }}>
                                <ImageIcon size={16} style={{ color: COLORS.TEAL }} />
                                <div className="flex-1">
                                    <p className="text-xs font-bold" style={{ color: COLORS.TEAL }}>Upload image & append to end</p>
                                    <p className="text-xs text-gray-400">Or use the ↑ Upload button on any existing image block to swap its photo.</p>
                                </div>
                                <button onClick={() => contentImageRef.current?.click()} disabled={uploadingContentImage} className="text-xs font-bold px-3 py-2 rounded-lg text-white flex-shrink-0" style={{ background: COLORS.TEAL }}>
                                    {uploadingContentImage ? 'Uploading…' : 'Upload & Insert'}
                                </button>
                            </div>
                        </div>
                    )}

                    {editorMode === 'json' && (
                        <div>
                            <textarea
                                rows={20}
                                className="w-full border rounded-xl px-4 py-3 text-xs font-mono resize-y dark:bg-gray-700 dark:text-white"
                                style={{ borderColor: jsonError ? '#ef4444' : undefined }}
                                value={form.content_json ?? '[]'}
                                onChange={e => {
                                    handleContentChange(e.target.value);
                                    try { setEditorBlocks(JSON.parse(e.target.value) || []); } catch { }
                                }}
                                spellCheck={false}
                            />
                            {jsonError ? (
                                <p className="text-xs text-red-500 font-semibold mt-1">{jsonError}</p>
                            ) : (
                                <p className="text-xs text-green-600 font-semibold mt-1">✓ JSON is valid — {editorBlocks.length} blocks</p>
                            )}
                        </div>
                    )}
                </section>

                {/* ── Publishing ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-5" style={{ border: '1px solid #e8edf2' }}>
                    <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>Publishing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 flex items-center gap-1.5"><Calendar size={13} /> Publish Date</label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.published_at ? form.published_at.slice(0, 16) : ''}
                                onChange={e => setForm(prev => ({ ...prev, published_at: e.target.value || null }))}
                            />
                            <p className="text-xs text-gray-400 mt-1">Set manually or leave blank for auto on publish.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 flex items-center gap-1.5"><Clock size={13} /> Schedule for Future</label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ''}
                                onChange={e => setForm(prev => ({ ...prev, scheduled_at: e.target.value || null }))}
                            />
                            <p className="text-xs text-gray-400 mt-1">Requires a Supabase cron job to auto-publish.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only" checked={form.is_published ?? false} onChange={e => setForm(prev => ({ ...prev, is_published: e.target.checked }))} />
                            <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.is_published ? '#16a34a' : '#d1d5db' }}>
                                <div className="w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5" style={{ transform: form.is_published ? 'translateX(20px)' : 'translateX(0)' }} />
                            </div>
                        </label>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{form.is_published ? 'Published' : 'Draft'}</span>
                    </div>
                </section>

                {/* ── SEO ─── */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4" style={{ border: '1px solid #e8edf2' }}>
                    <div>
                        <h2 className="font-black text-base" style={{ color: COLORS.NAVY }}>SEO</h2>
                        <p className="text-xs text-gray-400 mt-1">These fields control how the article appears in Google search results and when shared on social media.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            SEO Title <span className="normal-case font-normal text-gray-400">({(form.seo_title ?? '').length}/60 chars)</span>
                        </label>
                        <input className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={`${form.title ?? 'Article title'} | EITO Group`} value={form.seo_title ?? ''} onChange={e => setForm(prev => ({ ...prev, seo_title: e.target.value }))} />
                        <p className="text-xs text-gray-400 mt-1">Keep under 60 characters. Leave blank to default to article title + "| EITO Group".</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">
                            Meta Description <span className="normal-case font-normal text-gray-400">({(form.seo_description ?? '').length}/160 chars)</span>
                        </label>
                        <textarea rows={2} className="w-full border rounded-xl px-4 py-3 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="150–160 character summary — this is what appears under your title in Google results." value={form.seo_description ?? ''} onChange={e => setForm(prev => ({ ...prev, seo_description: e.target.value }))} />
                        <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-400">Aim for 150–160 characters for best Google display.</p>
                            <span className={`text-xs font-bold ${(form.seo_description ?? '').length > 160 ? 'text-red-500' : (form.seo_description ?? '').length >= 150 ? 'text-green-600' : 'text-gray-400'}`}>
                                {(form.seo_description ?? '').length} / 160
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600">Keywords (comma-separated)</label>
                        <input className="w-full border rounded-xl px-4 py-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="team building Malaysia, corporate events KL, EITO Group" value={form.seo_keywords ?? ''} onChange={e => setForm(prev => ({ ...prev, seo_keywords: e.target.value }))} />
                        <p className="text-xs text-gray-400 mt-1">Optional. 5–10 relevant keywords separated by commas.</p>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: '#f8f9fa', border: '1px solid #e8edf2' }}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Google Search Preview</p>
                        <p className="text-blue-700 text-base font-medium leading-snug truncate">{form.seo_title || `${form.title || 'Article Title'} | EITO Group`}</p>
                        <p className="text-green-700 text-xs mt-0.5">https://eitogroup.com.my/blog/{form.slug || 'your-slug'}</p>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.seo_description || form.excerpt || 'Your meta description will appear here. Fill in the field above.'}</p>
                    </div>
                </section>

                <div className="pb-12 flex gap-3 justify-end">
                    <button onClick={() => setShowChecklist(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border" style={{ borderColor: COLORS.NAVY, color: COLORS.NAVY }}>
                        <ClipboardList size={13} /> Pre-Deploy Checklist
                    </button>
                    <Button onClick={() => handleSave(false)} disabled={saving} className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300">
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