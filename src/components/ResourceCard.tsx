'use client';

import { Resource } from '@/types/database';
import {
  FileText,
  BookOpen,
  FileArchive,
  Video,
  Radio,
  ExternalLink,
  Calendar,
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const categoryIcons = {
  'Past Paper': FileArchive,
  'Note': FileText,
  'Textbook': BookOpen,
  'Live': Radio,
  'Recording': Video,
};

const categoryColors = {
  'Past Paper': 'bg-orange-100 text-orange-700',
  'Note': 'bg-blue-100 text-blue-700',
  'Textbook': 'bg-green-100 text-green-700',
  'Live': 'bg-red-100 text-red-700',
  'Recording': 'bg-purple-100 text-purple-700',
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = categoryIcons[resource.category];
  const colorClass = categoryColors[resource.category];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {resource.language}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {resource.title}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {resource.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {resource.level}
        </span>
        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
          {resource.stream}
        </span>
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {resource.subject}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(resource.created_at).toLocaleDateString()}
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{resource.category === 'Live' ? 'Join' : 'Open'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
