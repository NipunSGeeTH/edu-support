import Link from "next/link";
import {
  BookOpen,
  Video,
  Users,
  FileText,
  ArrowRight,
  GraduationCap,
  Globe,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Access free educational resources for A/L and O/L students. Past
              papers, notes, textbooks, and live sessions - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/materials"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Materials
              </Link>
              <Link
                href="/sessions"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
              >
                <Video className="w-5 h-5 mr-2" />
                View Sessions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive educational resources for Sri
              Lankan students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Past Papers
              </h3>
              <p className="text-gray-600">
                Access previous years&apos; exam papers with marking schemes for
                thorough exam preparation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Notes & Textbooks
              </h3>
              <p className="text-gray-600">
                Comprehensive study notes and textbook PDFs organized by subject
                and stream.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Video Sessions
              </h3>
              <p className="text-gray-600">
                Live classes and recorded lessons from experienced educators across
                all subjects.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multiple Languages
              </h3>
              <p className="text-gray-600">
                Resources available in Sinhala, Tamil, and English to suit your
                preferred medium.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                All Streams Covered
              </h3>
              <p className="text-gray-600">
                Science, Arts, Commerce, and Technology streams for both A/L and
                O/L students.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Free
              </h3>
              <p className="text-gray-600">
                All resources are completely free. No hidden charges, no premium
                tiers.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                Learning Materials
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
                Learning Sessions
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
            Are You a Teacher or Contributor?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of educators and share your resources with
            thousands of students.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Become a Contributor
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
