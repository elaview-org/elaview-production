// src/components/landing/SocialProof.tsx
"use client";

import { Star } from 'lucide-react';

export function SocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { number: '2,500+', label: 'Ad Spaces' },
            { number: '1,200+', label: 'Advertisers' },
            { number: '500+', label: 'Space Owners' },
            { number: '98%', label: 'Satisfaction' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by Industry Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "Elaview has transformed how we approach outdoor advertising. Finding prime locations has never been easier.",
              author: "Alex Johnson",
              role: "Marketing Director"
            },
            {
              quote: "As a space owner, Elaview helped me monetize my storefront with quality advertisers. The platform is incredibly intuitive.",
              author: "Sarah Lee",
              role: "Property Owner"
            }
          ].map((testimonial, i) => (
            <div
              key={i}
              className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-white text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-white">
                  {testimonial.author}
                </div>
                <div className="text-gray-400 text-sm">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}