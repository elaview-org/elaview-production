import React, { useState } from 'react';
import { DollarSign, TrendingUp, MapPin, Users, Info, X, BookOpen, AlertCircle } from 'lucide-react';

const PRICING_DATA = {
  BILLBOARD: {
    rural: { min: 250, max: 750 },
    suburban: { min: 1000, max: 4000 },
    urban: { min: 3000, max: 25000 },
  },
  STOREFRONT: {
    rural: { min: 300, max: 800 },
    suburban: { min: 800, max: 2000 },
    urban: { min: 1500, max: 5000 },
  },
  DIGITAL_DISPLAY: {
    rural: { min: 400, max: 1000 },
    suburban: { min: 1200, max: 3500 },
    urban: { min: 3500, max: 15000 },
  },
  WINDOW_DISPLAY: {
    rural: { min: 200, max: 600 },
    suburban: { min: 500, max: 1500 },
    urban: { min: 1000, max: 3000 },
  },
  TRANSIT: {
    rural: { min: 300, max: 800 },
    suburban: { min: 800, max: 2500 },
    urban: { min: 2000, max: 8000 },
  },
  VEHICLE_WRAP: {
    rural: { min: 400, max: 1000 },
    suburban: { min: 1000, max: 2500 },
    urban: { min: 2000, max: 6000 },
  },
  OTHER: {
    rural: { min: 200, max: 1000 },
    suburban: { min: 500, max: 2000 },
    urban: { min: 1000, max: 5000 },
  }
};

export default function PricingGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm font-medium"
      >
        <BookOpen className="h-4 w-4" />
        View 2025 Pricing Guide
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-400" />
                  Advertising Space Pricing Guide 2025
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Industry-standard rates to help you price competitively
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* How to Use This Guide */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  How to Use This Guide
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong className="text-white">1. Find your space type</strong> in the pricing table below
                  </p>
                  <p>
                    <strong className="text-white">2. Determine your location tier:</strong> Rural (&lt;50k pop), Suburban (50k-500k), or Urban (500k+)
                  </p>
                  <p>
                    <strong className="text-white">3. Adjust for your specifics:</strong> Consider size, traffic, and visibility
                  </p>
                  <p>
                    <strong className="text-white">4. Convert to daily rate:</strong> Divide monthly rate by 30 for your per-day price
                  </p>
                </div>
              </div>

              {/* Market Pricing Table */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  2025 Market Pricing by Location (Monthly Rates)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Space Type</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Rural
                          <div className="text-xs text-slate-500 font-normal">&lt;50k pop</div>
                        </th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Suburban
                          <div className="text-xs text-slate-500 font-normal">50k-500k</div>
                        </th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Urban
                          <div className="text-xs text-slate-500 font-normal">500k+</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {Object.entries(PRICING_DATA).map(([type, data]) => (
                        <tr key={type} className="hover:bg-slate-800/50">
                          <td className="py-3 px-4 text-white font-medium">
                            {type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-slate-300">
                              ${data.rural.min}-${data.rural.max}
                            </div>
                            <div className="text-xs text-slate-500">
                              ~${Math.round(data.rural.min/30)}-${Math.round(data.rural.max/30)}/day
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-slate-300">
                              ${data.suburban.min.toLocaleString()}-${data.suburban.max.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              ~${Math.round(data.suburban.min/30)}-${Math.round(data.suburban.max/30)}/day
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-slate-300">
                              ${data.urban.min.toLocaleString()}-${data.urban.max.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              ~${Math.round(data.urban.min/30)}-${Math.round(data.urban.max/30)}/day
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Increase Your Price For:
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">↑</span>
                      <div>
                        <strong className="text-white">High Traffic:</strong> 10k+ daily viewers → +30-40% premium
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">↑</span>
                      <div>
                        <strong className="text-white">Large Size:</strong> 100+ sq ft → +40-50% premium
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">↑</span>
                      <div>
                        <strong className="text-white">Prime Location:</strong> Downtown, highways → +50-100%
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">↑</span>
                      <div>
                        <strong className="text-white">Digital/LED:</strong> Dynamic displays → +30-50%
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">↑</span>
                      <div>
                        <strong className="text-white">High Visibility:</strong> Major intersections → +25-35%
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    Decrease Your Price For:
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">↓</span>
                      <div>
                        <strong className="text-white">Low Traffic:</strong> &lt;1k daily viewers → -20-30% discount
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">↓</span>
                      <div>
                        <strong className="text-white">Small Size:</strong> &lt;20 sq ft → -25-30% discount
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">↓</span>
                      <div>
                        <strong className="text-white">Poor Visibility:</strong> Obstructed views → -30-40%
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">↓</span>
                      <div>
                        <strong className="text-white">Remote Location:</strong> Off main roads → -20-30%
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">↓</span>
                      <div>
                        <strong className="text-white">Longer Commitment:</strong> 3+ months → -10-15%
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Seasonal Pricing */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Seasonal Pricing Strategy
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="space-y-3">
                    <div>
                      <div className="text-green-400 font-medium mb-1">🔥 Peak Season (Oct-Dec)</div>
                      <div>Holiday shopping season - charge <strong className="text-white">20-30% above</strong> base rates</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-medium mb-1">📈 High Season (Mar-May, Aug-Sep)</div>
                      <div>Strong demand - charge <strong className="text-white">standard rates</strong></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-orange-400 font-medium mb-1">📉 Slow Season (Jan-Feb)</div>
                      <div>Post-holiday lull - offer <strong className="text-white">15-20% discounts</strong> to attract bookings</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium mb-1">🏖️ Summer Dip (Jun-Jul)</div>
                      <div>Slight slowdown - maintain rates or offer <strong className="text-white">10% discount</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-green-400" />
                  Real-World Pricing Examples
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-white font-medium mb-2">Small Town Billboard</div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>• Location: Rural area (&lt;20k pop)</div>
                      <div>• Size: 48 sq ft (small)</div>
                      <div>• Traffic: Low (500/day)</div>
                      <div className="text-green-400 font-medium pt-2">→ $250-500/month (~$8-17/day)</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-white font-medium mb-2">Downtown Storefront</div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>• Location: Mid-size city (150k pop)</div>
                      <div>• Size: 120 sq ft (large)</div>
                      <div>• Traffic: High (5k/day)</div>
                      <div className="text-green-400 font-medium pt-2">→ $1,200-3,000/month (~$40-100/day)</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-white font-medium mb-2">Urban Digital Display</div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>• Location: Major city (1M+ pop)</div>
                      <div>• Size: 60 sq ft (medium)</div>
                      <div>• Traffic: Very high (50k/day)</div>
                      <div className="text-green-400 font-medium pt-2">→ $5,000-12,000/month (~$167-400/day)</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-white font-medium mb-2">Suburban Window Display</div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>• Location: Suburb (80k pop)</div>
                      <div>• Size: 32 sq ft (medium)</div>
                      <div>• Traffic: Medium (2k/day)</div>
                      <div className="text-green-400 font-medium pt-2">→ $500-1,200/month (~$17-40/day)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  Expert Tips for Pricing Success
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Start with market average, adjust based on unique features</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Research competitor pricing in your specific area</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Offer volume discounts for longer booking commitments</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Consider separate installation fees ($50-500 typical)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Premium locations justify premium pricing - don't undersell</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Adjust seasonally - flexible pricing attracts more bookings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Track your booking rate - if 100%, consider raising prices</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Document traffic counts to justify higher rates</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 p-6 bg-slate-900/50">
              <p className="text-xs text-slate-500 text-center">
                Pricing data based on 2025 industry averages from billboard associations, advertising networks, and market research.
                Actual rates vary by specific location, visibility, and market conditions. Use this guide as a starting point and adjust for your unique circumstances.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}