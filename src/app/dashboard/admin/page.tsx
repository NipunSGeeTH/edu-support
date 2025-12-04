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
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  Video,
  Loader2,
  Clock,
  Calendar,
  Shield,
} from 'lucide-react';

type PendingItem = (Material | Session) & { resourceType: 'material' | 'session' };

export default function AdminApprovalPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'materials' | 'sessions'>('all');

  // Admin emails - in production, this would be stored in database
  const ADMIN_EMAILS = [
    'admin@edushare.lk',
    // Add admin emails here
  ];

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Check if user is admin (for now, all logged-in users can approve)
      // In production, check against ADMIN_EMAILS or a database role

      // Fetch pending materials and sessions
      const [materialsRes, sessionsRes] = await Promise.all([
        supabase
          .from('materials')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: true }),
        supabase
          .from('sessions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: true }),
      ]);

      const materials: PendingItem[] = (materialsRes.data || []).map(m => ({
        ...m,
        resourceType: 'material' as const,
      }));

      const sessions: PendingItem[] = (sessionsRes.data || []).map(s => ({
        ...s,
        resourceType: 'session' as const,
      }));

      // Combine and sort by created_at (oldest first for queue)
      const combined = [...materials, ...sessions].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setPendingItems(combined);
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

  const handleApprove = async (id: string, resourceType: 'material' | 'session') => {
    if (!user) return;
    setProcessingId(id);

    const supabase = createClient();
    const table = resourceType === 'material' ? 'materials' : 'sessions';

    const { error } = await supabase
      .from(table)
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', id);

    if (!error) {
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert('Failed to approve resource');
    }

    setProcessingId(null);
  };

  const handleReject = async (id: string, resourceType: 'material' | 'session') => {
    if (!confirm('Are you sure you want to reject this submission? This action cannot be undone.')) return;
    if (!user) return;
    
    setProcessingId(id);

    const supabase = createClient();
    const table = resourceType === 'material' ? 'materials' : 'sessions';

    const { error } = await supabase
      .from(table)
      .update({
        status: 'rejected',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', id);

    if (!error) {
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert('Failed to reject resource');
    }

    setProcessingId(null);
  };

  const filteredItems = pendingItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'materials') return item.resourceType === 'material';
    if (activeTab === 'sessions') return item.resourceType === 'session';
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve anonymous submissions</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Pending</span>
            <span className="text-2xl font-bold text-yellow-600">{pendingItems.length}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Materials</span>
            <span className="text-2xl font-bold text-blue-600">
              {pendingItems.filter(i => i.resourceType === 'material').length}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sessions</span>
            <span className="text-2xl font-bold text-purple-600">
              {pendingItems.filter(i => i.resourceType === 'session').length}
            </span>
          </div>
        </div>
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
          All ({pendingItems.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'materials'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sessions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sessions
        </button>
      </div>

      {/* Pending Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600">
            There are no pending submissions to review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isMaterial = item.resourceType === 'material';
            const material = isMaterial ? item as Material : null;
            const session = !isMaterial ? item as Session : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isMaterial ? 'bg-blue-100' : 'bg-purple-100'
                    }`}
                  >
                    {isMaterial ? (
                      <FileText className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Video className="w-5 h-5 text-purple-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          Submitted {formatDate(item.created_at)}
                          {item.is_anonymous && (
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              Anonymous
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.level}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.stream}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.subject}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.language}
                      </span>
                      {material && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {material.category}
                        </span>
                      )}
                      {session && (
                        <>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {session.session_type}
                          </span>
                          {session.session_date && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {session.session_date}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* URL Preview */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-4">
                      <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {item.url}
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(item.id, item.resourceType)}
                        disabled={processingId === item.id}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {processingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id, item.resourceType)}
                        disabled={processingId === item.id}
                        className="inline-flex items-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
