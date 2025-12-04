import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Plus,
  FileText,
  BookOpen,
  Video,
  User,
} from 'lucide-react';

export const metadata = {
  title: 'Contributor Dashboard - EduShare',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch contributor's resources count
  let totalResources = 0;
  let materialsCount = 0;
  let sessionsCount = 0;

  try {
    const [totalRes, matRes, sesRes] = await Promise.all([
      supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('contributor_id', user.id),
      supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('contributor_id', user.id)
        .eq('type', 'Material'),
      supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('contributor_id', user.id)
        .eq('type', 'Session'),
    ]);

    totalResources = totalRes.count || 0;
    materialsCount = matRes.count || 0;
    sessionsCount = sesRes.count || 0;
  } catch (error) {
    console.error('Error fetching resources:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="text-gray-600">Manage your educational resources</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {totalResources || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">Total Resources</h3>
          <p className="text-sm text-gray-500">All your contributions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {materialsCount || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">Materials</h3>
          <p className="text-sm text-gray-500">Papers, notes & textbooks</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {sessionsCount || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-700">Sessions</h3>
          <p className="text-sm text-gray-500">Live & recorded classes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/add"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Add New Resource</h3>
              <p className="text-blue-100">
                Share a new paper, note, or session
              </p>
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
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Resources
              </h3>
              <p className="text-gray-600">Edit or delete your resources</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
