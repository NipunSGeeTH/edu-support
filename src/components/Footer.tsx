import Link from 'next/link';
import { BookOpen, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">EduSupport</span>
            </div>
            <p className="text-gray-400 max-w-md">
             Born from the impact of disaster, this free platform helps Sri Lankan students regain access to learning. Find past papers, notes, textbooks and sessions - Bringing education back to those who lost it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/materials" className="text-gray-300 hover:text-white transition-colors">
                  Learning Materials
                </Link>
              </li>
              <li>
                <Link href="/sessions" className="text-gray-300 hover:text-white transition-colors">
                  Learning Sessions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Contributor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:edusupport@kuppihub.org"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>edusupport@kuppihub.org</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p className='text-xs'>© {new Date().getFullYear()} EduSupport. All rights reserved.</p>
          <p className="mt-1">Rebuilding Futures Through Knowledge</p>
        </div>
      </div>
    </footer>
  );
}
