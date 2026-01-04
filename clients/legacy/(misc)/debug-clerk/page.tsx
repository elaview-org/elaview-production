// "use client";

// import { useAuth, useUser, useClerk } from '@clerk/nextjs';
// import { useEffect, useState } from 'react';
// import { notFound } from 'next/navigation';

// export default function ClerkDebugPage() {
//   // 🔒 SECURITY: Block access in production
//   if (process.env.NODE_ENV === 'production') {
//     notFound();
//   }

//   const { isSignedIn, isLoaded, userId, sessionId } = useAuth();
//   const { user, isLoaded: userLoaded } = useUser();
//   const { session } = useClerk();
//   const [envInfo, setEnvInfo] = useState<any>(null);

//   useEffect(() => {
//     // Fetch environment info from API
//     fetch('/api/debug/clerk-info')
//       .then(res => res.json())
//       .then(data => setEnvInfo(data))
//       .catch(err => console.error('Failed to fetch env info:', err));
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-950 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-white mb-8">🔍 Clerk Debug Info</h1>
        
//         {/* Environment Info */}
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-white mb-4">Environment Configuration</h2>
//           {envInfo ? (
//             <div className="space-y-2 font-mono text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Publishable Key:</span>
//                 <span className="text-green-400">{envInfo.publishableKey}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Instance Type:</span>
//                 <span className={`font-bold ${envInfo.isLive ? 'text-green-400' : 'text-yellow-400'}`}>
//                   {envInfo.isLive ? '✅ PRODUCTION (pk_live_*)' : '⚠️ DEVELOPMENT (pk_test_*)'}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Environment:</span>
//                 <span className="text-blue-400">{envInfo.nodeEnv}</span>
//               </div>
//             </div>
//           ) : (
//             <div className="text-slate-400">Loading environment info...</div>
//           )}
//         </div>

//         {/* Auth State */}
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-white mb-4">Authentication State</h2>
//           <div className="space-y-2 font-mono text-sm">
//             <div className="flex items-center gap-2">
//               <span className="text-slate-400">Is Loaded:</span>
//               <span className={isLoaded ? 'text-green-400' : 'text-red-400'}>
//                 {String(isLoaded)}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-slate-400">Is Signed In:</span>
//               <span className={isSignedIn ? 'text-green-400' : 'text-red-400'}>
//                 {String(isSignedIn)}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-slate-400">User ID:</span>
//               <span className="text-blue-400">{userId || 'null'}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-slate-400">Session ID:</span>
//               <span className="text-blue-400">{sessionId || 'null'}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-slate-400">User Loaded:</span>
//               <span className={userLoaded ? 'text-green-400' : 'text-red-400'}>
//                 {String(userLoaded)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* User Info */}
//         {user && (
//           <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
//             <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
//             <div className="space-y-2 font-mono text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Email:</span>
//                 <span className="text-blue-400">{user.primaryEmailAddress?.emailAddress}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Full Name:</span>
//                 <span className="text-blue-400">{user.fullName || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Created At:</span>
//                 <span className="text-blue-400">{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Session Info */}
//         {session && (
//           <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
//             <h2 className="text-xl font-semibold text-white mb-4">Session Information</h2>
//             <div className="space-y-2 font-mono text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Status:</span>
//                 <span className="text-green-400">{session.status}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-slate-400">Last Active:</span>
//                 <span className="text-blue-400">{session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : 'N/A'}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Diagnosis */}
//         <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-blue-400 mb-4">🎯 Diagnosis</h2>
//           <div className="space-y-3 text-sm">
//             {envInfo && !envInfo.isLive && (
//               <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
//                 <p className="text-yellow-400 font-semibold mb-2">⚠️ Using Development Keys</p>
//                 <p className="text-yellow-200">
//                   Your production deployment is using pk_test_* (development) keys. 
//                   Update Railway environment variables to use pk_live_* keys!
//                 </p>
//               </div>
//             )}
            
//             {envInfo?.isLive && (
//               <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
//                 <p className="text-green-400 font-semibold mb-2">✅ Correct Production Keys</p>
//                 <p className="text-green-200">
//                   Using production keys (pk_live_*). This is correct!
//                 </p>
//               </div>
//             )}

//             {isSignedIn && user && (
//               <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
//                 <p className="text-green-400 font-semibold mb-2">✅ Authentication Working</p>
//                 <p className="text-green-200">
//                   You are successfully signed in and session is valid.
//                 </p>
//               </div>
//             )}

//             {!isSignedIn && isLoaded && (
//               <div className="bg-slate-800 border border-slate-700 rounded p-4">
//                 <p className="text-slate-400 font-semibold mb-2">ℹ️ Not Signed In</p>
//                 <p className="text-slate-300">
//                   No active session. Try signing in to test authentication.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-6 flex gap-4">
//           <button
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
//           >
//             Go to Home
//           </button>
          
//           {isSignedIn && (
//             <button
//               onClick={() => {
//                 // Sign out and redirect
//                 window.location.href = '/api/auth/signout';
//               }}
//               className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
//             >
//               Sign Out
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }