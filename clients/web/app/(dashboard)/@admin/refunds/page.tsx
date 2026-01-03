// // src/app/(admin)/admin/refunds/page.tsx
// "use client";

// import { api } from "../../../../../elaview-mvp/src/trpc/react";
// import { useState } from "react";
// import {
//   DollarSign,
//   Loader2,
//   User,
//   Calendar,
//   Search,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   CheckCircle,
//   FileText,
//   Download,
// } from "lucide-react";
// import { format } from "date-fns";

// type RefundType = 'FULL' | 'PARTIAL' | 'ALL';

// interface RefundHistoryItem {
//   amount: number;
//   timestamp: Date | string;
//   reason: string;
//   notes?: string;
//   refundId: string;
// }

// interface RefundData {
//   id: string;
//   bookingId: string;
//   campaignName: string;
//   advertiserName: string;
//   advertiserEmail: string;
//   spaceTitle: string;
//   refundAmount: number;
//   totalPaid: number;
//   type: 'FULL' | 'PARTIAL';
//   refundDate: Date | string | null;
//   reason: string | null;
//   stripeRefundId: string | null;
//   spaceOwnerName: string;
//   startDate: Date | string | null;
//   endDate: Date | string | null;
//   status: string;
//   proofStatus: string | null;
//   refundHistory?: RefundHistoryItem[];
// }

// export default function RefundsPage() {
//   const [search, setSearch] = useState('');
//   const [refundType, setRefundType] = useState<RefundType>('ALL');
//   const [offset, setOffset] = useState(0);
//   const limit = 20;

//   const { data, isLoading } = api.admin.finance.getRefundHistory.useQuery({
//     limit,
//     offset,
//     search: search || undefined,
//     refundType,
//   });

//   const refunds = data?.refunds ?? [];
//   const total = data?.total ?? 0;
//   const hasMore = data?.hasMore ?? false;
//   const summary = data?.summary ?? { totalRefundAmount: 0, fullRefunds: 0, partialRefunds: 0 };

//   const handleNextPage = () => {
//     if (hasMore) {
//       setOffset(prev => prev + limit);
//     }
//   };

//   const handlePrevPage = () => {
//     setOffset(prev => Math.max(0, prev - limit));
//   };

//   const exportToCSV = () => {
//     if (refunds.length === 0) return;

//     const headers = [
//       'Booking ID',
//       'Campaign',
//       'Space',
//       'Advertiser',
//       'Refund Amount',
//       'Total Paid',
//       'Type',
//       'Refund Date',
//       'Stripe Refund ID',
//       'Reason',
//     ];

//     const rows = refunds.map(r => [
//       r.bookingId,
//       r.campaignName,
//       r.spaceTitle,
//       r.advertiserEmail,
//       `$${r.refundAmount.toFixed(2)}`,
//       `$${r.totalPaid.toFixed(2)}`,
//       r.type,
//       r.refundDate ? format(new Date(r.refundDate), 'yyyy-MM-dd') : '',
//       r.stripeRefundId ?? '',
//       r.reason ?? '',
//     ]);

//     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `refunds_${format(new Date(), 'yyyy-MM-dd')}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="h-full w-full p-4">
//       <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
//         {/* Header - Fixed */}
//         <div className="flex-shrink-0 p-6 border-b border-slate-700">
//           <h1 className="text-3xl font-bold text-white">Refund History</h1>
//           <p className="text-slate-400 mt-1">
//             View and export all refund transactions
//           </p>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3">
//                 <DollarSign className="h-8 w-8 text-green-400" />
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">
//                     ${summary.totalRefundAmount.toFixed(2)}
//                   </h2>
//                   <p className="text-sm text-slate-400">Total Refunded</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="h-8 w-8 text-red-400" />
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">{summary.fullRefunds}</h2>
//                   <p className="text-sm text-slate-400">Full Refunds</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-8 w-8 text-yellow-400" />
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">{summary.partialRefunds}</h2>
//                   <p className="text-sm text-slate-400">Partial Refunds</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               {/* Search */}
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by booking ID, campaign, space, or email..."
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setOffset(0); // Reset to first page
//                   }}
//                   className="w-full pl-10 pr-10 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {search && (
//                   <button
//                     onClick={() => {
//                       setSearch('');
//                       setOffset(0);
//                     }}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 )}
//               </div>

//               {/* Type Filter */}
//               <div className="flex gap-2">
//                 {(['ALL', 'FULL', 'PARTIAL'] as const).map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => {
//                       setRefundType(type);
//                       setOffset(0);
//                     }}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                       refundType === type
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-slate-900/50 text-slate-300 hover:bg-slate-900/70'
//                     }`}
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>

//               {/* Export Button */}
//               <button
//                 onClick={exportToCSV}
//                 disabled={refunds.length === 0}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <Download className="h-5 w-5" />
//                 Export CSV
//               </button>
//             </div>
//           </div>

//           {/* Refunds Table */}
//           {refunds.length === 0 ? (
//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
//               <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
//               <h3 className="text-lg font-medium text-white mb-2">No Refunds Found</h3>
//               <p className="text-slate-400">
//                 {search
//                   ? 'Try adjusting your search filters'
//                   : 'No refund transactions to display'}
//               </p>
//             </div>
//           ) : (
//             <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
//               {/* Desktop Table View */}
//               <div className="hidden lg:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-800 border-b border-slate-700">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Booking
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Advertiser
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Space
//                       </th>
//                       <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
//                         Reason
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-800">
//                     {refunds.map((refund) => (
//                       <RefundTableRow key={refund.id} refund={refund} />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Card View */}
//               <div className="lg:hidden divide-y divide-slate-800">
//                 {refunds.map((refund) => (
//                   <RefundCard key={refund.id} refund={refund} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Pagination */}
//           {total > limit && (
//             <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-4">
//               <div className="text-sm text-slate-400">
//                 Showing {offset + 1} - {Math.min(offset + limit, total)} of {total} refunds
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={offset === 0}
//                   className="p-2 bg-slate-900/50 text-white rounded-lg hover:bg-slate-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={!hasMore}
//                   className="p-2 bg-slate-900/50 text-white rounded-lg hover:bg-slate-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Desktop table row component
// function RefundTableRow({ refund }: { refund: RefundData }) {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <>
//       <tr
//         className="hover:bg-slate-800/50 cursor-pointer transition-colors"
//         onClick={() => setExpanded(!expanded)}
//       >
//         <td className="px-4 py-4">
//           <div>
//             <div className="text-sm font-medium text-white truncate max-w-[150px]">
//               {refund.campaignName}
//             </div>
//             <div className="text-xs text-slate-500">{refund.bookingId.substring(0, 8)}...</div>
//           </div>
//         </td>
//         <td className="px-4 py-4">
//           <div className="flex items-center gap-2">
//             <User className="h-4 w-4 text-slate-500" />
//             <div>
//               <div className="text-sm text-white">{refund.advertiserName}</div>
//               <div className="text-xs text-slate-500">{refund.advertiserEmail}</div>
//             </div>
//           </div>
//         </td>
//         <td className="px-4 py-4">
//           <div className="text-sm text-slate-300 truncate max-w-[200px]">
//             {refund.spaceTitle}
//           </div>
//         </td>
//         <td className="px-4 py-4 text-right">
//           <div className="text-sm font-semibold text-green-400">
//             ${refund.refundAmount.toFixed(2)}
//           </div>
//           <div className="text-xs text-slate-500">
//             of ${refund.totalPaid.toFixed(2)}
//           </div>
//         </td>
//         <td className="px-4 py-4 text-center">
//           <span
//             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//               refund.type === 'FULL'
//                 ? 'bg-red-900/20 text-red-400 border border-red-800'
//                 : 'bg-yellow-900/20 text-yellow-400 border border-yellow-800'
//             }`}
//           >
//             {refund.type}
//           </span>
//         </td>
//         <td className="px-4 py-4">
//           <div className="flex items-center gap-2 text-sm text-slate-300">
//             <Calendar className="h-4 w-4 text-slate-500" />
//             {refund.refundDate ? format(new Date(refund.refundDate), 'MMM d, yyyy') : 'N/A'}
//           </div>
//         </td>
//         <td className="px-4 py-4">
//           <div className="text-sm text-slate-300 truncate max-w-[150px]">
//             {refund.reason ?? 'N/A'}
//           </div>
//         </td>
//       </tr>
//       {expanded && (
//         <tr>
//           <td colSpan={7} className="px-4 py-4 bg-slate-800/30">
//             <RefundDetails refund={refund} />
//           </td>
//         </tr>
//       )}
//     </>
//   );
// }

// // Mobile card component
// function RefundCard({ refund }: { refund: RefundData }) {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div className="p-4">
//       <div onClick={() => setExpanded(!expanded)} className="cursor-pointer">
//         <div className="flex justify-between items-start mb-2">
//           <div className="flex-1">
//             <h3 className="text-sm font-medium text-white truncate">{refund.campaignName}</h3>
//             <p className="text-xs text-slate-500 mt-1">{refund.advertiserEmail}</p>
//           </div>
//           <span
//             className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
//               refund.type === 'FULL'
//                 ? 'bg-red-900/20 text-red-400 border border-red-800'
//                 : 'bg-yellow-900/20 text-yellow-400 border border-yellow-800'
//             }`}
//           >
//             {refund.type}
//           </span>
//         </div>
//         <div className="flex justify-between items-center mt-2">
//           <span className="text-lg font-semibold text-green-400">
//             ${refund.refundAmount.toFixed(2)}
//           </span>
//           <span className="text-xs text-slate-500">
//             {refund.refundDate ? format(new Date(refund.refundDate), 'MMM d, yyyy') : 'N/A'}
//           </span>
//         </div>
//       </div>
//       {expanded && (
//         <div className="mt-4 pt-4 border-t border-slate-700">
//           <RefundDetails refund={refund} />
//         </div>
//       )}
//     </div>
//   );
// }

// // Refund details component (shown when expanded)
// function RefundDetails({ refund }: { refund: RefundData }) {
//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <p className="text-xs text-slate-500 mb-1">Booking ID</p>
//           <p className="text-sm text-white font-mono">{refund.bookingId}</p>
//         </div>
//         <div>
//           <p className="text-xs text-slate-500 mb-1">Stripe Refund ID</p>
//           <p className="text-sm text-white font-mono">{refund.stripeRefundId ?? 'N/A'}</p>
//         </div>
//         <div>
//           <p className="text-xs text-slate-500 mb-1">Space Owner</p>
//           <p className="text-sm text-white">{refund.spaceOwnerName}</p>
//         </div>
//         <div>
//           <p className="text-xs text-slate-500 mb-1">Campaign Period</p>
//           <p className="text-sm text-white">
//             {refund.startDate && format(new Date(refund.startDate), 'MMM d')} -{' '}
//             {refund.endDate && format(new Date(refund.endDate), 'MMM d, yyyy')}
//           </p>
//         </div>
//         <div>
//           <p className="text-xs text-slate-500 mb-1">Booking Status</p>
//           <p className="text-sm text-white">{refund.status}</p>
//         </div>
//         {refund.proofStatus && (
//           <div>
//             <p className="text-xs text-slate-500 mb-1">Proof Status</p>
//             <p className="text-sm text-white">{refund.proofStatus}</p>
//           </div>
//         )}
//       </div>

//       {refund.refundHistory && refund.refundHistory.length > 0 && (
//         <div className="mt-4">
//           <p className="text-xs text-slate-500 mb-2 font-semibold">Refund History</p>
//           <div className="space-y-2">
//             {refund.refundHistory.map((h: RefundHistoryItem, i: number) => (
//               <div
//                 key={i}
//                 className="bg-slate-900/50 border border-slate-600 rounded p-3 text-sm"
//               >
//                 <div className="flex justify-between items-start mb-1">
//                   <span className="font-medium text-green-400">${h.amount.toFixed(2)}</span>
//                   <span className="text-xs text-slate-500">
//                     {h.timestamp && format(new Date(h.timestamp), 'MMM d, yyyy')}
//                   </span>
//                 </div>
//                 <p className="text-xs text-white">
//                   Reason: <span className="text-slate-400">{h.reason}</span>
//                 </p>
//                 {h.notes && (
//                   <p className="text-xs text-slate-400 italic mt-1">{h.notes}</p>
//                 )}
//                 <p className="text-xs text-slate-500 mt-1">Refund ID: {h.refundId}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
