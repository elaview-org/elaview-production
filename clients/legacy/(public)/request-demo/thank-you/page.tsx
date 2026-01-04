// // src/app/request-demo/thank-you/page.tsx
// "use client";

// import Link from "next/link";
// import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

// export default function ThankYouPage() {
//   return (
//     <div className="min-h-screen bg-slate-950">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden border-b border-slate-800 bg-linear-to-b from-green-900/20 to-slate-950">
//         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
//         <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
//           <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
//             <CheckCircle className="h-12 w-12 text-green-400" />
//           </div>
//           <h1 className="mb-6 text-5xl font-bold text-white">
//             We&apos;ll Be in Touch Soon!
//           </h1>
//           <p className="mx-auto max-w-2xl text-xl text-slate-400">
//             Thanks for your interest in Elaview. We&apos;ll reach out within 24
//             hours to schedule your personalized demo.
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
//         {/* What Happens Next */}
//         <div className="mb-12 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//           <h2 className="mb-6 text-2xl font-bold text-white">
//             What Happens Next?
//           </h2>
//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <div className="shrink-0">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
//                   <span className="text-lg font-bold text-blue-400">1</span>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="mb-2 text-lg font-semibold text-white">
//                   We&apos;ll Review Your Request
//                 </h3>
//                 <p className="text-slate-400">
//                   Our team will review your demo request and prepare a
//                   personalized demo tailored to your business needs.
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <div className="shrink-0">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
//                   <span className="text-lg font-bold text-blue-400">2</span>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="mb-2 text-lg font-semibold text-white">
//                   Schedule Your Demo
//                 </h3>
//                 <p className="text-slate-400">
//                   We&apos;ll reach out within 24 hours via email to schedule a
//                   convenient time for your demo.
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <div className="shrink-0">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
//                   <span className="text-lg font-bold text-blue-400">3</span>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="mb-2 text-lg font-semibold text-white">
//                   See Elaview in Action
//                 </h3>
//                 <p className="text-slate-400">
//                   Join a 30-minute live demo where we&apos;ll show you how to
//                   launch effective local advertising campaigns.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Optional: Schedule Now with Calendly */}
//         <div className="mb-12 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//           <div className="mb-6 flex items-center gap-3">
//             <Calendar className="h-6 w-6 text-blue-400" />
//             <h2 className="text-2xl font-bold text-white">
//               Prefer to Schedule Now?
//             </h2>
//           </div>
//           <p className="mb-6 text-slate-400">
//             Skip the wait and book your demo directly on our calendar. Choose a
//             time that works best for you.
//           </p>

//           {/* Calendly Embed Placeholder */}
//           <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center">
//             <Calendar className="mx-auto mb-4 h-16 w-16 text-slate-600" />
//             <p className="mb-4 text-slate-400">
//               Calendly integration coming soon!
//             </p>
//             <p className="text-sm text-slate-500">
//               For now, we&apos;ll send you a calendar link via email within 24
//               hours.
//             </p>
//             {/*
//               TODO: Replace with actual Calendly embed
//               <div
//                 className="calendly-inline-widget"
//                 data-url="https://calendly.com/your-link/30min"
//                 style={{ minWidth: "320px", height: "630px" }}
//               />
//             */}
//           </div>
//         </div>

//         {/* Explore in the Meantime */}
//         <div className="text-center">
//           <h2 className="mb-4 text-2xl font-bold text-white">
//             Explore Elaview in the Meantime
//           </h2>
//           <p className="mb-8 text-slate-400">
//             Browse available advertising spaces in your area while you wait for
//             your demo.
//           </p>
//           <div className="flex justify-center gap-4">
//             <Link
//               href="/public"
//               className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
//             >
//               Back to Home
//             </Link>
//             <Link
//               href="/browse"
//               className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-cyan-600"
//             >
//               Browse Spaces
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
