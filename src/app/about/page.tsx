import { BookOpen, Users, Target, Heart } from 'lucide-react';

export const metadata = {
  title: 'About - EduShare',
  description: 'Learn about EduShare, a free educational resource sharing platform for Sri Lankan students.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About EduShare
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering Sri Lankan students with free, accessible educational resources
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-2" />
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EduShare was created with a simple mission: to make quality educational
            resources accessible to every student in Sri Lanka, regardless of their
            location or economic background. We believe that education should be free
            and available to all.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            Our Values
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>✓ Free access to educational resources</li>
            <li>✓ Quality content curated by educators</li>
            <li>✓ Support for multiple languages</li>
            <li>✓ Community-driven platform</li>
            <li>✓ Equal opportunity for all students</li>
          </ul>
        </div>
      </div>

      {/* What We Offer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Past Papers</h3>
            <p className="text-sm text-gray-600">Previous exam papers with marking schemes</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Notes</h3>
            <p className="text-sm text-gray-600">Comprehensive study notes by educators</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Textbooks</h3>
            <p className="text-sm text-gray-600">Reference textbooks and guides</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Video Sessions</h3>
            <p className="text-sm text-gray-600">Live and recorded video lessons</p>
          </div>
        </div>
      </div>

      {/* For Contributors */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-center mb-6">
          <Users className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          For Contributors
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
          Are you a teacher, educator, or subject expert? Join our community of contributors
          and help thousands of students succeed. Share your notes, past papers, and
          educational content with students across Sri Lanka.
        </p>
        <div className="text-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Become a Contributor
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-4">
          Have questions or suggestions? We&apos;d love to hear from you.
        </p>
        <a
          href="mailto:contact@edushare.lk"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          contact@edushare.lk
        </a>
      </div>
    </div>
  );
}
