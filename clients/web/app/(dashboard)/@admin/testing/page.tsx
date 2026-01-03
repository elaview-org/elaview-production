// // src/app/(admin)/admin/testing/page.tsx
// "use client";

// import { useState } from "react";
// import { api } from "../../../../../elaview-mvp/src/trpc/react";
// import { Button } from "../../../../../elaview-mvp/src/components/ui/Button";
// import {
//   Play,
//   Trash2,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   Clock,
//   DollarSign,
//   Users,
//   Building,
//   FileText,
//   Beaker,
//   Database,
//   CreditCard,
//   Shield,
//   AlertTriangle,
//   Activity,
//   Zap,
//   Camera,
//   Calendar,
//   Settings,
//   Eye,
//   TrendingUp,
// } from "lucide-react";
// import { differenceInHours, differenceInDays } from "date-fns";

// interface TestLogEntry {
//   step: string;
//   status: "pending" | "success" | "error";
//   data?: Record<string, unknown>;
//   timestamp: Date;
// }

// interface TestSummary {
//   advertiser: { id: string; email: string };
//   spaceOwner: { id: string; email: string };
//   space: { id: string; title: string };
//   campaign: { id: string; name: string };
//   booking: {
//     id: string;
//     totalAmount: number;
//     platformFee: number;
//     stripeFee: number;
//     totalWithFees: number;
//     spaceOwnerAmount: number;
//     paymentType: string;
//   };
//   payment: { id: string; amount: number };
//   payout: { transferId: string; amount: number };
// }

// interface TestConfig {
//   pricePerDay: number;
//   installationFee: number;
//   campaignDays: number;
//   paymentType: "IMMEDIATE" | "DEPOSIT";
//   autoApprovalHours: number;
//   balanceRetryAttempts: number;
// }

// export default function TestingDashboard() {
//   const [isRunning, setIsRunning] = useState(false);
//   const [testLog, setTestLog] = useState<TestLogEntry[]>([]);
//   const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
//   const [cronResults, setCronResults] = useState<any>(null);
//   const [showConfig, setShowConfig] = useState(false);
//   const [testConfig, setTestConfig] = useState<TestConfig>({
//     pricePerDay: 50,
//     installationFee: 100,
//     campaignDays: 20,
//     paymentType: "IMMEDIATE",
//     autoApprovalHours: 48,
//     balanceRetryAttempts: 3,
//   });

//   // Date booking test state
//   const [testingDateBooking, setTestingDateBooking] = useState(false);
//   const [dateBookingTestResult, setDateBookingTestResult] = useState<{
//     success: boolean;
//     message: string;
//     details?: Record<string, any>;
//     error?: any;
//   } | null>(null);

//   const utils = api.useUtils();

//   const runE2ETest = api.testing.runFullE2EFlow.useMutation({
//     onMutate: () => {
//       setIsRunning(true);
//       setTestLog([]);
//       setTestSummary(null);
//     },
//     onSuccess: (data) => {
//       setTestLog(data.log);
//       if (data.summary) {
//         setTestSummary(data.summary);
//       }
//       setIsRunning(false);
//       void utils.testing.getTestData.invalidate();
//     },
//     onError: () => {
//       setIsRunning(false);
//     },
//   });

//   const cleanupData = api.testing.cleanupTestData.useMutation({
//     onSuccess: () => {
//       void utils.testing.getTestData.invalidate();
//       setTestLog([]);
//       setTestSummary(null);
//       setCronResults(null);
//     },
//   });

//   const { data: testData, isLoading: loadingTestData } =
//     api.testing.getTestData.useQuery();

//   // Critical tests
//   const healthCheck = api.testing.runSystemHealthCheck.useQuery();

//   const testOverlap = api.testing.testBookingOverlap.useMutation({
//     onSuccess: () => {
//       void utils.testing.getTestData.invalidate();
//     },
//   });

//   const testConcurrent = api.testing.testConcurrentBookings.useMutation({
//     onSuccess: () => {
//       void utils.testing.getTestData.invalidate();
//     },
//   });

//   const testAutoApproval = api.testing.testAutoApproval.useMutation({
//     onSuccess: () => {
//       void utils.testing.getTestData.invalidate();
//     },
//   });

//   const testBalanceRetry = api.testing.testBalanceChargeRetry.useMutation({
//     onSuccess: () => {
//       void utils.testing.getTestData.invalidate();
//     },
//   });

//   // Date booking test function
//   const testDateBooking = async () => {
//     try {
//       setTestingDateBooking(true);
//       setDateBookingTestResult(null);

//       console.log('🧪 Starting date booking test...');

//       // Step 1: Get a test space with availability
//       const response = await fetch('/api/trpc/spaces.browsePublic?input={"json":{"limit":1}}');
//       const data = await response.json();

//       if (!data.result?.data?.json?.spaces?.[0]) {
//         throw new Error("No spaces available for testing");
//       }

//       const testSpace = data.result.data.json.spaces[0];
//       console.log('✅ Found test space:', testSpace.title);

//       if (!testSpace.availableFrom) {
//         throw new Error("Test space has no availableFrom date");
//       }

//       // Step 2: Get first test campaign to use
//       const campaignResponse = await fetch('/api/trpc/campaigns.getMyCampaigns');
//       const campaignData = await campaignResponse.json();
//       const testCampaign = campaignData.result?.data?.json?.[0];

//       if (!testCampaign) {
//         throw new Error("No test campaign found - run full E2E test first");
//       }

//       // Step 3: Test first day booking
//       const firstDay = new Date(testSpace.availableFrom);
//       console.log('📅 Testing first available day:', firstDay.toISOString());

//       const bookingResponse = await fetch('/api/trpc/cart.addToCart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           json: {
//             spaceId: testSpace.id,
//             campaignId: testCampaign.id,
//             startDate: firstDay.toISOString(),
//             endDate: firstDay.toISOString(),
//           }
//         })
//       });

//       const bookingResult = await bookingResponse.json();

//       if (bookingResult.error) {
//         throw new Error(bookingResult.error.message || 'Booking failed');
//       }

//       console.log('✅ Booking successful!', bookingResult);

//       // Step 4: Cleanup - remove from cart
//       if (bookingResult.result?.data?.json?.bookingId) {
//         await fetch('/api/trpc/cart.removeFromCart', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             json: { itemId: bookingResult.result.data.json.bookingId }
//           })
//         });
//         console.log('🧹 Cleaned up test booking');
//       }

//       setDateBookingTestResult({
//         success: true,
//         message: `✅ First day booking works! Space: "${testSpace.title}"`,
//         details: {
//           spaceId: testSpace.id,
//           spaceTitle: testSpace.title,
//           availableFrom: testSpace.availableFrom,
//           bookingDate: firstDay.toISOString(),
//           campaignUsed: testCampaign.name,
//         }
//       });

//     } catch (error: any) {
//       console.error('❌ Date booking test failed:', error);
//       setDateBookingTestResult({
//         success: false,
//         message: `❌ First day booking failed: ${error.message}`,
//         error: error.toString()
//       });
//     } finally {
//       setTestingDateBooking(false);
//     }
//   };

//   // Run daily cron job
//   const runDailyCron = async () => {
//     try {
//       const response = await fetch('/api/cron/daily', {
//         headers: {
//           'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || '6A+qFFU+0Kll4FqkEYmRe1z+y/YWVVfLcSxLcYg3Ols='}`,
//         },
//       });
//       const data = await response.json();
//       setCronResults(data);
//       void utils.testing.getTestData.invalidate();
//     } catch (error) {
//       console.error('Daily cron failed:', error);
//       setCronResults({ error: 'Failed to run daily cron' });
//     }
//   };

//   // Calculate system metrics
//   const pendingAutoApprovals = testData?.bookings.filter(b =>
//     b.proofStatus === 'PENDING' &&
//     b.proofUploadedAt &&
//     differenceInHours(new Date(), new Date(b.proofUploadedAt)) > 48
//   ).length || 0;

//   const overdueBalances = testData?.bookings.filter(b =>
//     b.status === 'PENDING_BALANCE' &&
//     b.balanceDueDate &&
//     new Date(b.balanceDueDate) < new Date()
//   ).length || 0;

//   const activeDisputes = testData?.bookings.filter(b =>
//     b.status === 'DISPUTED'
//   ).length || 0;

//   const activeCampaigns = testData?.bookings.filter(b =>
//     b.status === 'ACTIVE'
//   ).length || 0;

//   return (
//     <div className="h-full w-full p-4">
//       <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
//         {/* Header - Fixed */}
//         <div className="flex-shrink-0 p-6 border-b border-slate-700">
//           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//             <Beaker className="h-8 w-8 text-cyan-400" />
//             E2E Testing Dashboard
//           </h1>
//           <p className="text-slate-400 mt-2">
//             Run end-to-end payment flow tests with real Stripe test mode integration
//           </p>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {/* System Status Monitor */}
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                 <Eye className="h-5 w-5" />
//                 Live System Monitor
//               </h2>
//               <Button
//                 onClick={() => utils.testing.getTestData.invalidate()}
//                 variant="ghost"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
//                 <div className="text-3xl font-bold text-amber-400">
//                   {pendingAutoApprovals}
//                 </div>
//                 <div className="text-sm text-slate-400">Ready for Auto-Approval</div>
//                 {pendingAutoApprovals > 0 && (
//                   <div className="text-xs text-amber-300 mt-1">Run daily cron to process</div>
//                 )}
//               </div>
//               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
//                 <div className="text-3xl font-bold text-purple-400">
//                   {overdueBalances}
//                 </div>
//                 <div className="text-sm text-slate-400">Overdue Balances</div>
//                 {overdueBalances > 0 && (
//                   <div className="text-xs text-purple-300 mt-1">Needs balance charge</div>
//                 )}
//               </div>
//               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
//                 <div className="text-3xl font-bold text-red-400">
//                   {activeDisputes}
//                 </div>
//                 <div className="text-sm text-slate-400">Active Disputes</div>
//               </div>
//               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
//                 <div className="text-3xl font-bold text-green-400">
//                   {activeCampaigns}
//                 </div>
//                 <div className="text-sm text-slate-400">Active Campaigns</div>
//               </div>
//             </div>
//           </div>

//           {/* System Health Check */}
//           <div className={`border-2 rounded-lg ${
//             healthCheck.data?.healthy
//               ? 'border-green-500 bg-green-500/5'
//               : 'border-amber-500 bg-amber-500/5'
//           }`}>
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <Shield className={`h-6 w-6 ${
//                     healthCheck.data?.healthy ? 'text-green-400' : 'text-amber-400'
//                   }`} />
//                   <div>
//                     <h2 className="text-xl font-semibold text-white">
//                       System Protection Status
//                     </h2>
//                     <p className="text-sm text-slate-400">
//                       {healthCheck.data?.healthy
//                         ? 'All systems operational'
//                         : 'Issues detected - review below'}
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={() => healthCheck.refetch()}
//                   variant={healthCheck.data?.healthy ? "outline" : "destructive"}
//                   size="sm"
//                 >
//                   <RefreshCw className={`h-4 w-4 mr-2 ${
//                     healthCheck.isRefetching ? 'animate-spin' : ''
//                   }`} />
//                   {healthCheck.isRefetching ? 'Checking...' : 'Run Health Check'}
//                 </Button>
//               </div>

//               {healthCheck.data && (
//                 <div className="space-y-4">
//                   {/* Health Checks Grid */}
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Webhook Idempotency</span>
//                       {healthCheck.data.checks.webhookIdempotency ? (
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-400" />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Stripe Connection</span>
//                       {healthCheck.data.checks.stripeConnectionValid ? (
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-400" />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Fee Calculation</span>
//                       {healthCheck.data.checks.feeCalculationAccuracy ? (
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-400" />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Pending Proofs</span>
//                       {healthCheck.data.checks.pendingProofCount === 0 ? (
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <span className="text-amber-400 text-sm font-medium">
//                             {healthCheck.data.checks.pendingProofCount}
//                           </span>
//                           <AlertTriangle className="h-5 w-5 text-amber-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Stale Balances</span>
//                       {healthCheck.data.checks.stalePendingBalanceCount === 0 ? (
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <span className="text-amber-400 text-sm font-medium">
//                             {healthCheck.data.checks.stalePendingBalanceCount}
//                           </span>
//                           <AlertTriangle className="h-5 w-5 text-amber-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-600 rounded-lg">
//                       <span className="text-sm text-slate-300">Overall Health</span>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium text-white">
//                           {healthCheck.data.summary.passing}/{healthCheck.data.summary.total}
//                         </span>
//                         {healthCheck.data.healthy ? (
//                           <Activity className="h-5 w-5 text-green-400" />
//                         ) : (
//                           <Activity className="h-5 w-5 text-amber-400" />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Recommendations */}
//                   {healthCheck.data.recommendations.length > 0 && (
//                     <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
//                       <div className="flex items-start gap-3">
//                         <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-amber-300 mb-2">
//                             Recommendations
//                           </h3>
//                           <ul className="space-y-1">
//                             {healthCheck.data.recommendations.map((rec, i) => (
//                               <li key={i} className="text-sm text-amber-200">
//                                 {rec}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Test Configuration Panel */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                 <Settings className="h-5 w-5" />
//                 Test Configuration
//               </h3>
//               <Button
//                 onClick={() => setShowConfig(!showConfig)}
//                 variant="ghost"
//                 size="sm"
//               >
//                 {showConfig ? 'Hide' : 'Show'} Config
//               </Button>
//             </div>

//             {showConfig && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="text-sm text-slate-400">Price/Day ($)</label>
//                   <input
//                     type="number"
//                     value={testConfig.pricePerDay}
//                     onChange={(e) => setTestConfig({...testConfig, pricePerDay: +e.target.value})}
//                     className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-slate-400">Installation Fee ($)</label>
//                   <input
//                     type="number"
//                     value={testConfig.installationFee}
//                     onChange={(e) => setTestConfig({...testConfig, installationFee: +e.target.value})}
//                     className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-slate-400">Campaign Days</label>
//                   <input
//                     type="number"
//                     value={testConfig.campaignDays}
//                     onChange={(e) => setTestConfig({...testConfig, campaignDays: +e.target.value})}
//                     className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-slate-400">Payment Type</label>
//                   <select
//                     value={testConfig.paymentType}
//                     onChange={(e) => setTestConfig({...testConfig, paymentType: e.target.value as "IMMEDIATE" | "DEPOSIT"})}
//                     className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white"
//                   >
//                     <option value="IMMEDIATE">Immediate</option>
//                     <option value="DEPOSIT">Deposit (50/50)</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Quick Test Scenarios */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <TrendingUp className="h-5 w-5" />
//               Quick Test Scenarios
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//               <button
//                 onClick={() => {
//                   console.log("Button clicked: High-Value Long Campaign");
//                   runE2ETest.mutate({
//                     pricePerDay: 100,
//                     installationFee: 500,
//                     campaignDays: 90,
//                     paymentType: "DEPOSIT"
//                   });
//                 }}
//                 disabled={isRunning}
//                 className={`px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ${
//                   isRunning
//                     ? 'bg-slate-900/50 text-slate-500 cursor-not-allowed border border-slate-600'
//                     : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
//                 }`}
//               >
//                 High-Value Long Campaign
//               </button>

//               <button
//                 onClick={() => {
//                   console.log("Button clicked: Budget Weekly Campaign");
//                   runE2ETest.mutate({
//                     pricePerDay: 25,
//                     installationFee: 0,
//                     campaignDays: 7,
//                     paymentType: "IMMEDIATE"
//                   });
//                 }}
//                 disabled={isRunning}
//                 className={`px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ${
//                   isRunning
//                     ? 'bg-slate-900/50 text-slate-500 cursor-not-allowed border border-slate-600'
//                     : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
//                 }`}
//               >
//                 Budget Weekly Campaign
//               </button>

//               <button
//                 onClick={() => {
//                   console.log("Button clicked: Create Expired Proof");
//                   testAutoApproval.mutate();
//                 }}
//                 disabled={testAutoApproval.isPending}
//                 className={`px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ${
//                   testAutoApproval.isPending
//                     ? 'bg-slate-900/50 text-slate-500 cursor-not-allowed border border-slate-600'
//                     : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
//                 }`}
//               >
//                 Create Expired Proof
//               </button>

//               <button
//                 onClick={() => {
//                   console.log("Button clicked: Simulate Failed Payment");
//                   testBalanceRetry.mutate();
//                 }}
//                 disabled={testBalanceRetry.isPending}
//                 className={`px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ${
//                   testBalanceRetry.isPending
//                     ? 'bg-slate-900/50 text-slate-500 cursor-not-allowed border border-slate-600'
//                     : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
//                 }`}
//               >
//                 Simulate Failed Payment
//               </button>
//             </div>
//           </div>

//           {/* Critical Protection Tests */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <AlertTriangle className="h-6 w-6 text-red-400" />
//               <div>
//                 <h2 className="text-xl font-semibold text-white">
//                   Critical Protection Tests
//                 </h2>
//                 <p className="text-sm text-slate-400">
//                   Test system vulnerabilities and edge cases
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Booking Overlap Test */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <Shield className="h-5 w-5 text-red-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Double Booking Test</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Tests if overlapping bookings for same space are prevented
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => testOverlap.mutate()}
//                   disabled={testOverlap.isPending}
//                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                     testOverlap.isPending
//                       ? 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed'
//                       : 'bg-red-600 hover:bg-red-700 text-white'
//                   }`}
//                 >
//                   {testOverlap.isPending ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       Testing...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="h-4 w-4" />
//                       Run Test
//                     </>
//                   )}
//                 </button>
//                 {testOverlap.data && (
//                   <div className={`mt-3 p-3 rounded text-sm ${
//                     testOverlap.data.critical
//                       ? 'bg-red-500/10 text-red-300 border border-red-500/30'
//                       : 'bg-green-500/10 text-green-300 border border-green-500/30'
//                   }`}>
//                     {testOverlap.data.message}
//                   </div>
//                 )}
//               </div>

//               {/* Concurrent Bookings Test */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <Zap className="h-5 w-5 text-yellow-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Race Condition Test</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Tests if simultaneous booking attempts are handled correctly
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => testConcurrent.mutate({ simultaneousAttempts: 3 })}
//                   disabled={testConcurrent.isPending}
//                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                     testConcurrent.isPending
//                       ? 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed'
//                       : 'bg-yellow-600 hover:bg-yellow-700 text-white'
//                   }`}
//                 >
//                   {testConcurrent.isPending ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       Testing...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="h-4 w-4" />
//                       Run Test (3 attempts)
//                     </>
//                   )}
//                 </button>
//                 {testConcurrent.data && (
//                   <div className={`mt-3 p-3 rounded text-sm ${
//                     testConcurrent.data.critical
//                       ? 'bg-red-500/10 text-red-300 border border-red-500/30'
//                       : 'bg-green-500/10 text-green-300 border border-green-500/30'
//                   }`}>
//                     {testConcurrent.data.message}
//                   </div>
//                 )}
//               </div>

//               {/* Auto-Approval Test */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Auto-Approval Test</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Creates proof uploaded 49h ago, should be auto-approved
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => testAutoApproval.mutate()}
//                   disabled={testAutoApproval.isPending}
//                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                     testAutoApproval.isPending
//                       ? 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
//                   }`}
//                 >
//                   {testAutoApproval.isPending ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       Testing...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="h-4 w-4" />
//                       Run Test
//                     </>
//                   )}
//                 </button>
//                 {testAutoApproval.data && (
//                   <div className={`mt-3 p-3 rounded text-sm ${
//                     testAutoApproval.data.success
//                       ? 'bg-green-500/10 text-green-300 border border-green-500/30'
//                       : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
//                   }`}>
//                     <div>{testAutoApproval.data.message}</div>
//                     {testAutoApproval.data.note && (
//                       <div className="text-xs mt-2 opacity-75">
//                         {testAutoApproval.data.note}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Balance Retry Test */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <RefreshCw className="h-5 w-5 text-purple-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Balance Retry Test</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Creates booking with failed balance charge for retry testing
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => testBalanceRetry.mutate()}
//                   disabled={testBalanceRetry.isPending}
//                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                     testBalanceRetry.isPending
//                       ? 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500'
//                   }`}
//                 >
//                   {testBalanceRetry.isPending ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       Testing...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="h-4 w-4" />
//                       Run Test
//                     </>
//                   )}
//                 </button>
//                 {testBalanceRetry.data && (
//                   <div className={`mt-3 p-3 rounded text-sm ${
//                     testBalanceRetry.data.success
//                       ? 'bg-green-500/10 text-green-300 border border-green-500/30'
//                       : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
//                   }`}>
//                     <div>{testBalanceRetry.data.message}</div>
//                     {testBalanceRetry.data.note && (
//                       <div className="text-xs mt-2 opacity-75">
//                         {testBalanceRetry.data.note}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Daily Cron Test */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <Activity className="h-5 w-5 text-indigo-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Daily Cron Job</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Runs all daily tasks: auto-approval, balance charges, reminders
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={runDailyCron}
//                   className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-indigo-500"
//                 >
//                   <Activity className="h-4 w-4" />
//                   Run Daily Cron
//                 </button>
//                 {cronResults && (
//                   <div className={`mt-3 p-3 rounded text-sm ${
//                     cronResults.error
//                       ? 'bg-red-500/10 text-red-300 border border-red-500/30'
//                       : 'bg-green-500/10 text-green-300 border border-green-500/30'
//                   }`}>
//                     {cronResults.error ? (
//                       <div>Error: {cronResults.error}</div>
//                     ) : (
//                       <div>
//                         <div>✅ Processed: {cronResults.autoApprovals} auto-approvals</div>
//                         <div>💰 {cronResults.balanceCharges} balance charges</div>
//                         <div>📧 {cronResults.twentyFourHourReminders} reminders sent</div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Placeholder for Dispute Test - Future Implementation */}
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="flex items-start gap-3 mb-3">
//                   <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white">Dispute Flow Test</h3>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Coming soon: Test dispute resolution workflow
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   disabled
//                   className="w-full px-4 py-2.5 bg-slate-900/50 text-slate-500 font-medium rounded-lg border border-slate-700 cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
//                   title="Feature coming soon - Dispute resolution testing not yet implemented"
//                   onClick={() => console.log("Dispute Flow Test: Feature not yet implemented")}
//                 >
//                   <AlertTriangle className="h-4 w-4 text-slate-500" />
//                   <span>Coming Soon</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Date Booking Validation Test - NEW */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <Calendar className="h-6 w-6 text-cyan-400" />
//               <div>
//                 <h2 className="text-xl font-semibold text-white">
//                   Date Booking Validation
//                 </h2>
//                 <p className="text-sm text-slate-400">
//                   Tests if users can book the first available day (bug fix verification)
//                 </p>
//               </div>
//             </div>

//             <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg mb-4">
//               <p className="text-sm text-slate-300 mb-2">
//                 <strong className="text-white">What this tests:</strong>
//               </p>
//               <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
//                 <li>UTC date normalization is working correctly</li>
//                 <li>First available day is inclusive and bookable</li>
//                 <li>No timezone mismatch errors occur</li>
//                 <li>Client and server date validation match</li>
//               </ul>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={testDateBooking}
//                 disabled={testingDateBooking}
//                 className={`px-6 py-3 rounded-lg font-medium transition-all ${
//                   testingDateBooking
//                     ? 'bg-slate-900/50 border border-slate-700 text-slate-500 cursor-not-allowed'
//                     : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-cyan-500/20'
//                 }`}
//               >
//                 {testingDateBooking ? (
//                   <span className="flex items-center gap-2">
//                     <RefreshCw className="h-4 w-4 animate-spin" />
//                     Testing First Day Booking...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <Play className="h-4 w-4" />
//                     Run Date Booking Test
//                   </span>
//                 )}
//               </button>

//               {dateBookingTestResult && (
//                 <div className={`flex-1 px-4 py-3 rounded-lg flex items-start gap-3 ${
//                   dateBookingTestResult.success
//                     ? 'bg-green-500/10 text-green-300 border border-green-500/20'
//                     : 'bg-red-500/10 text-red-300 border border-red-500/20'
//                 }`}>
//                   {dateBookingTestResult.success ? (
//                     <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
//                   ) : (
//                     <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
//                   )}
//                   <div className="flex-1">
//                     <p className="font-medium">{dateBookingTestResult.message}</p>
//                     {dateBookingTestResult.error && (
//                       <p className="text-xs mt-1 opacity-75">{dateBookingTestResult.error}</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Show detailed results if available */}
//             {dateBookingTestResult?.details && (
//               <div className="mt-4 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
//                 <h4 className="text-sm font-semibold text-white mb-2">Test Details:</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-slate-400">Space:</span>
//                     <span className="ml-2 text-white font-mono">{dateBookingTestResult.details.spaceTitle}</span>
//                   </div>
//                   <div>
//                     <span className="text-slate-400">Available From:</span>
//                     <span className="ml-2 text-cyan-400 font-mono">
//                       {new Date(dateBookingTestResult.details.availableFrom).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-slate-400">Booking Date:</span>
//                     <span className="ml-2 text-green-400 font-mono">
//                       {new Date(dateBookingTestResult.details.bookingDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-slate-400">Campaign:</span>
//                     <span className="ml-2 text-white font-mono">{dateBookingTestResult.details.campaignUsed}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Quick Actions */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-green-500/10 rounded-lg">
//                   <Play className="h-5 w-5 text-green-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Full E2E Flow</h3>
//                   <p className="text-xs text-slate-400">Uses config settings</p>
//                 </div>
//               </div>
//               <p className="text-sm text-slate-400 mb-4">
//                 Complete flow: User creation → Booking → Payment → Proof → Payout
//               </p>
//               <button
//                 onClick={() => runE2ETest.mutate(testConfig)}
//                 disabled={isRunning}
//                 className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                   isRunning
//                     ? 'bg-slate-900/50 border border-slate-700 text-slate-500 cursor-not-allowed'
//                     : 'bg-green-600 hover:bg-green-700 text-white'
//                 }`}
//               >
//                 {isRunning ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin" />
//                     Running...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-4 w-4" />
//                     Run Test
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-blue-500/10 rounded-lg">
//                   <DollarSign className="h-5 w-5 text-blue-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Deposit Flow</h3>
//                   <p className="text-xs text-slate-400">50% deposit + balance</p>
//                 </div>
//               </div>
//               <p className="text-sm text-slate-400 mb-4">
//                 Test deposit payment with balance charge (campaign starts in 20+ days)
//               </p>
//               <button
//                 onClick={() =>
//                   runE2ETest.mutate({
//                     ...testConfig,
//                     paymentType: "DEPOSIT",
//                   })
//                 }
//                 disabled={isRunning}
//                 className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                   isRunning
//                     ? 'bg-slate-900/50 border border-slate-700 text-slate-500 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
//                 }`}
//               >
//                 <Play className="h-4 w-4" />
//                 Run Deposit Test
//               </button>
//             </div>

//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-red-500/10 rounded-lg">
//                   <Trash2 className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Cleanup</h3>
//                   <p className="text-xs text-slate-400">Delete all test data</p>
//                 </div>
//               </div>
//               <p className="text-sm text-slate-400 mb-4">
//                 Remove all test users, bookings, campaigns, and spaces from the database
//               </p>
//               <button
//                 onClick={() => {
//                   console.log("Button clicked: Cleanup Test Data");
//                   if (
//                     confirm(
//                       "Delete all test data? This cannot be undone.\n\nThis will delete:\n• Test users\n• Test bookings\n• Test campaigns\n• Test spaces\n• Test messages"
//                     )
//                   ) {
//                     cleanupData.mutate({ confirm: true });
//                   }
//                 }}
//                 disabled={cleanupData.isPending}
//                 className={`flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
//                   cleanupData.isPending
//                     ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
//                     : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg hover:shadow-red-500/25'
//                 }`}
//               >
//                 <Trash2 className="h-5 w-5 text-white" />
//                 <span>{cleanupData.isPending ? "Cleaning..." : "Cleanup Test Data"}</span>
//               </button>
//             </div>
//           </div>

//           {/* Execution Log */}
//           {testLog.length > 0 && (
//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <FileText className="h-5 w-5 text-white" />
//                 <h2 className="text-xl font-semibold text-white">
//                   Test Execution Log
//                 </h2>
//               </div>
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {testLog.map((entry, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-start gap-3 p-4 rounded-lg ${
//                       entry.status === "success"
//                         ? "bg-green-500/5 border border-green-500/20"
//                         : entry.status === "error"
//                         ? "bg-red-500/5 border border-red-500/20"
//                         : "bg-yellow-500/5 border border-yellow-500/20"
//                     }`}
//                   >
//                     {entry.status === "success" && (
//                       <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
//                     )}
//                     {entry.status === "error" && (
//                       <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
//                     )}
//                     {entry.status === "pending" && (
//                       <Clock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0 animate-pulse" />
//                     )}

//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium text-white">{entry.step}</div>
//                       {entry.data && (
//                         <pre className="text-xs text-slate-400 mt-2 bg-slate-950 p-3 rounded overflow-auto max-h-32">
//                           {JSON.stringify(entry.data, null, 2)}
//                         </pre>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Test Summary */}
//           {testSummary && (
//             <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//               <div className="flex items-center gap-2 mb-6">
//                 <CheckCircle className="h-5 w-5 text-green-400" />
//                 <h2 className="text-xl font-semibold text-white">Test Summary</h2>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Payment Breakdown */}
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-white flex items-center gap-2">
//                     <DollarSign className="h-4 w-4 text-green-400" />
//                     Payment Breakdown
//                   </h3>
//                   <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">Subtotal:</span>
//                       <span className="text-white font-medium">
//                         ${testSummary.booking.totalAmount.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">Platform Fee (10%):</span>
//                       <span className="text-white font-medium">
//                         ${testSummary.booking.platformFee.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">Stripe Fee (2.9% + $0.30):</span>
//                       <span className="text-white font-medium">
//                         ${testSummary.booking.stripeFee.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="h-px bg-slate-700 my-2"></div>
//                     <div className="flex justify-between font-semibold">
//                       <span className="text-white">Total Charged:</span>
//                       <span className="text-green-400">
//                         ${testSummary.booking.totalWithFees.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between font-semibold">
//                       <span className="text-white">Space Owner Receives:</span>
//                       <span className="text-blue-400">
//                         ${testSummary.booking.spaceOwnerAmount.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Test Entities */}
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-white flex items-center gap-2">
//                     <Database className="h-4 w-4 text-purple-400" />
//                     Test Entities Created
//                   </h3>
//                   <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 space-y-3">
//                     <div className="flex items-start gap-3">
//                       <Users className="h-4 w-4 text-slate-400 mt-0.5" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs text-slate-500">Advertiser</div>
//                         <div className="text-sm text-slate-300 truncate">
//                           {testSummary.advertiser.email}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Users className="h-4 w-4 text-slate-400 mt-0.5" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs text-slate-500">Space Owner</div>
//                         <div className="text-sm text-slate-300 truncate">
//                           {testSummary.spaceOwner.email}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Building className="h-4 w-4 text-slate-400 mt-0.5" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs text-slate-500">Space</div>
//                         <div className="text-sm text-slate-300 truncate">
//                           {testSummary.space.title}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs text-slate-500">Campaign</div>
//                         <div className="text-sm text-slate-300 truncate">
//                           {testSummary.campaign.name}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Test Data Viewer */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <Database className="h-5 w-5 text-white" />
//                 <h2 className="text-xl font-semibold text-white">
//                   Active Test Data
//                 </h2>
//               </div>
//               <Button
//                 onClick={() => utils.testing.getTestData.invalidate()}
//                 variant="ghost"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4" />
//               </Button>
//             </div>

//             {loadingTestData ? (
//               <div className="text-center text-slate-400 py-8">
//                 <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
//                 <p>Loading test data...</p>
//               </div>
//             ) : testData ? (
//               <div className="space-y-6">
//                 {/* Summary Stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                     <div className="text-3xl font-bold text-white">
//                       {testData.summary.totalUsers}
//                     </div>
//                     <div className="text-sm text-slate-400">Test Users</div>
//                   </div>
//                   <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                     <div className="text-3xl font-bold text-white">
//                       {testData.summary.totalBookings}
//                     </div>
//                     <div className="text-sm text-slate-400">Test Bookings</div>
//                   </div>
//                   <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                     <div className="text-3xl font-bold text-white">
//                       {testData.summary.totalCampaigns}
//                     </div>
//                     <div className="text-sm text-slate-400">Test Campaigns</div>
//                   </div>
//                   <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                     <div className="text-3xl font-bold text-white">
//                       {
//                         testData.bookings.filter(
//                           (b) => b.status === "CONFIRMED" || b.status === "ACTIVE"
//                         ).length
//                       }
//                     </div>
//                     <div className="text-sm text-slate-400">Active Bookings</div>
//                   </div>
//                 </div>

//                 {/* Recent Test Bookings */}
//                 {testData.bookings.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold text-white mb-3">
//                       Recent Test Bookings
//                     </h3>
//                     <div className="space-y-2">
//                       {testData.bookings.slice(0, 5).map((booking) => (
//                         <div
//                           key={booking.id}
//                           className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-600 rounded-lg hover:bg-slate-900/70 transition-colors"
//                         >
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium text-white">
//                               {booking.space.title}
//                             </div>
//                             <div className="text-sm text-slate-400 truncate">
//                               {booking.campaign.name} •{" "}
//                               {booking.campaign.advertiser.email}
//                             </div>
//                           </div>
//                           <div className="text-right ml-4">
//                             <div className="font-medium text-white">
//                               ${Number(booking.totalWithFees || 0).toFixed(2)}
//                             </div>
//                             <div className="text-sm text-slate-400">
//                               {booking.status}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {testData.bookings.length === 0 &&
//                   testData.users.length === 0 && (
//                     <div className="text-center text-slate-400 py-12">
//                       <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                       <p>No test data found</p>
//                       <p className="text-sm mt-1">Run a test to create test data</p>
//                     </div>
//                   )}
//               </div>
//             ) : (
//               <div className="text-center text-slate-400 py-8">
//                 <XCircle className="h-8 w-8 mx-auto mb-2" />
//                 <p>Failed to load test data</p>
//               </div>
//             )}
//           </div>

//           {/* Stripe Test Cards Reference */}
//           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <CreditCard className="h-5 w-5 text-white" />
//               <h2 className="text-xl font-semibold text-white">
//                 Stripe Test Cards Reference
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="font-medium text-white mb-2 flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4 text-green-400" />
//                   Success
//                 </div>
//                 <code className="text-sm text-green-400 bg-slate-950 px-3 py-2 rounded block">
//                   4242 4242 4242 4242
//                 </code>
//               </div>
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="font-medium text-white mb-2 flex items-center gap-2">
//                   <XCircle className="h-4 w-4 text-red-400" />
//                   Decline
//                 </div>
//                 <code className="text-sm text-red-400 bg-slate-950 px-3 py-2 rounded block">
//                   4000 0000 0000 0002
//                 </code>
//               </div>
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="font-medium text-white mb-2 flex items-center gap-2">
//                   <XCircle className="h-4 w-4 text-yellow-400" />
//                   Insufficient Funds
//                 </div>
//                 <code className="text-sm text-yellow-400 bg-slate-950 px-3 py-2 rounded block">
//                   4000 0000 0000 9995
//                 </code>
//               </div>
//               <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
//                 <div className="font-medium text-white mb-2 flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-blue-400" />
//                   Auth Required
//                 </div>
//                 <code className="text-sm text-blue-400 bg-slate-950 px-3 py-2 rounded block">
//                   4000 0025 0000 3155
//                 </code>
//               </div>
//             </div>
//             <p className="text-sm text-slate-500 mt-4">
//               All test cards: Use any future expiration date and any 3-digit CVC
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
