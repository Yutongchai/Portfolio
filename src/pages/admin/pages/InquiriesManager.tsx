import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';

type InquiryType = 'corporate_event' | 'team_building' | 'csr' | 'training_program';

interface Inquiry {
    id: string;
    name: string;
    contact: number;
    company_name: string;
    company_email: string;
    industry?: string;
    no_of_pax?: number;
    duration?: string;
    estimated_event_month?: string;
    budget?: string;
    hrdc?: boolean;
    preferred_location?: string;
    language?: string;
    remarks?: string;
    status: string;
    created_at: string;
    updated_at: string;
    type: InquiryType;
}

const InquiriesManager: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<InquiryType | 'all'>('all');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchInquiries();
    }, [selectedType, statusFilter]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const tables = [
                { name: 'corporate_event_inquiries', type: 'corporate_event' as InquiryType },
                { name: 'team_building_inquiries', type: 'team_building' as InquiryType },
                { name: 'csr_inquiries', type: 'csr' as InquiryType },
                { name: 'training_program_inquiries', type: 'training_program' as InquiryType },
            ];

            let allInquiries: Inquiry[] = [];

            for (const table of tables) {
                if (selectedType !== 'all' && table.type !== selectedType) continue;

                let query = (supabase as any)
                    .from(table.name)
                    .select('*')
                    .order('created_at', { ascending: false });

                if (statusFilter !== 'all') {
                    query = query.eq('status', statusFilter);
                }

                const { data, error } = await query;

                if (error) {
                    console.error(`Error fetching ${table.name}:`, error);
                    continue;
                }

                if (data) {
                    allInquiries = [
                        ...allInquiries,
                        ...data.map((item: any) => ({ ...item, type: table.type })),
                    ];
                }
            }

            // Sort all inquiries by created_at
            allInquiries.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setInquiries(allInquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateInquiryStatus = async (inquiry: Inquiry, newStatus: string) => {
        try {
            const tableName = `${inquiry.type}_inquiries`;
            const { error } = await (supabase as any)
                .from(tableName)
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', inquiry.id);

            if (error) throw error;

            fetchInquiries();
            setSelectedInquiry(null);
        } catch (error) {
            console.error('Error updating inquiry status:', error);
            alert('Failed to update inquiry status');
        }
    };

    const getTypeLabel = (type: InquiryType): string => {
        const labels: Record<InquiryType, string> = {
            corporate_event: 'Corporate Event',
            team_building: 'Team Building',
            csr: 'CSR',
            training_program: 'Training Program',
        };
        return labels[type];
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
                                Manage Inquiries
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Inquiry Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as InquiryType | 'all')}
                            className="h-10 w-full min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] pr-10 [&>option]:rounded-md [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-white [&>option]:py-2 [&>option]:px-3 [&>option]:m-1"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`
                            }}
                        >
                            <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">All Types</option>
                            <option value="corporate_event" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Corporate Event</option>
                            <option value="team_building" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Team Building</option>
                            <option value="csr" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">CSR</option>
                            <option value="training_program" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Training Program</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 w-full min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] pr-10 [&>option]:rounded-md [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-white [&>option]:py-2 [&>option]:px-3 [&>option]:m-1"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`
                            }}
                        >
                            <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">All Status</option>
                            <option value="pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Pending</option>
                            <option value="contacted" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Contacted</option>
                            <option value="completed" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Completed</option>
                            <option value="cancelled" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Inquiries</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{inquiries.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {inquiries.filter(i => i.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Contacted</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {inquiries.filter(i => i.status === 'contacted').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {inquiries.filter(i => i.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
                    </div>
                ) : (
                    <>
                        {inquiries.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No inquiries found.
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Company
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {inquiries.map((inquiry) => (
                                                <tr key={inquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                            {getTypeLabel(inquiry.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {inquiry.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {inquiry.company_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {inquiry.contact}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                                                            {inquiry.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Button
                                                            onClick={() => setSelectedInquiry(inquiry)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Detail Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Inquiry Details
                                </h2>
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <p className="text-gray-900 dark:text-white">{getTypeLabel(selectedInquiry.type)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={selectedInquiry.status}
                                        onChange={(e) => updateInquiryStatus(selectedInquiry, e.target.value)}
                                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10 [&>option]:rounded-md [&>option]:bg-white [&>option]:dark:bg-gray-700 [&>option]:text-gray-900 [&>option]:dark:text-white [&>option]:py-2 [&>option]:px-3 [&>option]:m-1"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`
                                        }}
                                    >
                                        <option value="pending" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md">Pending</option>
                                        <option value="contacted" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md">Contacted</option>
                                        <option value="completed" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md">Completed</option>
                                        <option value="cancelled" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <p className="text-gray-900 dark:text-white">{selectedInquiry.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                                    <p className="text-gray-900 dark:text-white">{selectedInquiry.contact}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                    <p className="text-gray-900 dark:text-white">{selectedInquiry.company_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <p className="text-gray-900 dark:text-white">{selectedInquiry.company_email}</p>
                                </div>
                                {selectedInquiry.industry && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.industry}</p>
                                    </div>
                                )}
                                {selectedInquiry.no_of_pax && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Pax</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.no_of_pax}</p>
                                    </div>
                                )}
                                {selectedInquiry.duration && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.duration}</p>
                                    </div>
                                )}
                                {selectedInquiry.estimated_event_month && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Event Month</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.estimated_event_month}</p>
                                    </div>
                                )}
                                {selectedInquiry.budget && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.budget}</p>
                                    </div>
                                )}
                                {selectedInquiry.preferred_location && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Location</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.preferred_location}</p>
                                    </div>
                                )}
                                {selectedInquiry.language && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                                        <p className="text-gray-900 dark:text-white">{selectedInquiry.language}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HRDC Claimable</label>
                                    <p className="text-gray-900 dark:text-white">{selectedInquiry.hrdc ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(selectedInquiry.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {selectedInquiry.remarks && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedInquiry.remarks}</p>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiriesManager;
