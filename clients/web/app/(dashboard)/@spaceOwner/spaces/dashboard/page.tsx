// // src/app/(space-owner)/spaces/dashboard/page.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Building,
//   ClipboardList,
//   Megaphone,
//   DollarSign,
//   TrendingUp,
//   Calendar,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   ArrowRight,
//   Eye,
//   MapPin,
//   Star,
//   Camera,
// } from "lucide-react";
// import { api } from "../../../../../../elaview-mvp/src/trpc/react";
// import { getInstallationWindowStatus, getUrgencyBadge } from "../../../../../../elaview-mvp/src/lib/installation-window";

// // Native JavaScript date utilities
// function formatDate(date: Date): string {
//   return new Date(date).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function getDaysUntil(date: Date): number {
//   const now = new Date();
//   const target = new Date(date);
//   const diffMs = target.getTime() - now.getTime();
//   return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
// }

// function formatCurrency(amount: number): string {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// export default function SpaceOwnerDashboard() {
//   const { data: spaces, isLoading: spacesLoading } = api.spaces.getMySpaces.useQuery();
//   const { data: requests, isLoading: requestsLoading } = api.bookings.getPendingRequests.useQuery();
//   const { data: bookings, isLoading: bookingsLoading } = api.bookings.getMyBookings.useQuery();
//   const { data: earnings, isLoading: earningsLoading } = api.bookings.getEarnings.useQuery();

//   const isLoading = spacesLoading || requestsLoading || bookingsLoading || earningsLoading;

//   // Calculate stats
//   const activeSpaces = spaces?.filter((s) => s.status === "ACTIVE").length ?? 0;
//   const pendingRequests = requests?.filter((r) => r.status === "PENDING_APPROVAL").length ?? 0;
//   const activeBookings =
//     bookings?.filter((b) => ["CONFIRMED", "ACTIVE"].includes(b.status)).length ?? 0;
//   const thisMonthEarnings = earnings?.thisMonthEarnings ?? 0;

//   // Upcoming installations (next 30 days)
//   const upcomingInstallations =
//     bookings
//       ?.filter((b) => {
//         if (b.status !== "CONFIRMED" && b.status !== "ACTIVE") return false;
//         const daysUntil = getDaysUntil(b.startDate);
//         return daysUntil >= 0 && daysUntil <= 30;
//       })
//       .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) ?? [];

//   // Bookings needing proof upload
//   const needsProofUpload =
//     bookings
//       ?.filter((b) => {
//         if (b.status !== "CONFIRMED" || b.proofStatus) return false;
//         const windowStatus = getInstallationWindowStatus(b.startDate);
//         return windowStatus.canUpload;
//       })
//       .map((b) => {
//         const windowStatus = getInstallationWindowStatus(b.startDate);
//         return {
//           booking: b,
//           windowStatus,
//           sortPriority: windowStatus.daysRemaining ?? 999,
//         };
//       })
//       .sort((a, b) => a.sortPriority - b.sortPriority) ?? [];

//   // Action required items
//   const actionRequired = [
//     ...(requests
//       ?.filter((r) => r.status === "PENDING_APPROVAL")
//       .map((r) => ({
//         id: r.id,
//         type: "BOOKING_REQUEST" as const,
//         title: "New Booking Request",
//         description: `${r.campaign.advertiser.name} wants to book "${r.space.title}"`,
//         link: "/requests",
//         priority: "high" as const,
//         urgency: "high" as const,
//         colorClass: "orange" as const,
//       })) ?? []),
//     ...needsProofUpload.map(({ booking, windowStatus }) => ({
//       id: booking.id,
//       type: "PROOF_UPLOAD_NEEDED" as const,
//       title: "Upload Installation Proof",
//       description: `"${booking.space.title}" - ${windowStatus.message}`,
//       link: `/messages?campaign=${booking.campaignId}&action=upload-proof`,
//       priority: windowStatus.urgency,
//       urgency: windowStatus.urgency,
//       colorClass: windowStatus.colorClass,
//       daysRemaining: windowStatus.daysRemaining,
//     })),
//     ...(bookings
//       ?.filter((b) => b.proofStatus === "PENDING" && b.status === "ACTIVE")
//       .map((b) => ({
//         id: b.id,
//         type: "PROOF_PENDING" as const,
//         title: "Proof Awaiting Approval",
//         description: `Proof for "${b.space.title}" needs advertiser approval`,
//         link: `/messages?campaign=${b.campaignId}`,
//         priority: "medium" as const,
//         urgency: "medium" as const,
//         colorClass: "yellow" as const,
//       })) ?? []),
//   ].sort((a, b) => {
//     const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
//     return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
//   });

//   // Earnings breakdown
//   const totalPaidOut =
//     earnings?.bookings
//       ?.filter((b) => b.payoutProcessedAt !== null)
//       ?.reduce((sum, b) => sum + Number(b.spaceOwnerAmount), 0) ?? 0;

//   const inEscrow =
//     earnings?.bookings
//       ?.filter((b) => b.status === "ACTIVE" && b.proofStatus === "APPROVED" && !b.payoutProcessedAt)
//       ?.reduce((sum, b) => sum + Number(b.spaceOwnerAmount), 0) ?? 0;

//   // Best performing space
//   const bestSpace = spaces?.reduce((best, current) => {
//     const currentRevenue = Number(current.totalRevenue);
//     const bestRevenue = Number(best?.totalRevenue ?? 0);
//     return currentRevenue > bestRevenue ? current : best;
//   }, spaces[0]);

//   // Recent activity (last 7 days)
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   const recentActivity = [
//     ...(bookings
//       ?.filter((b) => new Date(b.createdAt) >= sevenDaysAgo)
//       .map((b) => ({
//         id: b.id,
//         type: "booking",
//         title: b.status === "PENDING_APPROVAL" ? "New booking request" : "Booking approved",
//         description: `${b.campaign.name} - ${b.space.title}`,
//         timestamp: b.createdAt,
//         icon: ClipboardList,
//       })) ?? []),
//     ...(earnings?.bookings
//       ?.filter((b) => b.paidAt && new Date(b.paidAt) >= sevenDaysAgo)
//       .map((b) => ({
//         id: b.id,
//         type: "payment",
//         title: "Payment received",
//         description: `${formatCurrency(Number(b.totalAmount))} for ${b.space.title}`,
//         timestamp: b.paidAt!,
//         icon: DollarSign,
//       })) ?? []),
//   ]
//     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//     .slice(0, 5);

//   if (isLoading) {
//     return (
//       <div className="h-full w-full p-4">
//         <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//           <div className="flex flex-col items-center gap-3">
//             <Loader2 className="h-10 w-10 animate-spin text-green-500" />
//             <p className="text-sm text-slate-400">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full w-full p-4">
//       <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//         {/* Header - Fixed */}
//         <div className="flex-shrink-0 border-b border-slate-800 p-6">
//           <h1 className="text-3xl font-bold text-white">Dashboard</h1>
//           <p className="mt-2 text-slate-400">
//             Welcome back! Here's what's happening with your spaces.
//           </p>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 space-y-6 overflow-y-auto p-6">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400">Active Spaces</p>
//                   <p className="mt-2 text-3xl font-bold text-white">{activeSpaces}</p>
//                 </div>
//                 <div className="rounded-lg bg-green-600 p-3">
//                   <Building className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400">Pending Requests</p>
//                   <p className="mt-2 text-3xl font-bold text-white">{pendingRequests}</p>
//                 </div>
//                 <div className="rounded-lg bg-orange-600 p-3">
//                   <ClipboardList className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400">Active Campaigns</p>
//                   <p className="mt-2 text-3xl font-bold text-white">{activeBookings}</p>
//                 </div>
//                 <div className="rounded-lg bg-blue-600 p-3">
//                   <Megaphone className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400">This Month</p>
//                   <p className="mt-2 text-3xl font-bold text-white">
//                     {formatCurrency(thisMonthEarnings)}
//                   </p>
//                 </div>
//                 <div className="rounded-lg bg-purple-600 p-3">
//                   <DollarSign className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Required */}
//           {actionRequired.length > 0 && (
//             <div
//               className={`rounded-xl border-2 p-6 ${
//                 actionRequired.some((item) => item.urgency === "critical")
//                   ? "border-red-500/30 bg-red-500/10"
//                   : actionRequired.some((item) => item.urgency === "high")
//                     ? "border-orange-500/30 bg-orange-500/10"
//                     : "border-yellow-500/30 bg-yellow-500/10"
//               }`}
//             >
//               <div className="mb-4 flex items-center gap-3">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//                 <h2 className="text-lg font-semibold text-white">Action Required</h2>
//                 <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
//                   {actionRequired.length}
//                 </span>
//               </div>

//               <div className="space-y-3">
//                 {actionRequired.slice(0, 5).map((item) => {
//                   const badge =
//                     item.type === "PROOF_UPLOAD_NEEDED" ? getUrgencyBadge(item.urgency) : null;

//                   return (
//                     <Link
//                       key={item.id}
//                       href={item.link}
//                       className={`block rounded-lg border-2 p-4 transition-all hover:scale-[1.02] ${
//                         item.colorClass === "red"
//                           ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
//                           : item.colorClass === "orange"
//                             ? "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50"
//                             : item.colorClass === "yellow"
//                               ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50"
//                               : "border-slate-600 bg-slate-700 hover:border-slate-500"
//                       }`}
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex flex-1 items-start gap-3">
//                           <div
//                             className={`flex-shrink-0 rounded-lg p-2 ${
//                               item.type === "PROOF_UPLOAD_NEEDED"
//                                 ? `bg-${item.colorClass}-500/10 border border-${item.colorClass}-500/20`
//                                 : item.type === "BOOKING_REQUEST"
//                                   ? "border border-orange-500/20 bg-orange-500/10"
//                                   : "border border-yellow-500/20 bg-yellow-500/10"
//                             }`}
//                           >
//                             {item.type === "PROOF_UPLOAD_NEEDED" ? (
//                               <Camera className={`h-4 w-4 text-${item.colorClass}-400`} />
//                             ) : item.type === "BOOKING_REQUEST" ? (
//                               <ClipboardList className="h-4 w-4 text-orange-400" />
//                             ) : (
//                               <Clock className="h-4 w-4 text-yellow-400" />
//                             )}
//                           </div>

//                           <div className="min-w-0 flex-1">
//                             <div className="flex flex-wrap items-center gap-2">
//                               <p className="font-medium text-white">{item.title}</p>
//                               {badge && (
//                                 <span
//                                   className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}
//                                 >
//                                   {badge.icon} {badge.text}
//                                 </span>
//                               )}
//                             </div>
//                             <p className="mt-1 text-sm text-slate-400">{item.description}</p>
//                             {item.type === "PROOF_UPLOAD_NEEDED" &&
//                               item.daysRemaining !== undefined && (
//                                 <p
//                                   className={`mt-2 text-xs font-semibold ${
//                                     item.daysRemaining <= 2
//                                       ? "text-red-400"
//                                       : item.daysRemaining <= 4
//                                         ? "text-orange-400"
//                                         : "text-yellow-400"
//                                   }`}
//                                 >
//                                   ⏰ {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""}{" "}
//                                   remaining
//                                 </p>
//                               )}
//                           </div>
//                         </div>

//                         <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-slate-400" />
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               {actionRequired.length > 5 && (
//                 <p className="mt-3 text-center text-sm text-slate-400">
//                   + {actionRequired.length - 5} more items requiring attention
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Two Column Layout */}
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Upcoming Installations */}
//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
//               <div className="mb-6 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5 text-blue-400" />
//                   <h2 className="text-lg font-semibold text-white">Upcoming Installations</h2>
//                 </div>
//                 <Link
//                   href="/spaces/active-campaigns"
//                   className="text-sm text-blue-400 hover:text-blue-300"
//                 >
//                   View all
//                 </Link>
//               </div>

//               {upcomingInstallations.length === 0 ? (
//                 <div className="py-8 text-center">
//                   <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-600" />
//                   <p className="text-sm text-slate-400">No upcoming installations</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {upcomingInstallations.slice(0, 4).map((booking) => {
//                     const daysUntil = getDaysUntil(booking.startDate);
//                     const urgencyColor =
//                       daysUntil <= 3 ? "red" : daysUntil <= 7 ? "orange" : "green";

//                     return (
//                       <div
//                         key={booking.id}
//                         className="flex items-start gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-3"
//                       >
//                         <div
//                           className={`flex-shrink-0 rounded-lg p-2 bg-${urgencyColor}-500/10 border border-${urgencyColor}-500/20`}
//                         >
//                           <Clock className={`h-4 w-4 text-${urgencyColor}-400`} />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-medium text-white">{booking.space.title}</p>
//                           <p className="mt-1 text-xs text-slate-400">{booking.campaign.name}</p>
//                           <div className="mt-2 flex items-center gap-3">
//                             <span className="text-xs text-slate-500">
//                               {formatDate(booking.startDate)}
//                             </span>
//                             <span className={`text-xs font-semibold text-${urgencyColor}-400`}>
//                               {daysUntil === 0
//                                 ? "Today"
//                                 : daysUntil === 1
//                                   ? "Tomorrow"
//                                   : `${daysUntil} days`}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Earnings Overview */}
//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
//               <div className="mb-6 flex items-center gap-2">
//                 <DollarSign className="h-5 w-5 text-green-400" />
//                 <h2 className="text-lg font-semibold text-white">Earnings Overview</h2>
//               </div>

//               <div className="space-y-4">
//                 <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-slate-400">Total Paid Out</p>
//                       <p className="mt-1 text-2xl font-bold text-green-400">
//                         {formatCurrency(totalPaidOut)}
//                       </p>
//                     </div>
//                     <CheckCircle className="h-8 w-8 text-green-400" />
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-slate-400">In Escrow (Pending Payout)</p>
//                       <p className="mt-1 text-2xl font-bold text-orange-400">
//                         {formatCurrency(inEscrow)}
//                       </p>
//                     </div>
//                     <Clock className="h-8 w-8 text-orange-400" />
//                   </div>
//                   <p className="mt-3 text-xs text-slate-500">
//                     Funds held until campaign completion
//                   </p>
//                 </div>

//                 <Link
//                   href="/earnings"
//                   className="block w-full rounded-lg bg-slate-700 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-slate-600"
//                 >
//                   View Full Earnings Report
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Two Column Layout - Bottom Row */}
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Best Performing Space */}
//             {bestSpace && (
//               <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
//                 <div className="mb-6 flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5 text-purple-400" />
//                   <h2 className="text-lg font-semibold text-white">Best Performing Space</h2>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="flex-shrink-0">
//                     {bestSpace.images && bestSpace.images.length > 0 ? (
//                       <img
//                         src={bestSpace.images[0]}
//                         alt={bestSpace.title}
//                         className="h-20 w-20 rounded-lg border border-slate-600 object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-600 bg-slate-700">
//                         <MapPin className="h-8 w-8 text-slate-500" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">{bestSpace.title}</h3>
//                     <p className="mt-1 text-sm text-slate-400">
//                       {bestSpace.city}, {bestSpace.state}
//                     </p>
//                     <div className="mt-3 flex items-center gap-4">
//                       <div>
//                         <p className="text-xs text-slate-500">Total Revenue</p>
//                         <p className="text-lg font-bold text-purple-400">
//                           {formatCurrency(Number(bestSpace.totalRevenue))}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-500">Bookings</p>
//                         <p className="text-lg font-bold text-white">{bestSpace.bookingsCount}</p>
//                       </div>
//                       {bestSpace.averageRating && (
//                         <div>
//                           <p className="text-xs text-slate-500">Rating</p>
//                           <div className="flex items-center gap-1">
//                             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                             <p className="text-lg font-bold text-white">
//                               {bestSpace.averageRating.toFixed(1)}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <Link
//                   href={`/spaces/${bestSpace.id}/analytics`}
//                   className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
//                 >
//                   <Eye className="h-4 w-4" />
//                   View Analytics
//                 </Link>
//               </div>
//             )}

//             {/* Recent Activity */}
//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
//               <div className="mb-6 flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-slate-400" />
//                 <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
//               </div>

//               {recentActivity.length === 0 ? (
//                 <div className="py-8 text-center">
//                   <Clock className="mx-auto mb-3 h-12 w-12 text-slate-600" />
//                   <p className="text-sm text-slate-400">No recent activity</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {recentActivity.map((activity) => {
//                     const Icon = activity.icon;
//                     return (
//                       <div
//                         key={activity.id}
//                         className="flex items-start gap-3 border-b border-slate-700 pb-3 last:border-0"
//                       >
//                         <div className="flex-shrink-0 rounded-lg bg-slate-700 p-2">
//                           <Icon className="h-4 w-4 text-slate-400" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-medium text-white">{activity.title}</p>
//                           <p className="mt-1 text-xs text-slate-400">{activity.description}</p>
//                           <p className="mt-1 text-xs text-slate-500">
//                             {new Date(activity.timestamp).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               hour: "numeric",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
