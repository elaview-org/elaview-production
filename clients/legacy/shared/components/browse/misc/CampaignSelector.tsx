// "use client";

// import React from 'react';
// import { Lock, AlertCircle, Plus, ShoppingCart, Megaphone } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// interface Campaign {
//   id: string;
//   name: string;
//   status: string;
//   creative?: string;
// }

// interface CampaignSelectorProps {
//   campaigns: Campaign[];
//   selectedCampaignId: string | null;
//   isLocked: boolean;
//   onCampaignChange: (campaignId: string) => void;
//   onCreateCampaign?: () => void;
//   cartCount: number;
// }

// export const CampaignSelector: React.FC<CampaignSelectorProps> = ({
//   campaigns,
//   selectedCampaignId,
//   isLocked,
//   onCampaignChange,
//   onCreateCampaign,
//   cartCount
// }) => {
//   const router = useRouter();

//   // No campaigns - show create campaign CTA
//   if (campaigns.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
//                 <AlertCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-amber-900">
//                   Create a campaign to get started
//                 </p>
//                 <p className="text-xs text-amber-700">
//                   You need an active campaign to browse and book advertising spaces
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onCreateCampaign}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-sm font-medium rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all shadow-sm hover:shadow-md"
//             >
//               <Plus className="h-4 w-4" />
//               Create Campaign
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Single campaign - auto-selected
//   if (campaigns.length === 1) {
//     const campaign = campaigns[0]!;
//     return (
//       <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-3.5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 shadow-sm">
//                   <Megaphone className="h-4 w-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-slate-500">Active Campaign</p>
//                   <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
//                 </div>
//               </div>
//               {isLocked && (
//                 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
//                   <Lock className="h-3 w-3" />
//                   <span className="text-xs font-medium">Locked</span>
//                 </div>
//               )}
//             </div>
            
//             <button
//               onClick={() => router.push('/cart')}
//               className="relative flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
//             >
//               <ShoppingCart className="h-4 w-4" />
//               <span>Cart</span>
//               {cartCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Multiple campaigns - show dropdown
//   return (
//     <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 py-3.5">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 shadow-sm">
//                 <Megaphone className="h-4 w-4 text-white" />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">
//                   Select Campaign
//                 </label>
//                 <select
//                   value={selectedCampaignId || ''}
//                   onChange={(e) => onCampaignChange(e.target.value)}
//                   disabled={isLocked}
//                   className={`pl-3 pr-10 py-1.5 border rounded-lg text-sm font-medium transition-all ${
//                     isLocked
//                       ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
//                       : 'bg-white text-slate-900 border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//                   }`}
//                 >
//                   <option value="">Choose a campaign...</option>
//                   {campaigns.map((campaign) => (
//                     <option key={campaign.id} value={campaign.id}>
//                       {campaign.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             {isLocked && (
//               <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
//                 <Lock className="h-3 w-3" />
//                 <span className="text-xs font-medium">Campaign locked after first space added</span>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => router.push('/cart')}
//             className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md"
//           >
//             <ShoppingCart className="h-4 w-4" />
//             <span>Cart</span>
//             {cartCount > 0 && (
//               <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600 text-xs font-bold">
//                 {cartCount}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };