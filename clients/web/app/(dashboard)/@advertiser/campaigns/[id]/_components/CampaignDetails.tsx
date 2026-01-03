// CampaignDetails.tsx
import React, { useState } from 'react';
import { Eye, Users, Target } from 'lucide-react';
import { ImageLightbox } from '../../../../../../../elaview-mvp/src/components/ui/ImageLightbox';

interface CampaignDetailsProps {
  campaign: {
    name: string;
    imageUrl: string;
    description?: string | null;
    targetAudience?: string | null;
    goals?: string | null;
  };
}

export function CampaignDetails({ campaign }: CampaignDetailsProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Campaign Details</h2>

          <div className="flex gap-6">
            {/* Campaign Image */}
            <div
              className="w-40 h-40 bg-slate-900/50 rounded-lg overflow-hidden shrink-0 border border-slate-600 shadow-md cursor-pointer group relative"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={campaign.imageUrl}
                alt={campaign.name}
                className="w-full h-full object-contain bg-slate-800"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400';
                }}
              />
              {/* Hover indicator */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Campaign Info */}
            <div className="flex-1 space-y-4">
              {campaign.description && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Description</h3>
                  <p className="text-white leading-relaxed">{campaign.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {campaign.targetAudience && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Target Audience
                    </h3>
                    <p className="text-white font-medium">{campaign.targetAudience}</p>
                  </div>
                )}

                {campaign.goals && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Goals
                    </h3>
                    <p className="text-white font-medium">{campaign.goals}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={campaign.imageUrl}
        alt={campaign.name}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
