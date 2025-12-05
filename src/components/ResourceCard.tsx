'use client';

import { Material, Session, MaterialCategory, SessionType } from '@/types/database';
import { parseStreamArray } from '@/lib/utils';
import {
  FileText,
  BookOpen,
  FileArchive,
  Video,
  Radio,
  ExternalLink,
  Calendar,
  Clock,
} from 'lucide-react';

type ResourceItem = Material | Session;

interface ResourceCardProps {
  resource: ResourceItem;
  type: 'material' | 'session';
}

const materialCategoryIcons: Record<MaterialCategory, typeof FileArchive> = {
  'Past Paper': FileArchive,
  'Note': FileText,
  'Textbook': BookOpen,
  'Model Paper': FileText,
};

const sessionTypeIcons: Record<SessionType, typeof Radio> = {
  'Live': Radio,
  'Recording': Video,
};

const materialCategoryColors: Record<MaterialCategory, string> = {
  'Past Paper': 'bg-orange-100 text-orange-700',
  'Note': 'bg-blue-100 text-blue-700',
  'Textbook': 'bg-green-100 text-green-700',
    'Model Paper': 'bg-purple-100 text-purple-700',
};

const sessionTypeColors: Record<SessionType, string> = {
  'Live': 'bg-red-100 text-red-700',
  'Recording': 'bg-purple-100 text-purple-700',
};

export default function ResourceCard({ resource, type }: ResourceCardProps) {
  const isMaterial = type === 'material';
  const material = isMaterial ? (resource as Material) : null;
  const session = !isMaterial ? (resource as Session) : null;

  const Icon = isMaterial 
    ? materialCategoryIcons[material!.category]
    : sessionTypeIcons[session!.session_type];
  
  const colorClass = isMaterial
    ? materialCategoryColors[material!.category]
    : sessionTypeColors[session!.session_type];

  const formatTime = (time: string | null) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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

      {/* Session Schedule Info */}
      {session?.session_type === 'Live' && session.session_date && (
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          {session.start_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(session.start_time)}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {resource.level}
        </span>
        {/* Display streams - filter out 'General' for cleaner display */}
        {parseStreamArray(resource.stream).filter(s => s !== 'General').map((s) => (
          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {s}
          </span>
        ))}
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
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
          <span>{session?.session_type === 'Live' ? 'Join' : 'Open'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
