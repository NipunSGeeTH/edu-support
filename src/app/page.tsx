'use client';

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  Video,
  Users,
  FileText,
  ArrowRight,
  GraduationCap,
  Globe,
  Shield,
  Plus,
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/materials"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t('home.browse_materials')}
              </Link>
              <Link
                href="/sessions"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
              >
                <Video className="w-5 h-5 mr-2" />
                {t('home.view_sessions')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Resource Banner */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white font-medium text-center sm:text-left">
              Have educational resources to share? Anyone can contribute!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center px-4 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('nav.submit')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
 

      {/* Quick Access Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Access
            </h2>
            <p className="text-lg text-gray-600">
              Choose your path to start learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Materials Card */}
            <Link
              href="/materials"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('materials.title')}
              </h3>
              <p className="text-gray-600">
                Past papers, notes, and textbooks for all subjects
              </p>
            </Link>

            {/* Sessions Card */}
            <Link
              href="/sessions"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('sessions.title')}
              </h3>
              <p className="text-gray-600">
                Live classes and recorded video lessons
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('about.contributors_title')}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('about.contributors_text')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('about.submit_resource')}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('about.become_contributor')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
