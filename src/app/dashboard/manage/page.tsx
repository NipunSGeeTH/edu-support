'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Material, Session } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from 'lucide-react';

type ResourceItem = (Material | Session) & { resourceType: 'material' | 'session' };

export default function ManageResourcesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'materials' | 'sessions'>('all');

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Fetch both materials and sessions
      const [materialsRes, sessionsRes] = await Promise.all([
        supabase
          .from('materials')
          .select('*')
          .eq('contributor_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('sessions')
          .select('*')
          .eq('contributor_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      const materials: ResourceItem[] = (materialsRes.data || []).map(m => ({
        ...m,
        resourceType: 'material' as const,
      }));

      const sessions: ResourceItem[] = (sessionsRes.data || []).map(s => ({
        ...s,
        resourceType: 'session' as const,
      }));

      // Combine and sort by created_at
      const combined = [...materials, ...sessions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setResources(combined);
      setIsLoading(false);
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, resourceType: 'material' | 'session') => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    setDeletingId(id);
    const supabase = createClient();
    
    const table = resourceType === 'material' ? 'materials' : 'sessions';
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (!error) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('Failed to delete resource');
    }

    setDeletingId(null);
  };

  const filteredResources = resources.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'materials') return r.resourceType === 'material';
    if (activeTab === 'sessions') return r.resourceType === 'session';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.manage')}</h1>
        <p className="text-gray-600">{t('dashboard.manage_desc')}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'materials'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Materials ({resources.filter(r => r.resourceType === 'material').length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sessions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sessions ({resources.filter(r => r.resourceType === 'session').length})
        </button>
      </div>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resources yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven&apos;t added any resources yet.
          </p>
          <Link
            href="/dashboard/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Add Your First Resource
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredResources.map((resource) => {
              const isMaterial = resource.resourceType === 'material';
              const material = isMaterial ? resource as Material : null;
              const session = !isMaterial ? resource as Session : null;

              return (
                <div
                  key={resource.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg ${
                          isMaterial ? 'bg-blue-100' : 'bg-purple-100'
                        }`}
                      >
                        {isMaterial ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Video className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {resource.title}
                          </h3>
                          {getStatusBadge(resource.status)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {resource.level}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {resource.stream}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {resource.subject}
                          </span>
                          {material && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {material.category}
                            </span>
                          )}
                          {session && (
                            <>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                {session.session_type}
                              </span>
                              {session.session_date && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {session.session_date}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(resource.id, resource.resourceType)}
                        disabled={deletingId === resource.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === resource.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
