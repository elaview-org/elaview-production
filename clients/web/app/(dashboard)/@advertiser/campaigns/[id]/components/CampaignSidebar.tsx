// CampaignSidebar.tsx
import React from 'react';
import { MapPin, Camera, CheckCircle, Clock, DollarSign } from 'lucide-react';

const decimalToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  return Number(value.toString());
};

interface CampaignSidebarProps {
  campaign: {
    _count: { bookings: number };
    totalBudget: any;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
  };
  bookingsByStatus: {
    needsProofReview: any[];
    paid: any[];
    pending: any[];
  };
  health: {
    percentage: number;
    status: string;
    color: string;
  };
}

export function CampaignSidebar({ campaign, bookingsByStatus, health }: CampaignSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Campaign Health */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Campaign Health</h3>

        <div className="flex items-center gap-4 mb-6">
          {/* Circular Progress */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={201.06}
                strokeDashoffset={201.06 - (201.06 * health.percentage) / 100}
                className={`text-${health.color}-500 transition-all duration-500`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {Math.round(health.percentage)}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-semibold text-white mb-1">Campaign Progress</div>
            <div className="text-xs text-slate-400">
              {bookingsByStatus.paid.length} of {campaign._count.bookings} spaces confirmed
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-slate-500 mr-2" />
              <span className="text-sm text-slate-400">Total Spaces</span>
            </div>
            <span className="font-semibold text-white">{campaign._count.bookings}</span>
          </div>

          {bookingsByStatus.needsProofReview.length > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-700">
              <div className="flex items-center">
                <Camera className="h-4 w-4 text-amber-400 mr-2" />
                <span className="text-sm text-slate-400">Needs Review</span>
              </div>
              <span className="font-semibold text-amber-400">{bookingsByStatus.needsProofReview.length}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-slate-400">Confirmed</span>
            </div>
            <span className="font-semibold text-white">{bookingsByStatus.paid.length}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-slate-400">Pending</span>
            </div>
            <span className="font-semibold text-white">{bookingsByStatus.pending.length}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-slate-400">Total Budget</span>
            </div>
            <span className="font-semibold text-white">${decimalToNumber(campaign.totalBudget).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {campaign.startDate && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-slate-400 mb-1">Start Date</div>
              <div className="text-white font-medium">
                {new Date(campaign.startDate).toLocaleDateString()}
              </div>
            </div>
            {campaign.endDate && (
              <div>
                <div className="text-slate-400 mb-1">End Date</div>
                <div className="text-white font-medium">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
