'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  FileText,
  BookOpen,
  Video,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  TrendingUp,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalSessions: 0,
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
        const [materialsRes, sessionsRes] = await Promise.all([
          supabase.from('materials').select('*', { count: 'exact', head: true }),
          supabase.from('sessions').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          totalMaterials: materialsRes.count || 0,
          totalSessions: sessionsRes.count || 0,
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalResources = stats.totalMaterials + stats.totalSessions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <UserIcon className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-base text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
              </div>
            </div>
            <Link
              href="/dashboard/manage"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.total')}</p>
            <p className="text-4xl font-bold text-gray-900">{totalResources}</p>
            <p className="text-xs text-gray-500 mt-2">Total Resources</p>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {((stats.totalMaterials / totalResources) * 100 || 0).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.materials')}</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalMaterials}</p>
            <p className="text-xs text-gray-500 mt-2">Learning Materials</p>
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {((stats.totalSessions / totalResources) * 100 || 0).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.sessions_count')}</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalSessions}</p>
            <p className="text-xs text-gray-500 mt-2">Learning Sessions</p>
          </div>

          {/* Quick Stat */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-100 mb-1">Active Admin</p>
            <p className="text-2xl font-bold">Status: Online</p>
            <p className="text-xs text-blue-100 mt-2">Ready to manage</p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Resource */}
            <Link
              href="/dashboard/add"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-blue-100" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('dashboard.add_new')}</h3>
              <p className="text-blue-100 text-sm">{t('dashboard.add_new_desc')}</p>
              <div className="mt-6 flex items-center space-x-2">
                <span className="text-sm font-semibold">Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Manage Resources */}
            <Link
              href="/dashboard/manage"
              className="bg-white rounded-xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-7 h-7 text-gray-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.manage')}</h3>
              <p className="text-gray-600 text-sm">{t('dashboard.manage_desc')}</p>
              <div className="mt-6 flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">View All</span>
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Resource Overview</h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Materials Added</span>
                  <span className="text-lg font-bold text-gray-900">{stats.totalMaterials}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessions Added</span>
                  <span className="text-lg font-bold text-gray-900">{stats.totalSessions}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Quick Links</h3>
              <div className="space-y-2 mt-4">
                <Link href="/dashboard" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                  → Back to Dashboard
                </Link>
                <Link href="/dashboard/manage" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                  → Manage Content
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Support</h3>
              <p className="text-sm text-gray-600 mt-4">Need help? Contact the support team for assistance with managing your resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
