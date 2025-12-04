'use client';

import Link from 'next/link';
import { BookOpen, Users, Target, Heart, FileText, Video, Globe, GraduationCap, Shield, Plus, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('about.title')}
        </h1>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-2" />
            {t('about.vission_title')}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.vission_text')}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-2" />
            {t('about.mission_title')}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.mission_text')}
          </p>
        </div>
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            {t('about.values_title')}
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>✓ {t('feature.free')}</li>
            <li>✓ Quality content curated by educators</li>
            <li>✓ {t('feature.languages')}</li>
            <li>✓ Community-driven platform</li>
            <li>✓ Equal opportunity for all students</li>
          </ul>
        </div> */}
      </div>

      {/* What We Offer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t('about.what_we_offer')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{t('about.past_papers_title')}</h3>
            <p className="text-sm text-gray-600">{t('about.past_papers_detail')}</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{t('about.notes_title')}</h3>
            <p className="text-sm text-gray-600">{t('about.notes_detail')}</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{t('about.textbooks_title')}</h3>
            <p className="text-sm text-gray-600">{t('about.textbooks_detail')}</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{t('about.video_sessions_title')}</h3>
            <p className="text-sm text-gray-600">{t('about.video_sessions_detail')}</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.past_papers')}
              </h3>
              <p className="text-gray-600">
                {t('feature.past_papers_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.notes')}
              </h3>
              <p className="text-gray-600">
                {t('feature.notes_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.sessions')}
              </h3>
              <p className="text-gray-600">
                {t('feature.sessions_desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.languages')}
              </h3>
              <p className="text-gray-600">
                {t('feature.languages_desc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.streams')}
              </h3>
              <p className="text-gray-600">
                {t('feature.streams_desc')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature.free')}
              </h3>
              <p className="text-gray-600">
                {t('feature.free_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>


      

      {/* For Contributors */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-center mb-6">
          <Users className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {t('about.contributors_title')}
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
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

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.contact_title')}</h2>
        <p className="text-gray-600 mb-4">
          {t('about.contact_text')}
        </p>
        <a
          href={`mailto:${t('about.contact_email')}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {t('about.contact_email')}
        </a>
      </div>
    </div>
  );
}
