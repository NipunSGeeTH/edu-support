'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Resource,
  ResourceType,
  ResourceCategory,
  Level,
  Stream,
  Language,
  LEVELS,
  STREAMS,
  SUBJECTS,
  LANGUAGES,
  MATERIAL_CATEGORIES,
  SESSION_CATEGORIES,
} from '@/types/database';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddResourcePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [resourceType, setResourceType] = useState<ResourceType>('Material');
  const [category, setCategory] = useState<ResourceCategory>('Past Paper');
  const [level, setLevel] = useState<Level>('AL');
  const [stream, setStream] = useState<Stream>('Science');
  const [subject, setSubject] = useState<string>(SUBJECTS['Science'][0]);
  const [language, setLanguage] = useState<Language>('English');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const availableCategories =
    resourceType === 'Material' ? MATERIAL_CATEGORIES : SESSION_CATEGORIES;
  const availableStreams = STREAMS[level];
  const availableSubjects = SUBJECTS[stream];

  // Reset category when type changes
  const handleTypeChange = (type: ResourceType) => {
    setResourceType(type);
    setCategory(type === 'Material' ? 'Past Paper' : 'Live');
  };

  // Reset subject when stream changes
  const handleStreamChange = (newStream: Stream) => {
    setStream(newStream);
    setSubject(SUBJECTS[newStream][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to add resources');
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from('resources').insert({
        type: resourceType,
        category,
        level,
        stream,
        subject,
        language,
        title,
        description,
        url,
        contributor_id: user.id,
        contributor_name: user.user_metadata?.full_name || user.email,
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess(true);
        // Reset form
        setTitle('');
        setDescription('');
        setUrl('');
        // Redirect after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Resource</h1>
        <p className="text-gray-600">
          Share educational materials or session links
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          Resource added successfully! Redirecting to dashboard...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
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
            Resource Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('Material')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                resourceType === 'Material'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Material (Paper/Note/Book)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('Session')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                resourceType === 'Session'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Session (Live/Recording)
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === 'AL' ? 'Advanced Level (A/L)' : 'Ordinary Level (O/L)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stream
            </label>
            <select
              value={stream}
              onChange={(e) => handleStreamChange(e.target.value as Stream)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableStreams.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medium / Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., A/L Physics 2023 Past Paper"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the resource..."
            required
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL / Link
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
            {resourceType === 'Material'
              ? 'Link to PDF, Google Drive, or other file hosting'
              : 'Zoom/Teams meeting link or YouTube video URL'}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding Resource...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Resource
            </>
          )}
        </button>
      </form>
    </div>
  );
}
