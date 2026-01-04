// // src/app/(advertiser)/billing/page.tsx
// "use client";

// import React, { useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import {
//   CreditCard,
//   DollarSign,
//   TrendingUp,
//   Receipt,
//   AlertCircle,
//   Loader2,
//   Plus,
//   Trash2,
//   CheckCircle,
//   Clock,
//   X,
// } from "lucide-react";
// import { api } from "../../../../../elaview-mvp/src/trpc/react";
// import { toast } from "sonner";
// import { AddPaymentMethodForm } from "../../../../../elaview-mvp/src/components/billing/AddPaymentMethodForm";

// // Initialize Stripe
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// interface PaymentMethod {
//   id: string;
//   type: "card";
//   last4: string;
//   brand: string;
//   expiryMonth: number;
//   expiryYear: number;
//   isDefault: boolean;
//   stripePaymentMethodId: string;
// }

// interface Transaction {
//   id: string;
//   amount: number;
//   date: string;
//   description: string;
//   spaceOwner: string;
//   status: string;
// }

// export default function BillingPage() {
//   const { user, isLoaded } = useUser();
//   const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
//   const [filterPeriod, setFilterPeriod] = useState<string>("all");
//   const [processingAction, setProcessingAction] = useState<string | null>(null);

//   // tRPC QUERIES
//   const {
//     data: summaryData,
//     isLoading: summaryLoading,
//     error: summaryError,
//   } = api.billing.getBillingSummary.useQuery(undefined, {
//     enabled: isLoaded,
//   });

//   const {
//     data: paymentMethodsData,
//     isLoading: paymentMethodsLoading,
//     refetch: refetchPaymentMethods,
//   } = api.billing.getPaymentMethods.useQuery(undefined, {
//     enabled: isLoaded,
//   });

//   // tRPC MUTATIONS
//   const removePaymentMethodMutation =
//     api.billing.removePaymentMethod.useMutation({
//       onSuccess: () => {
//         toast.success("Payment method removed successfully");
//         refetchPaymentMethods();
//       },
//       onError: (error) => {
//         toast.error(error.message || "Failed to remove payment method");
//       },
//     });

//   const setDefaultPaymentMethodMutation =
//     api.billing.setDefaultPaymentMethod.useMutation({
//       onSuccess: () => {
//         toast.success("Default payment method updated");
//         refetchPaymentMethods();
//       },
//       onError: (error) => {
//         toast.error(error.message || "Failed to set default payment method");
//       },
//     });

//   // HANDLERS
//   const removePaymentMethod = async (methodId: string) => {
//     if (!confirm("Are you sure you want to remove this payment method?")) {
//       return;
//     }

//     setProcessingAction(methodId);
//     try {
//       await removePaymentMethodMutation.mutateAsync({
//         paymentMethodId: methodId,
//       });
//     } finally {
//       setProcessingAction(null);
//     }
//   };

//   const setDefaultPaymentMethod = async (methodId: string) => {
//     setProcessingAction(methodId);
//     try {
//       await setDefaultPaymentMethodMutation.mutateAsync({
//         paymentMethodId: methodId,
//       });
//     } finally {
//       setProcessingAction(null);
//     }
//   };

//   // DERIVED STATE
//   const paymentMethods = paymentMethodsData?.paymentMethods ?? [];
//   const billingSummary = summaryData?.summary;
//   const transactions = summaryData?.recentTransactions ?? [];

//   const isLoading = !isLoaded || summaryLoading || paymentMethodsLoading;
//   const error = summaryError;

//   // LOADING STATE
//   if (!isLoaded) {
//     return (
//       <div className="h-full w-full p-4">
//         <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//           <div className="flex flex-col items-center gap-3">
//             <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
//             <p className="text-sm text-slate-400">
//               Loading billing information...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ERROR STATE
//   if (error) {
//     return (
//       <div className="h-full w-full p-4">
//         <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//           <div className="mx-auto max-w-md p-8 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
//               <AlertCircle className="h-7 w-7 text-red-400" />
//             </div>
//             <h2 className="mb-2 text-xl font-bold text-white">
//               Error Loading Billing Data
//             </h2>
//             <p className="mb-6 text-slate-400">{error.message}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // MAIN RENDER
//   return (
//     <div className="h-full w-full p-4">
//       <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//         {/* Header - Fixed */}
//         <div className="shrink-0 border-b border-slate-800 p-6">
//           <h1 className="text-3xl font-bold text-white">Billing & Payments</h1>
//           <p className="mt-2 text-slate-400">
//             Manage your payment methods and view transaction history
//           </p>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 space-y-6 overflow-y-auto p-6">
//           {/* Billing Summary */}
//           {isLoading ? (
//             <BillingSummarySkeleton />
//           ) : billingSummary ? (
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//               <SummaryCard
//                 icon={DollarSign}
//                 iconColor="blue"
//                 label="Total Spent"
//                 value={`$${billingSummary.totalSpent.toLocaleString()}`}
//               />
//               <SummaryCard
//                 icon={TrendingUp}
//                 iconColor="green"
//                 label="This Month"
//                 value={`$${billingSummary.thisMonth.toLocaleString()}`}
//               />
//               <SummaryCard
//                 icon={Clock}
//                 iconColor="yellow"
//                 label="Pending"
//                 value={`$${billingSummary.pendingAmount.toLocaleString()}`}
//               />
//               <SummaryCard
//                 icon={Receipt}
//                 iconColor="purple"
//                 label="Credits"
//                 value={`$${billingSummary.availableCredits.toLocaleString()}`}
//               />
//             </div>
//           ) : null}

//           {/* Payment Methods */}
//           <div className="rounded-lg border border-slate-700 bg-slate-800">
//             <div className="border-b border-slate-700 p-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white">
//                   Payment Methods
//                 </h2>
//                 <button
//                   onClick={() => setShowAddPaymentMethod(true)}
//                   className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Payment Method
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {paymentMethodsLoading ? (
//                 <PaymentMethodsSkeleton />
//               ) : paymentMethods.length === 0 ? (
//                 <EmptyPaymentMethods
//                   onAdd={() => setShowAddPaymentMethod(true)}
//                 />
//               ) : (
//                 <div className="space-y-3">
//                   {paymentMethods.map((method) => (
//                     <PaymentMethodCard
//                       key={method.id}
//                       method={method}
//                       onRemove={removePaymentMethod}
//                       onSetDefault={setDefaultPaymentMethod}
//                       isProcessing={processingAction === method.id}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Transaction History */}
//           <div className="rounded-lg border border-slate-700 bg-slate-800">
//             <div className="border-b border-slate-700 p-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white">
//                   Transaction History
//                 </h2>
//                 <select
//                   value={filterPeriod}
//                   onChange={(e) => setFilterPeriod(e.target.value)}
//                   className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="all">All Time</option>
//                   <option value="month">This Month</option>
//                   <option value="quarter">This Quarter</option>
//                   <option value="year">This Year</option>
//                 </select>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               {isLoading ? (
//                 <TransactionsSkeleton />
//               ) : transactions.length === 0 ? (
//                 <EmptyTransactions />
//               ) : (
//                 <TransactionsTable transactions={transactions} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Payment Method Modal with Stripe Elements */}
//       {showAddPaymentMethod && (
//         <Elements stripe={stripePromise}>
//           <AddPaymentMethodModal
//             onClose={() => setShowAddPaymentMethod(false)}
//             onSuccess={() => {
//               setShowAddPaymentMethod(false);
//               refetchPaymentMethods();
//             }}
//           />
//         </Elements>
//       )}
//     </div>
//   );
// }

// // CARD COMPONENTS
// function SummaryCard({ icon: Icon, iconColor, label, value }: any) {
//   const colorClasses = {
//     blue: "bg-blue-600",
//     green: "bg-green-600",
//     yellow: "bg-yellow-600",
//     purple: "bg-purple-600",
//   };

//   return (
//     <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600">
//       <div className="flex items-center">
//         <div
//           className={`rounded-lg p-3 ${colorClasses[iconColor as keyof typeof colorClasses]}`}
//         >
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//         <div className="ml-4">
//           <p className="text-sm font-medium text-slate-400">{label}</p>
//           <p className="mt-1 text-2xl font-bold text-white">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PaymentMethodCard({
//   method,
//   onRemove,
//   onSetDefault,
//   isProcessing,
// }: any) {
//   return (
//     <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition-all hover:bg-slate-900">
//       <div className="flex items-center space-x-3">
//         <div className="rounded-lg bg-slate-700 p-2">
//           <CreditCard className="h-5 w-5 text-slate-300" />
//         </div>
//         <div>
//           <div className="flex items-center space-x-2">
//             <p className="font-medium text-white">
//               {method.brand.toUpperCase()} •••• {method.last4}
//             </p>
//             {method.isDefault && (
//               <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
//                 <CheckCircle className="mr-1 h-3 w-3" />
//                 Default
//               </span>
//             )}
//           </div>
//           <p className="mt-0.5 text-sm text-slate-400">
//             Expires {method.expiryMonth.toString().padStart(2, "0")}/
//             {method.expiryYear}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center space-x-2">
//         {!method.isDefault && (
//           <button
//             onClick={() => onSetDefault(method.id)}
//             disabled={isProcessing}
//             className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300 disabled:opacity-50"
//           >
//             {isProcessing ? "Setting..." : "Set as Default"}
//           </button>
//         )}
//         <button
//           onClick={() => onRemove(method.id)}
//           disabled={isProcessing}
//           className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-400 disabled:opacity-50"
//         >
//           {isProcessing ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Trash2 className="h-4 w-4" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
//   return (
//     <table className="min-w-full divide-y divide-slate-700">
//       <thead className="bg-slate-900/50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">
//             Date
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">
//             Description
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">
//             Space Owner
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">
//             Amount
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">
//             Status
//           </th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-slate-700">
//         {transactions.map((transaction) => (
//           <tr
//             key={transaction.id}
//             className="transition-colors hover:bg-slate-900/30"
//           >
//             <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
//               {new Date(transaction.date).toLocaleDateString()}
//             </td>
//             <td className="px-6 py-4 text-sm text-slate-300">
//               {transaction.description}
//             </td>
//             <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-400">
//               {transaction.spaceOwner}
//             </td>
//             <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-white">
//               ${transaction.amount.toFixed(2)}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//               <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
//                 <CheckCircle className="mr-1 h-3 w-3" />
//                 {transaction.status}
//               </span>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// // EMPTY STATES AND SKELETONS
// function EmptyPaymentMethods({ onAdd }: { onAdd: () => void }) {
//   return (
//     <div className="py-12 text-center">
//       <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">
//         <CreditCard className="h-7 w-7 text-slate-400" />
//       </div>
//       <h3 className="mb-2 text-lg font-semibold text-white">
//         No payment methods
//       </h3>
//       <p className="mb-6 text-slate-400">
//         Add a payment method to make purchases
//       </p>
//       <button
//         onClick={onAdd}
//         className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
//       >
//         <Plus className="mr-2 h-4 w-4" />
//         Add Payment Method
//       </button>
//     </div>
//   );
// }

// function EmptyTransactions() {
//   return (
//     <div className="py-12 text-center">
//       <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">
//         <Receipt className="h-7 w-7 text-slate-400" />
//       </div>
//       <h3 className="mb-2 text-lg font-semibold text-white">No transactions</h3>
//       <p className="text-slate-400">
//         Your transaction history will appear here
//       </p>
//     </div>
//   );
// }

// function BillingSummarySkeleton() {
//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className="rounded-lg border border-slate-700 bg-slate-800 p-6"
//         >
//           <div className="flex items-center">
//             <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-700" />
//             <div className="ml-4 flex-1">
//               <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-700" />
//               <div className="h-7 w-24 animate-pulse rounded bg-slate-700" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function PaymentMethodsSkeleton() {
//   return (
//     <div className="space-y-3">
//       {[...Array(2)].map((_, i) => (
//         <div
//           key={i}
//           className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4"
//         >
//           <div className="flex items-center space-x-3">
//             <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-700" />
//             <div>
//               <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-700" />
//               <div className="h-3 w-24 animate-pulse rounded bg-slate-700" />
//             </div>
//           </div>
//           <div className="h-8 w-20 animate-pulse rounded bg-slate-700" />
//         </div>
//       ))}
//     </div>
//   );
// }

// function TransactionsSkeleton() {
//   return (
//     <div className="space-y-4 p-6">
//       {[...Array(5)].map((_, i) => (
//         <div
//           key={i}
//           className="flex items-center justify-between border-b border-slate-700 py-3 last:border-0"
//         >
//           <div className="flex-1 space-y-2">
//             <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
//             <div className="h-3 w-48 animate-pulse rounded bg-slate-700" />
//           </div>
//           <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
//         </div>
//       ))}
//     </div>
//   );
// }

// // MODAL COMPONENT
// function AddPaymentMethodModal({
//   onClose,
//   onSuccess,
// }: {
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
//       <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
//         <div className="p-6">
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-white">
//               Add Payment Method
//             </h2>
//             <button
//               onClick={onClose}
//               className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           <AddPaymentMethodForm onSuccess={onSuccess} onCancel={onClose} />
//         </div>
//       </div>
//     </div>
//   );
// }
