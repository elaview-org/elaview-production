// "use client";

// import React, {useState} from "react";
// import {useRouter} from "next/navigation";
// import {AlertCircle, Loader2, Lock, Mail} from "lucide-react";
// import Link from "next/link";

// export default function SignInPage() {
//     const {isLoaded, signIn, setActive} = useSignIn();
//     const router = useRouter();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleEmailSignIn = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!isLoaded) return;

//         setIsLoading(true);
//         setError("");

//         try {
//             const result = await signIn.create({
//                 identifier: email,
//                 password,
//             });

//             if (result.status === "complete") {
//                 await setActive({session: result.createdSessionId});

//                 // Redirect to /browse - middleware will redirect MARKETING/ADMIN users to correct page
//                 router.push("/overview");
//             }
//         } catch (err: unknown) {
//             console.error("Sign in error:", err);
//             setError(
//                 (err as { errors: { message: string }[] }).errors[0]?.message ?? "Invalid email or password"
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         if (!isLoaded) return;

//         setIsLoading(true);
//         setError("");

//         try {
//             await signIn.authenticateWithRedirect({
//                 strategy: "oauth_google",
//                 redirectUrl: `${window.location.origin}/sso-callback`,
//                 redirectUrlComplete: `${window.location.origin}/overview`,
//             });
//         } catch (err: unknown) {
//             console.error("Google sign in error:", err);
//             setError(
//                 (err as { errors: { message: string }[] }).errors[0]?.message ??
//                 "Failed to sign in with Google"
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
//             <div className="w-full max-w-md">
//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <h2 className="mb-2 text-3xl font-bold text-white">Welcome Back</h2>
//                     <p className="text-gray-400">Sign in to continue to Elaview</p>
//                 </div>

//                 {/* Card */}
//                 <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//                     <form onSubmit={handleEmailSignIn} className="space-y-6">
//                         {/* Error Alert */}
//                         {error && (
//                             <div
//                                 className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
//                                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400"/>
//                                 <p className="text-sm text-red-400">{error}</p>
//                             </div>
//                         )}

//                         {/* Google Sign In */}
//                         <button
//                             type="button"
//                             onClick={handleGoogleSignIn}
//                             disabled={isLoading}
//                             className="flex w-full items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-900 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             <svg className="h-5 w-5" viewBox="0 0 24 24">
//                                 <path
//                                     fill="#4285F4"
//                                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                 />
//                                 <path
//                                     fill="#34A853"
//                                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                 />
//                                 <path
//                                     fill="#FBBC05"
//                                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                 />
//                                 <path
//                                     fill="#EA4335"
//                                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                 />
//                             </svg>
//                             <span>Continue with Google</span>
//                         </button>

//                         {/* Divider */}
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-white/10"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="bg-slate-900 px-4 text-gray-400">or</span>
//                             </div>
//                         </div>

//                         {/* Email Input */}
//                         <div>
//                             <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
//                                 Email address
//                             </label>
//                             <div className="relative">
//                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                     <Mail className="h-5 w-5 text-gray-500"/>
//                                 </div>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-3 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                     placeholder="Enter your email"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password Input */}
//                         <div>
//                             <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                     <Lock className="h-5 w-5 text-gray-500"/>
//                                 </div>
//                                 <input
//                                     id="password"
//                                     type="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-3 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                     placeholder="Enter your password"
//                                 />
//                             </div>
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="flex w-full items-center justify-center space-x-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader2 className="h-5 w-5 animate-spin"/>
//                                     <span>Signing in...</span>
//                                 </>
//                             ) : (
//                                 <span>Sign In</span>
//                             )}
//                         </button>

//                         {/* Sign Up Link */}
//                         <div className="text-center text-sm text-gray-400">
//                             {"Don't have an account? "}
//                             <Link
//                                 href="/sign-up"
//                                 className="font-medium text-blue-400 transition-colors hover:text-blue-300"
//                             >
//                                 Sign up
//                             </Link>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }
