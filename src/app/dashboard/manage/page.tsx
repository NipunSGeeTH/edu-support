'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Resource } from '@/types/database';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Edit,
  ExternalLink,
  FileText,
  Video,
  Loader2,
} from 'lucide-react';

export default function ManageResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchResources = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('contributor_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setResources(data);
      }

      setIsLoading(false);
    };

    fetchResources();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    setDeletingId(id);

    const { error } = await supabase.from('resources').delete().eq('id', id);

    if (!error) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('Failed to delete resource');
    }

    setDeletingId(null);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Manage Resources</h1>
        <p className="text-gray-600">View, edit, or delete your resources</p>
      </div>

      {/* Resources List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : resources.length === 0 ? (
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
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        resource.type === 'Material'
                          ? 'bg-blue-100'
                          : 'bg-purple-100'
                      }`}
                    >
                      {resource.type === 'Material' ? (
                        <FileText
                          className={`w-5 h-5 ${
                            resource.type === 'Material'
                              ? 'text-blue-600'
                              : 'text-purple-600'
                          }`}
                        />
                      ) : (
                        <Video className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {resource.title}
                      </h3>
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
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {resource.category}
                        </span>
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
                      onClick={() => handleDelete(resource.id)}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
