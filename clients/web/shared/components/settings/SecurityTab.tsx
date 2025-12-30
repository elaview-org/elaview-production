// src/components/settings/SecurityTab.tsx
"use client";

import { Shield, Key, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function SecurityTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
        <p className="text-gray-400">
          Manage your account security and authentication settings
        </p>
      </div>

      {/* Clerk-managed Security */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Security Settings Managed by Clerk
            </h3>
            <p className="text-gray-300 mb-4">
              Your authentication and security settings are securely managed by Clerk, our authentication provider.
            </p>
            <Link
              href="/user"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Clerk Security Settings
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Available Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Available Security Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Key,
              title: 'Password Management',
              description: 'Change your password and set password requirements',
              color: 'blue'
            },
            {
              icon: Smartphone,
              title: 'Two-Factor Authentication',
              description: 'Add an extra layer of security with 2FA',
              color: 'green'
            },
            {
              icon: Monitor,
              title: 'Active Sessions',
              description: 'View and manage your active login sessions',
              color: 'purple'
            },
            {
              icon: Shield,
              title: 'Connected Accounts',
              description: 'Manage your social login connections',
              color: 'cyan'
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-500/20 text-blue-400',
              green: 'bg-green-500/20 text-green-400',
              purple: 'bg-purple-500/20 text-purple-400',
              cyan: 'bg-cyan-500/20 text-cyan-400',
            };
            
            return (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Security Best Practices</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Use a strong, unique password for your account</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Enable two-factor authentication for added security</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Regularly review your active sessions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Keep your contact information up to date</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Be cautious of phishing attempts and suspicious emails</span>
          </li>
        </ul>
      </div>
    </div>
  );
}