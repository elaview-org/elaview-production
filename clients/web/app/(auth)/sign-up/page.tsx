// "use client";

// import React, {useState} from "react";
// import {useRouter} from "next/navigation";
// import {AlertCircle, Loader2, Lock, Mail, User} from "lucide-react";
// import Link from "next/link";

// export default function SignUpPage() {
//     const {isLoaded, signUp, setActive} = useSignUp();
//     const router = useRouter();

//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Verification state
//     const [pendingVerification, setPendingVerification] = useState(false);
//     const [code, setCode] = useState("");

//     const handleEmailSignUp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!isLoaded) return;

//         setIsLoading(true);
//         setError("");

//         try {
//             await signUp.create({
//                 firstName,
//                 lastName,
//                 emailAddress: email,
//                 password,
//             });

//             await signUp.prepareEmailAddressVerification({strategy: "email_code"});
//             setPendingVerification(true);
//         } catch (err: unknown) {
//             console.error("Sign up error:", err);
//             setError(
//                 (err as { errors: { message: string }[] }).errors[0]?.message ?? "Failed to create account"
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleVerification = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!isLoaded) return;

//         setIsLoading(true);
//         setError("");

//         try {
//             const completeSignUp = await signUp.attemptEmailAddressVerification({
//                 code,
//             });

//             if (completeSignUp.status === "complete") {
//                 await setActive({session: completeSignUp.createdSessionId});
//                 router.push("/overview");
//             }
//         } catch (err: unknown) {
//             console.error("Verification error:", err);
//             setError(
//                 (err as { errors: { message: string }[] }).errors[0]?.message ?? "Invalid verification code"
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleSignUp = async () => {
//         if (!isLoaded) return;

//         setIsLoading(true);
//         setError("");

//         try {
//             await signUp.authenticateWithRedirect({
//                 strategy: "oauth_google",
//                 redirectUrl: `${window.location.origin}/sso-callback`,
//                 redirectUrlComplete: `${window.location.origin}/browse`,
//             });
//         } catch (err: unknown) {
//             console.error("Google sign up error:", err);
//             setError(
//                 (err as { errors: { message: string }[] }).errors[0]?.message ??
//                 "Failed to sign up with Google"
//             );
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
//             <div className="w-full max-w-md">
//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <h2 className="mb-2 text-3xl font-bold text-white">
//                         {pendingVerification ? "Verify Your Email" : "Create Your Account"}
//                     </h2>
//                     <p className="text-gray-400">
//                         {pendingVerification
//                             ? `We sent a code to ${email}`
//                             : "Join Elaview to start advertising"}
//                     </p>
//                 </div>

//                 {/* Card */}
//                 <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//                     {!pendingVerification ? (
//                         <form onSubmit={handleEmailSignUp} className="space-y-6">
//                             {/* Error Alert */}
//                             {error && (
//                                 <div
//                                     className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
//                                     <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400"/>
//                                     <p className="text-sm text-red-400">{error}</p>
//                                 </div>
//                             )}

//                             {/* Google Sign Up */}
//                             <button
//                                 type="button"
//                                 onClick={handleGoogleSignUp}
//                                 disabled={isLoading}
//                                 className="flex w-full items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-900 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 <svg className="h-5 w-5" viewBox="0 0 24 24">
//                                     <path
//                                         fill="#4285F4"
//                                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                     />
//                                     <path
//                                         fill="#34A853"
//                                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                     />
//                                     <path
//                                         fill="#FBBC05"
//                                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                     />
//                                     <path
//                                         fill="#EA4335"
//                                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                     />
//                                 </svg>
//                                 <span>Continue with Google</span>
//                             </button>

//                             {/* Divider */}
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-white/10"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="bg-slate-900 px-4 text-gray-400">or</span>
//                                 </div>
//                             </div>

//                             {/* Name Inputs */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label
//                                         htmlFor="firstName"
//                                         className="mb-2 block text-sm font-medium text-gray-300"
//                                     >
//                                         First name
//                                     </label>
//                                     <div className="relative">
//                                         <div
//                                             className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                             <User className="h-5 w-5 text-gray-500"/>
//                                         </div>
//                                         <input
//                                             id="firstName"
//                                             type="text"
//                                             value={firstName}
//                                             onChange={(e) => setFirstName(e.target.value)}
//                                             required
//                                             className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-3 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                             placeholder="John"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label
//                                         htmlFor="lastName"
//                                         className="mb-2 block text-sm font-medium text-gray-300"
//                                     >
//                                         Last name
//                                     </label>
//                                     <input
//                                         id="lastName"
//                                         type="text"
//                                         value={lastName}
//                                         onChange={(e) => setLastName(e.target.value)}
//                                         required
//                                         className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                         placeholder="Doe"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Email Input */}
//                             <div>
//                                 <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
//                                     Email address
//                                 </label>
//                                 <div className="relative">
//                                     <div
//                                         className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                         <Mail className="h-5 text-gray-500"/>
//                                     </div>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         required
//                                         className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-3 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                         placeholder="john@example.com"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Password Input */}
//                             <div>
//                                 <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <div
//                                         className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                         <Lock className="h-5 w-5 text-gray-500"/>
//                                     </div>
//                                     <input
//                                         id="password"
//                                         type="password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         required
//                                         minLength={8}
//                                         className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-3 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                         placeholder="Min. 8 characters"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="flex w-full items-center justify-center space-x-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="h-5 w-5 animate-spin"/>
//                                         <span>Creating account...</span>
//                                     </>
//                                 ) : (
//                                     <span>Create Account</span>
//                                 )}
//                             </button>

//                             {/* Sign In Link */}
//                             <div className="text-center text-sm text-gray-400">
//                                 Already have an account?{" "}
//                                 <Link
//                                     href="/public"
//                                     className="font-medium text-blue-400 transition-colors hover:text-blue-300"
//                                 >
//                                     Sign in
//                                 </Link>
//                             </div>
//                         </form>
//                     ) : (
//                         <form onSubmit={handleVerification} className="space-y-6">
//                             {/* Error Alert */}
//                             {error && (
//                                 <div
//                                     className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
//                                     <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400"/>
//                                     <p className="text-sm text-red-400">{error}</p>
//                                 </div>
//                             )}

//                             {/* Verification Code Input */}
//                             <div>
//                                 <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-300">
//                                     Verification Code
//                                 </label>
//                                 <input
//                                     id="code"
//                                     type="text"
//                                     value={code}
//                                     onChange={(e) => setCode(e.target.value)}
//                                     required
//                                     maxLength={6}
//                                     className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-2xl tracking-widest text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                     placeholder="000000"
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="flex w-full items-center justify-center space-x-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="h-5 w-5 animate-spin"/>
//                                         <span>Verifying...</span>
//                                     </>
//                                 ) : (
//                                     <span>Verify Email</span>
//                                 )}
//                             </button>

//                             {/* Resend Link */}
//                             <div className="text-center text-sm text-gray-400">
//                                 {"Didn't receive a code? "}
//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         signUp?.prepareEmailAddressVerification({strategy: "email_code"})
//                                     }
//                                     className="font-medium text-blue-400 transition-colors hover:text-blue-300"
//                                 >
//                                     Resend
//                                 </button>
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
