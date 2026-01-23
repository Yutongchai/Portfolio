import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import ProjectModal from '../components/ProjectModal';

interface Project {
    id: string;
    title: string;
    category?: string | null;
    description: string | null;
    long_description?: string | null;
    client?: string | null;
    year?: string | null;
    role?: string | null;
    duration?: string | null;
    outcome?: string | null;
    type_id: string | null;
    type_key?: string | null;
    type_description?: string | null;
    featured_image_url?: string | null;
    image_alt?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    gallery?: { id: string; project_id: string; url: string; alt?: string; caption?: string }[];
}

const ProjectsManager: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            // Fetch types, projects and galleries then merge
            const [{ data: types }, { data: projectsData, error: projectsError }, { data: galleries }] = await Promise.all([
                supabase.from('project_types').select('*'),
                supabase.from('projects').select('*').eq('is_active', true).order('created_at', { ascending: false }),
                supabase.from('project_gallery').select('*')
            ]);

            if (projectsError) throw projectsError;

            const typesMap: Record<string, any> = {};
            (types || []).forEach((t: any) => { typesMap[t.id] = t; });

            const merged = (projectsData || []).map((p: any) => ({
                ...p,
                type_key: typesMap[p.type_id]?.type_key,
                type_description: typesMap[p.type_id]?.description,
                gallery: (galleries || []).filter((g: any) => g.project_id === p.id)
            }));

            setProjects(merged || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        setDeleteConfirm({ id, title });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const { error } = await supabase
                .from('projects')
                .update({ is_active: false })
                .eq('id', deleteConfirm.id);

            if (error) throw error;
            setDeleteConfirm(null);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProject(undefined);
        fetchProjects();
    };

    const handleEditProject = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleAddNewProject = () => {
        setSelectedProject(undefined);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="text-blue-600 dark:text-blue-400 hover:underline mb-2 text-sm"
                            >
                                ← Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Manage Projects
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                + Add New Project
                            </Button>
                            <Button
                                onClick={async () => {
                                    await signOut();
                                    navigate('/');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen Layout */}
            <main className="h-[calc(100vh-120px)] flex gap-4 px-4 sm:px-6 lg:px-8 py-4">
                {/* Left Side - Project List */}
                <div className="w-1/2 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Projects ({projects.length})</h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mb-4 block">Select a project to edit its details or delete it.</span>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
                        </div>
                    ) : (
                        <>
                            {projects.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No projects yet. Click "Add New Project" to get started.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleEditProject(project)}
                                            className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 p-4 cursor-pointer"
                                        >
                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(project.id, project.title);
                                                }}
                                                className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                                title="Delete project"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            <div className="flex gap-4">

                                                {/* Project Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {project.type_key || '—'} • {project.year || ''}
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                            {project.type_key || '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right Side - Live Preview */}
                <div className="w-1/2 sticky top-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-300 dark:border-gray-600 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {projects.length === 0 ? (
                            <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                No projects to preview
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
                                    Project Showcase Preview
                                </h3>
                                {projects.slice(0, 1).map((project) => (
                                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">

                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {project.title}
                                                </h4>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {project.type_key || '—'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                                {project.description}
                                            </p>


                                            {/*  */}
                                            {/* Gallery */}
                                            {project.gallery && project.gallery.length > 0 && (
                                                <div className="flex gap-2 overflow-x-auto">
                                                    {project.gallery.map((item, idx) => (
                                                        <div key={idx} className="flex-shrink-0 w-24 h-24">
                                                            <img
                                                                src={item.url}
                                                                alt={item.alt}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Preview shows the first project card as it will appear in the carousel
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <ProjectModal 
                    onClose={handleModalClose} 
                    project={selectedProject}
                    onSaved={handleModalClose}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Delete Project
                            </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete "<span className="font-semibold">{deleteConfirm.title}</span>"? This action is <span className="font-semibold text-red-600 dark:text-red-400">IRREVERSIBLE</span>.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
