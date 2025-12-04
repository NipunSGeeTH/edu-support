'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Plus,
  FileText,
  BookOpen,
  Video,
  User as UserIcon,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalSessions: 0,
    pendingMaterials: 0,
    pendingSessions: 0,
    approvedMaterials: 0,
    approvedSessions: 0,
  });

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      // Fetch stats
      try {
        const [
          materialsRes,
          sessionsRes,
          pendingMaterialsRes,
          pendingSessionsRes,
          approvedMaterialsRes,
          approvedSessionsRes,
        ] = await Promise.all([
          supabase.from('materials').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id),
          supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id),
          supabase.from('materials').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id).eq('status', 'pending'),
          supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id).eq('status', 'pending'),
          supabase.from('materials').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id).eq('status', 'approved'),
          supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id).eq('status', 'approved'),
        ]);

        setStats({
          totalMaterials: materialsRes.count || 0,
          totalSessions: sessionsRes.count || 0,
          pendingMaterials: pendingMaterialsRes.count || 0,
          pendingSessions: pendingSessionsRes.count || 0,
          approvedMaterials: approvedMaterialsRes.count || 0,
          approvedSessions: approvedSessionsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalResources = stats.totalMaterials + stats.totalSessions;
  const totalPending = stats.pendingMaterials + stats.pendingSessions;
  const totalApproved = stats.approvedMaterials + stats.approvedSessions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('dashboard.welcome', { name: user.user_metadata?.full_name || user.email || '' })}
            </h1>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {totalResources}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">{t('dashboard.total')}</h3>
          <p className="text-sm text-gray-500">All your contributions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats.totalMaterials}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">{t('dashboard.materials')}</h3>
          <p className="text-sm text-gray-500">Papers, notes & textbooks</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats.totalSessions}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">{t('dashboard.sessions_count')}</h3>
          <p className="text-sm text-gray-500">Live & recorded classes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/add"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('dashboard.add_new')}</h3>
              <p className="text-blue-100">{t('dashboard.add_new_desc')}</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/manage"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.manage')}</h3>
              <p className="text-gray-600">{t('dashboard.manage_desc')}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
