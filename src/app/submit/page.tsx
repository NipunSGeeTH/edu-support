'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfig } from '@/contexts/ConfigContext';
import { User } from '@supabase/supabase-js';
import {
  MaterialCategory,
  SessionType,
  Level,
  Language,
} from '@/types/database';
import { ArrowLeft, Plus, Loader2, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

type ResourceType = 'material' | 'session';

export default function SubmitPage() {
  const { t } = useLanguage();
  const { config, isLoading: configLoading } = useConfig();

  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<'approved' | 'pending' | null>(null);

  // Get config values from database
  const levels = config?.levels || [];
  const languages = config?.languages || [];
  const materialCategories = config?.materialCategories || [];
  const sessionTypes = config?.sessionTypes || ['Live', 'Recording'];

  // Form state
  const [resourceType, setResourceType] = useState<ResourceType>('material');
  const [category, setCategory] = useState<MaterialCategory | ''>('');
  const [sessionType, setSessionType] = useState<SessionType>('Recording');
  const [level, setLevel] = useState<Level | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [language, setLanguage] = useState<Language | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Session timing
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Get subjects for the selected level from database
  const availableSubjects = useMemo(() => {
    if (!config || !level) return [];
    return config.subjectsByLevel?.[level] || [];
  }, [config, level]);

  // Get streams for the selected subject from database (auto-assigned, not user selected)
  const subjectStreams = useMemo(() => {
    if (!config || !level || !subject) return [];
    return config.subjectStreams?.[level]?.[subject] || [];
  }, [config, level, subject]);

  // Initialize defaults when config loads
  useEffect(() => {
    if (config && !level && config.levels.length > 0) {
      setLevel(config.levels[0] as Level);
    }
    if (config && !language && config.languages.length > 0) {
      setLanguage(config.languages[0] as Language);
    }
    if (config && !category && config.materialCategories.length > 0) {
      setCategory(config.materialCategories[0] as MaterialCategory);
    }
  }, [config, level, language, category]);

  // Reset subject when level changes
  useEffect(() => {
    setSubject('');
  }, [level]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) return;
    
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate
    if (!subject || subjectStreams.length === 0) {
      setError('Please select a valid subject');
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Auto-assign streams based on subject from database
      // For O/L subjects, streams will be ['General']
      // For A/L multi-stream subjects like ICT, streams will be ['Science', 'Commerce', 'Technology']
      const streamsToStore = subjectStreams;
      
      const baseData = {
        title,
        description,
        url,
        level,
        stream: streamsToStore, // Array of streams from database
        subject,
        language,
        contributor_id: (!isAnonymous && user) ? user.id : null,
        contributor_name: (!isAnonymous && user) ? (user.user_metadata?.full_name || user.email) : null,
        is_anonymous: isAnonymous || !user,
      };

      let insertError;

      if (resourceType === 'material') {
        const { error } = await supabase.from('materials').insert({
          ...baseData,
          category,
        });
        insertError = error;
      } else {
        const { error } = await supabase.from('sessions').insert({
          ...baseData,
          session_type: sessionType,
          session_date: sessionType === 'Live' && sessionDate ? sessionDate : null,
          start_time: sessionType === 'Live' && startTime ? startTime : null,
          end_time: sessionType === 'Live' && endTime ? endTime : null,
        });
        insertError = error;
      }

      if (insertError) {
        setError(insertError.message);
      } else {
        if (user && !isAnonymous) {
          setSuccess('approved');
        } else {
          setSuccess('pending');
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setUrl('');
        setSessionDate('');
        setStartTime('');
        setEndTime('');
        setSubject('');
      }
    } catch (err) {
      setError(t('submit.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = level && subject && language && title && description && url && 
    (resourceType === 'material' ? category : true);

  // Show loading while config is loading
  if (configLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('common.back')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('submit.title')}</h1>
        <p className="text-gray-600">{t('submit.subtitle')}</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
          success === 'approved' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {success === 'approved' ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${success === 'approved' ? 'text-green-800' : 'text-yellow-800'}`}>
              {t('submit.success')}
            </p>
            <p className={`text-sm ${success === 'approved' ? 'text-green-700' : 'text-yellow-700'}`}>
              {success === 'approved' ? t('submit.success_approved') : t('submit.success_pending')}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* User Status Banner */}
      {!user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You are not logged in. Your submission will require manual approval.{' '}
            <Link href="/login" className="underline font-medium">
              Login with Google
            </Link>{' '}
            for instant approval.
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        {/* Resource Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('submit.type')}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setResourceType('material')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                resourceType === 'material'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('submit.material')}
            </button>
            <button
              type="button"
              onClick={() => setResourceType('session')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                resourceType === 'session'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('submit.session')}
            </button>
          </div>
        </div>

        {/* Category / Session Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('submit.category')}
          </label>
          <div className="flex flex-wrap gap-2">
            {resourceType === 'material' ? (
              materialCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as MaterialCategory)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))
            ) : (
              sessionTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSessionType(type as SessionType)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    sessionType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Session Timing - Only for Live sessions */}
        {resourceType === 'session' && sessionType === 'Live' && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-sm font-medium text-purple-900 mb-3">Session Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-purple-700 mb-1">
                  {t('submit.date')}
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-700 mb-1">
                  {t('submit.start_time')}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-700 mb-1">
                  {t('submit.end_time')}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Level Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('filter.level')}
          </label>
          <div className="flex gap-3">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l as Level)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  level === l
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {l === 'AL' ? 'Advanced Level (A/L)' : l === 'OL' ? 'Ordinary Level (O/L)' : l}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('filter.subject')}
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!level}
          >
            <option value="">Select a subject</option>
            {availableSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Show which streams this subject belongs to (info only, auto-assigned) */}
        {subject && subjectStreams.length > 0 && level === 'AL' && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Available to streams:</span>{' '}
              {subjectStreams.filter(s => s !== 'General').join(', ')}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This resource will be visible to students from {subjectStreams.length > 1 ? 'these streams' : 'this stream'}
            </p>
          </div>
        )}

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('filter.medium')}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select language</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('submit.title_field')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('submit.title_placeholder')}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('submit.description')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('submit.description_placeholder')}
            required
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('submit.url')}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {resourceType === 'material'
              ? t('submit.url_hint_material')
              : t('submit.url_hint_session')}
          </p>
        </div>

        {/* Anonymous Checkbox - Only if logged in */}
        {user && (
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {t('submit.anonymous')}
                </span>
                <p className="text-xs text-gray-500">
                  {t('submit.anonymous_hint')}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || success !== null || !isFormValid}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            resourceType === 'material'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('submit.submitting')}
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              {t('submit.button')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
