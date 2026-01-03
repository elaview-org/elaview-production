// // src/app/sso-callback/page.tsx
// import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
// import { Loader2 } from "lucide-react";

// /**
//  * SSO Callback Page for Elaview
//  *
//  * This page handles the OAuth redirect after Google authentication.
//  *
//  * Flow:
//  * 1. User clicks "Continue with Google" on landing page
//  * 2. Google OAuth completes
//  * 3. Redirects here to /sso-callback
//  * 4. Clerk's AuthenticateWithRedirectCallback:
//  *    - Completes OAuth flow
//  *    - Creates user session (for both sign-in AND sign-up)
//  *    - Triggers Clerk webhook (creates DB user with ADVERTISER role)
//  * 5. Redirects to /campaigns (configured in layout.tsx)
//  *
//  * No manual logic needed - Clerk handles everything including:
//  * - New user account creation
//  * - Existing user sign-in
//  * - Account linking by email
//  * - Session creation and management
//  */
// export default function SSOCallback() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900/20 to-slate-900 p-4">
//       <div className="max-w-md text-center">
//         {/* Loading Animation */}
//         <div className="relative mb-8">
//           <div className="mx-auto h-20 w-20">
//             <Loader2 className="h-full w-full animate-spin text-blue-500" />
//           </div>
//           {/* Decorative gradient orbs */}
//           <div className="absolute top-0 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
//         </div>

//         {/* Loading Text */}
//         <h2 className="mb-3 text-2xl font-bold text-white">Completing authentication...</h2>
//         <p className="mb-2 text-sm text-gray-400">Setting up your Elaview account</p>
//         <p className="text-xs text-gray-500">You'll be redirected to your dashboard shortly</p>

//         {/* Progress indicator */}
//         <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
//           <div
//             className="h-full animate-pulse bg-linear-to-r from-blue-500 to-cyan-500"
//             style={{ width: "60%" }}
//           />
//         </div>
//       </div>

//       {/* 
//         This component does all the work:
//         - Handles OAuth callback from Google
//         - Creates/updates Clerk session
//         - Triggers webhook to create DB user with ADVERTISER role
//         - Redirects to /campaigns (configured in layout.tsx)
//       */}
//       <AuthenticateWithRedirectCallback />
//     </div>
//   );
// }
