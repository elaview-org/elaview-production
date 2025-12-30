// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-slate-900 pt-16 pb-8">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      
      {/* Ambient background orb */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Column - Wider */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-white">Elaview</div>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              The modern marketplace connecting advertisers with premium outdoor advertising spaces. Transparent pricing, verified owners, real-time tracking.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@elaview.com"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* For Advertisers */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Advertisers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse-spaces" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Browse Spaces
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Space Owners */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Space Owners</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/list-your-space" className="text-slate-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  List Your Space
                </Link>
              </li>
              <li>
                <Link href="/owner-faq" className="text-slate-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Owner FAQ
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-slate-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/owner-resources" className="text-slate-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Elaview. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-center">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span>Secure payments powered by Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}