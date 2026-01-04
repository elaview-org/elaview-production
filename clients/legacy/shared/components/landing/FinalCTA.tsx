// src/components/landing/FinalCTA.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Sparkles, Building, CheckCircle } from 'lucide-react';

export function FinalCTA() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Advertising Strategy?
          </span>
        </h2>

        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of advertising professionals and space owners using Elaview
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push('/sign-up')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Free Trial</span>
          </button>
          
          <button 
            onClick={() => router.push('/sign-up')}
            className="backdrop-blur-lg bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Building className="w-5 h-5" />
            <span>List Your Space</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 flex-wrap text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Instant setup
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}