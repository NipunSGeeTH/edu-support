'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { DonationRequest, REQUEST_CATEGORIES, DISTRICTS, RequestCategory } from '@/types/donation';
import {
  Heart,
  ArrowLeft,
  MapPin,
  Phone,
  School,
  GraduationCap,
  Book,
  Shirt,
  PenTool,
  Laptop,
  Package,
  Filter,
  X,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react';

const getCategoryIcon = (category: RequestCategory) => {
  switch (category) {
    case 'Books':
      return <Book className="w-5 h-5" />;
    case 'Clothes':
      return <Shirt className="w-5 h-5" />;
    case 'Stationery':
      return <PenTool className="w-5 h-5" />;
    case 'Electronics':
      return <Laptop className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: RequestCategory) => {
  switch (category) {
    case 'Books':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Clothes':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'Stationery':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Electronics':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function DonatePage() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, selectedCategory, selectedDistrict]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, 'donationRequests'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests: DonationRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRequests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as DonationRequest);
      });
      
      setRequests(fetchedRequests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((req) => req.category === selectedCategory);
    }

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter((req) => req.district === selectedDistrict);
    }

    setFilteredRequests(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDistrict('all');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Donate to Help Students</h1>
                <p className="text-gray-600">Browse requests and help students in need</p>
              </div>
            </div>
            <Link
              href="/request-donation"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Request Help
            </Link>
          </div>
        </div>

        {/* Filter Toggle for Mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-4 px-4 py-3 bg-white rounded-lg border border-gray-200 flex items-center justify-center gap-2"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                {(selectedCategory !== 'all' || selectedDistrict !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Categories</option>
                  {REQUEST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Districts</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory !== 'all' || selectedDistrict !== 'all'
                    ? 'Try adjusting your filters to see more requests.'
                    : 'There are no donation requests at the moment.'}
                </p>
                {(selectedCategory !== 'all' || selectedDistrict !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                            request.category
                          )}`}
                        >
                          {getCategoryIcon(request.category)}
                          {request.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(request.createdAt)}
                        </span>
                      </div>

                      {/* Student Info */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <School className="w-4 h-4 text-gray-400" />
                          {request.school}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          {request.grade}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {request.district}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {request.description}
                      </p>

                      {/* Contact */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${request.phoneNumber}`}
                            className="font-medium text-red-600 hover:text-red-700 hover:underline"
                          >
                            {request.phoneNumber}
                          </a>
                        </div>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Address:</span> {request.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
