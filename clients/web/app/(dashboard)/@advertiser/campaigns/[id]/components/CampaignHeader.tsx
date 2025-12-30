// CampaignHeader.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const CAMPAIGN_STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    icon: Edit
  },
  SUBMITTED: {
    label: 'Pending Approval',
    color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    icon: Edit
  },
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-500/10 text-green-400 border border-green-500/20',
    icon: Edit
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    icon: Edit
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon: Edit
  }
} as const;

interface CampaignHeaderProps {
  campaign: {
    id: string;
    name: string;
    status: keyof typeof CAMPAIGN_STATUS_CONFIG;
    createdAt: Date | string;
  };
  onDelete: () => void;
}

export function CampaignHeader({ campaign, onDelete }: CampaignHeaderProps) {
  const router = useRouter();
  const StatusIcon = CAMPAIGN_STATUS_CONFIG[campaign.status].icon;

  return (
    <div className="flex-shrink-0 p-6 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/campaigns')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${CAMPAIGN_STATUS_CONFIG[campaign.status].color}`}>
                <StatusIcon className="h-4 w-4 mr-1.5" />
                {CAMPAIGN_STATUS_CONFIG[campaign.status].label}
              </span>
              <span className="text-sm text-slate-500">
                Created {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {campaign.status === 'DRAFT' && (
            <>
              <button
                onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
