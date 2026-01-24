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

    // Testimonials are managed externally (Google Reviews). Removed local testimonial fields.

    // Gallery (array of objects)
    const [gallery, setGallery] = useState<{ id?: string; url: string; alt: string }[]>(
        // keep compatibility if project.gallery has caption, map it away
        (project?.gallery || []).map((g: any) => ({ id: g.id || uuidv4(), url: g.url, alt: g.alt }))
    );

    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

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

    // Compress an image file in the browser to reduce upload size
    const compressImage = async (file: File, maxWidth = 1600, quality = 0.8): Promise<File> => {
        try {
            if (!file.type.startsWith('image/')) return file;
            const imageBitmap = await createImageBitmap(file as any);
            const scale = Math.min(1, maxWidth / imageBitmap.width);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(imageBitmap.width * scale));
            canvas.height = Math.max(1, Math.round(imageBitmap.height * scale));
            const ctx = canvas.getContext('2d');
            if (!ctx) return file;
            ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
            const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
            if (!blob) return file;
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
            return compressedFile;
        } catch (err) {
            console.warn('Image compression failed, uploading original file', err);
            return file;
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

    // Testimonial avatar upload removed (testimonials handled via external service)

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
        setError(null);
        setUploading(true);
        setUploadProgress({ current: 0, total: files.length });
        const uploadedItems: { id: string; url: string; alt: string }[] = [];

        // concurrency-limited uploader
        const concurrency = 4;
        let index = 0;

        const worker = async () => {
            while (true) {
                const i = index++;
                if (i >= files.length) return;
                const file = files[i];
                try {
                    const fileToUpload = file.type.startsWith('image/') ? await compressImage(file) : file;
                    const url = await uploadImage(fileToUpload as File, 'gallery');
                    const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                    uploadedItems.push({ id: uuidv4(), url, alt: altText });
                } catch (innerErr: any) {
                    console.error('Failed uploading file', file.name, innerErr);
                    setError(innerErr.message || 'Failed to upload one or more files');
                } finally {
                    // update progress based on completed uploads
                    setUploadProgress((prev) => ({ current: prev.current + 1, total: files.length }));
                }
            }
        };

        try {
            const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
            await Promise.all(workers);
            if (uploadedItems.length) setGallery((g) => [...uploadedItems, ...g]);
        } catch (err: any) {
            console.error('Error during multiple upload:', err);
            setError(err.message || 'Failed to upload files');
        } finally {
            setUploading(false);
            setUploadProgress({ current: 0, total: 0 });
            // clear input value to allow re-uploading same files if needed
            try { (e.target as HTMLInputElement).value = ''; } catch { }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields and log which ones are missing for debugging
            const missingFields: string[] = [];
            if (!title) missingFields.push('title');
            // description is optional (nullable in DB)
            if (!longDescription) missingFields.push('longDescription');
            if (!featuredImageUrl) missingFields.push('featuredImageUrl');
            if (!year) missingFields.push('year');
            if (!client) missingFields.push('client');
            if (!duration) missingFields.push('duration');

            if (missingFields.length) {
                console.error('Missing required fields:', missingFields, {
                    title,
                    description: description || null,
                    longDescription,
                    featuredImageUrl,
                    year,
                    client,
                    duration,
                });
                throw new Error('Please fill in all required fields: ' + missingFields.join(', '));
            }



            // Prepare project payload (projects table)
            const projectPayload: any = {
                // Generate UUID for new projects
                ...(!project ? { id: uuidv4() } : {}),
                title,
                long_description: longDescription,
                featured_image_url: featuredImageUrl,
                image_alt: imageAlt,
                year,
                client,
                duration,
                metrics,
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

                        <div className="grid grid-cols-3 gap-4">
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
                                label="Client"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                placeholder="e.g., GlobalCorp"
                                required
                            />
                            <Input
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Corporate Social Responsibility"
                                required
                            />
                        </div>



                        {/* Long Description */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Full Description</h3>
                            <div>
                                <textarea
                                    value={longDescription}
                                    onChange={(e) => setLongDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={4}
                                    placeholder="Detailed project description for case study"
                                    required
                                    aria-multiline
                                />
                            </div>
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
                            {/** Full preview card (matches work-showcase card) */}
                            <div className="mt-4">
                                <div className="space-y-6 bg-white dark:bg-neutral-900 p-0">
                                    {/* Main Project Image */}
                                    <div className="rounded-lg overflow-hidden">
                                        {featuredImageUrl ? (
                                            <img
                                                src={featuredImageUrl}
                                                alt={imageAlt}
                                                className="w-full h-30 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-30 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                                                No main image
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-base text-neutral-600 dark:text-neutral-400">
                                        {longDescription}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Client</h4>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{client}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Duration</h4>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{duration}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Year</h4>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{year}</p>
                                        </div>
                                    </div>

                                    {metrics && metrics.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {metrics.map((metric, idx) => (
                                                <div key={idx} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                                                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{metric.value}</p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{metric.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Local testimonial preview removed; testimonials now come from Google Reviews */}

                                    {gallery && gallery.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Gallery</h4>
                                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
                                                {gallery.map((item, idx) => (
                                                    <div key={idx} className="flex-shrink-0 w-64 snap-center">
                                                        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                                            {item.url.endsWith('.mp4') ? (
                                                                <video src={item.url} controls className="w-full h-48 object-cover" />
                                                            ) : (
                                                                <img src={item.url} alt={item.alt} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>


                    {/* Project Details */}
                    {/* <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>

                        <div className="grid grid-cols-2 gap-4">



                              <Input
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Web Development"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <Input
                                label="Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g., Project Manager"
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
                    </div> */}

                    {/* Metrics */}
                    {/* <div className="space-y-4 border-t pt-4">
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
                    </div> */}

                    {/* Testimonial */}
                    {/* <div className="space-y-4 border-t pt-4">
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
                    </div> */}


                    {/* Gallery */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleGalleryMultipleUpload}
                                        disabled={uploading}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                    {uploading && uploadProgress.total > 0 && (
                                        <p className="text-sm text-blue-600 mt-2">Uploading {uploadProgress.current} / {uploadProgress.total}…</p>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto py-2">
                            {gallery.map((item, index) => (
                                <div key={item.id || index} className="relative w-40 h-28 flex-shrink-0 rounded overflow-hidden shadow-md bg-gray-50 dark:bg-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryItem(index)}
                                        className="absolute top-1 right-1 z-20 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        aria-label={`Remove gallery item ${index + 1}`}
                                    >
                                        ×
                                    </button>

                                    {item.url && (
                                        item.url.endsWith('.mp4') || item.url.endsWith('.mov') ? (
                                            <video src={item.url} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={item.url} alt={item.alt || `Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
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
