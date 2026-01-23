import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface ProjectModalProps {
    onClose: () => void;
    project?: any; // For editing existing projects
    onSaved?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, project, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Basic Info
    const [id, setId] = useState(project?.id || ''); // Auto-generated UUID, not user-editable
    const [title, setTitle] = useState(project?.title || '');
    const [category, setCategory] = useState(project?.category || '');
    type ProjectType = { id: string; type_key: string; description?: string | null; display_order?: number | null };
    const [types, setTypes] = useState<ProjectType[]>([]);
    const [typeId, setTypeId] = useState('');
    const [description, setDescription] = useState(project?.description || '');
    const [longDescription, setLongDescription] = useState(project?.long_description || '');
    const [featuredImageUrl, setFeaturedImageUrl] = useState(project?.featured_image_url || '');
    const [imageAlt, setImageAlt] = useState(project?.image_alt || '');

    // Project Details
    const [year, setYear] = useState(project?.year || new Date().getFullYear().toString());
    const [client, setClient] = useState(project?.client || '');
    const [role, setRole] = useState(project?.role || '');
    const [duration, setDuration] = useState(project?.duration || '');

    const [outcome, setOutcome] = useState(project?.outcome || '');

    // Technologies (array)
    const [technologies, setTechnologies] = useState<string>(
        project?.technologies?.join(', ') || ''
    );

    // Metrics (array of objects)
    const [metrics, setMetrics] = useState<{ label: string; value: string; icon: string }[]>(
        project?.metrics || []
    );

    // Testimonial (object)
    const [hasTestimonial, setHasTestimonial] = useState(!!project?.testimonial);
    const [testimonialQuote, setTestimonialQuote] = useState(project?.testimonial?.quote || '');
    const [testimonialAuthor, setTestimonialAuthor] = useState(project?.testimonial?.author || '');
    const [testimonialPosition, setTestimonialPosition] = useState(project?.testimonial?.position || '');
    const [testimonialCompany, setTestimonialCompany] = useState(project?.testimonial?.company || '');
    const [testimonialAvatar, setTestimonialAvatar] = useState(project?.testimonial?.avatar || '');
    const [testimonialAlt, setTestimonialAlt] = useState(project?.testimonial?.alt || '');

    // Gallery (array of objects)
    const [gallery, setGallery] = useState<{ id?: string; url: string; alt: string }[]>(
        // keep compatibility if project.gallery has caption, map it away
        (project?.gallery || []).map((g: any) => ({ id: g.id || uuidv4(), url: g.url, alt: g.alt }))
    );

    useEffect(() => {
        const fetchProjectTypes = async () => {
            const { data, error } = await supabase
                .from('project_types')
                .select('id, type_key, description')
                .order('type_key', { ascending: true });

            if (error) {
                console.error('Error fetching types:', error);
            } else {
                setTypes(data || []);
                // If editing, ensure the project's type is selected
                if (project && project.type_id) setTypeId(project.type_id);
            }
        };

        fetchProjectTypes();
    }, []);

    const [newTypeKey, setNewTypeKey] = useState('');
    const [newTypeDescription, setNewTypeDescription] = useState('');
    const [addingType, setAddingType] = useState(false);

    const handleAddType = async () => {
        if (!newTypeKey.trim()) {
            setError('Type key is required');
            return;
        }
        setAddingType(true);
        setError(null);
        try {
            const resp = await fetch('/api/project-types', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type_key: newTypeKey.trim(), description: newTypeDescription.trim() || null })
            });
            if (!resp.ok) throw new Error('Failed to add type');
            const inserted = await resp.json();
            setTypes((prev) => [...prev, { id: inserted.id, type_key: inserted.type_key, description: inserted.description }]);
            setTypeId(inserted.id);
            setNewTypeKey('');
            setNewTypeDescription('');
        } catch (err: any) {
            console.error('Failed to add project type via API:', err);
            setError(err.message || 'Failed to add type');
        } finally {
            setAddingType(false);
        }
    };

    const [featured, setFeatured] = useState(project?.featured || false);

    const addMetric = () => {
        setMetrics([...metrics, { label: '', value: '', icon: 'TrendingUp' }]);
    };

    const updateMetric = (index: number, field: string, value: string) => {
        const newMetrics = [...metrics];
        newMetrics[index] = { ...newMetrics[index], [field]: value };
        setMetrics(newMetrics);
    };

    const removeMetric = (index: number) => {
        setMetrics(metrics.filter((_, i) => i !== index));
    };

    const addGalleryItem = () => {
        setGallery([...gallery, { id: uuidv4(), url: '', alt: '' }]);
    };

    const updateGalleryItem = (index: number, field: string, value: string) => {
        const newGallery = [...gallery];
        newGallery[index] = { ...newGallery[index], [field]: value };
        setGallery(newGallery);
    };

    const removeGalleryItem = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    const uploadImage = async (file: File, folder: string = 'main'): Promise<string> => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('project-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (err: any) {
            console.error('Error uploading image:', err);
            throw new Error('Failed to upload image: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadImage(file, 'main');
            // Auto-generate alt text from filename
            const altFromFilename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setFeaturedImageUrl(url);
            setImageAlt(altFromFilename);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleTestimonialAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadImage(file, 'avatars');
            setTestimonialAvatar(url);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadImage(file, 'gallery');
            // Auto-generate alt text from filename
            const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            updateGalleryItem(index, 'url', url);
            updateGalleryItem(index, 'alt', altText);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGalleryMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        try {
            setUploading(true);
            const uploads = await Promise.all(
                files.map(async (file) => {
                    const url = await uploadImage(file, 'gallery');
                    const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                    return { id: uuidv4(), url, alt: altText };
                })
            );
            setGallery((g) => [...uploads, ...g]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!title || !description || !longDescription || !featuredImageUrl || !year || !client || !duration || !outcome) {
                throw new Error('Please fill in all required fields');
            }

            // Prepare testimonial object
            const testimonialObj = hasTestimonial ? {
                quote: testimonialQuote,
                author: testimonialAuthor,
                position: testimonialPosition,
                company: testimonialCompany,
                avatar: testimonialAvatar,
                alt: testimonialAlt
            } : null;

            // Prepare project payload (projects table)
            const projectPayload: any = {
                // Generate UUID for new projects
                ...(!project ? { id: uuidv4() } : {}),
                title,
                category,
                description,
                long_description: longDescription,
                featured_image_url: featuredImageUrl,
                image_alt: imageAlt,
                technologies: technologies.split(',').map(t => t.trim()).filter(t => t),
                year,
                client,
                role,
                duration,
                outcome,
                metrics,
                testimonial: testimonialObj,
                featured,
                is_active: true,
                type_id: typeId || null,
            };

            let projectId = project?.id || id || null;

            if (project) {
                // Update existing project
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(projectPayload)
                    .eq('id', project.id);

                if (updateError) throw updateError;
            } else {
                // Insert new project and get its id
                const { data: inserted, error: insertError } = await supabase
                    .from('projects')
                    .insert([projectPayload])
                    .select()
                    .single();

                if (insertError) throw insertError;
                projectId = inserted.id;
            }

            // Handle gallery: delete existing gallery rows for this project, then insert new ones
            if (projectId) {
                const { error: delErr } = await supabase.from('project_gallery').delete().eq('project_id', projectId);
                if (delErr) throw delErr;

                if ((gallery || []).length) {
                    const galleryRows = gallery.map((g) => ({ project_id: projectId, url: g.url, alt: g.alt || null }));
                    const { error: insErr } = await supabase.from('project_gallery').insert(galleryRows);
                    if (insErr) throw insErr;
                }
            }

            onSaved?.();
            onClose();
        } catch (err: any) {
            console.error('Error saving project:', err);
            setError(err.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="e.g., 2025"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Type</label>
                                <select
                                    value={typeId || ''}
                                    onChange={(e) => setTypeId(e.target.value)}
                                    className="..."
                                >
                                    <option value="">Select a type</option>
                                    {types.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.type_key.replace('_', ' ').toUpperCase()} {t.description ? `— ${t.description}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {/*  <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    value={newTypeKey}
                                    onChange={(e) => setNewTypeKey(e.target.value)}
                                    placeholder="New type key (e.g., case-study)"
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                />
                                <input
                                    type="text"
                                    value={newTypeDescription}
                                    onChange={(e) => setNewTypeDescription(e.target.value)}
                                    placeholder="Description (optional)"
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                />
                                <Button type="button" onClick={handleAddType} disabled={addingType} className="text-sm">
                                    {addingType ? 'Adding...' : 'Add Type'}
                                </Button>
                            </div> */}
                            </div>
                        </div>

                        <Input
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Corporate Social Responsibility"
                            required
                        />




                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Short Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={2}
                                placeholder="Brief description for card preview"
                                required
                            />
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Main Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                disabled={uploading}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required={!featuredImageUrl}
                            />
                            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                            {featuredImageUrl && (
                                <div className="mt-2">
                                    <img src={featuredImageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Long Description */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Full Description</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Long Description
                            </label>
                            <textarea
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={4}
                                placeholder="Detailed project description for case study"
                                required
                            />
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Client"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                placeholder="e.g., GlobalCorp"
                                required
                            />

                            <Input
                                label="Duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="e.g., 3 months"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g., Project Manager"
                            />

                            <Input
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Web Development"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Outcome / Results
                            </label>
                            <textarea
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={3}
                                placeholder="Key outcomes and results achieved"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Technologies (comma-separated)
                            </label>
                            <textarea
                                value={technologies}
                                onChange={(e) => setTechnologies(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={2}
                                placeholder="e.g., React, TypeScript, Tailwind CSS"
                            />
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
                            <Button type="button" onClick={addMetric} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                + Add Metric
                            </Button>
                        </div>

                        {metrics.map((metric, index) => (
                            <div key={index} className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Metric {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeMetric(index)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <Input
                                    label="Label"
                                    value={metric.label}
                                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                                    placeholder="e.g., Engagement Increase"
                                />
                                <Input
                                    label="Value"
                                    value={metric.value}
                                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                                    placeholder="e.g., 50%"
                                />
                                <Input
                                    label="Icon"
                                    value={metric.icon}
                                    onChange={(e) => updateMetric(index, 'icon', e.target.value)}
                                    placeholder="e.g., TrendingUp"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="hasTestimonial"
                                checked={hasTestimonial}
                                onChange={(e) => setHasTestimonial(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="hasTestimonial" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Add Client Testimonial
                            </label>
                        </div>

                        {hasTestimonial && (
                            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded">
                                <Input
                                    label="Quote"
                                    value={testimonialQuote}
                                    onChange={(e) => setTestimonialQuote(e.target.value)}
                                    placeholder="Client testimonial quote"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Author"
                                        value={testimonialAuthor}
                                        onChange={(e) => setTestimonialAuthor(e.target.value)}
                                        placeholder="e.g., John Doe"
                                    />
                                    <Input
                                        label="Position"
                                        value={testimonialPosition}
                                        onChange={(e) => setTestimonialPosition(e.target.value)}
                                        placeholder="e.g., CEO"
                                    />
                                </div>
                                <Input
                                    label="Company"
                                    value={testimonialCompany}
                                    onChange={(e) => setTestimonialCompany(e.target.value)}
                                    placeholder="Client company name"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Avatar
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleTestimonialAvatarUpload}
                                        disabled={uploading}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                    {testimonialAvatar && (
                                        <div className="mt-2">
                                            <img src={testimonialAvatar} alt="Avatar" className="w-16 h-16 object-cover rounded-full" />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    label="Alt Text"
                                    value={testimonialAlt}
                                    onChange={(e) => setTestimonialAlt(e.target.value)}
                                    placeholder="Avatar alt text"
                                />
                            </div>
                        )}
                    </div>


                    {/* Gallery */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleGalleryMultipleUpload}
                                    disabled={uploading}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                />
                                <Button type="button" onClick={addGalleryItem} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                    + Add Image/Video
                                </Button>
                            </div>
                        </div>

                        {gallery.map((item, index) => (
                            <div key={index} className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Image {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryItem(index)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Upload Image/Video
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => handleGalleryImageUpload(e, index)}
                                        disabled={uploading}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>

                                {item.url && (
                                    <div className="mt-2">
                                        {item.url.endsWith('.mp4') || item.url.endsWith('.mov') ? (
                                            <video src={item.url} className="w-full h-40 object-cover rounded" controls />
                                        ) : (
                                            <img src={item.url} alt="Preview" className="w-full h-40 object-cover rounded" />
                                        )}
                                    </div>
                                )}

                                {/* caption removed: gallery items no longer support captions in upload UI */}
                            </div>
                        ))}
                    </div>

                    {/* Featured */}
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mark as Featured Project
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t sticky bottom--1 bg-white dark:bg-gray-800">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
