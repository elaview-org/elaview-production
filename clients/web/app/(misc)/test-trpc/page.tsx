// // src/app/test-trpc/page.tsx
// "use client";

// import { api } from "../../../../elaview-mvp/src/trpc/react";
// import { useState } from "react";
// import { notFound } from "next/navigation";

// export default function TestTRPCPage() {
//   // 🔒 SECURITY: Block access in production
//   if (process.env.NODE_ENV === 'production') {
//     notFound();
//   }

//   const [testResults, setTestResults] = useState<string[]>([]);

//   // Test queries
//   const { data: userData, isLoading: userLoading, error: userError } = api.user.getCurrentUser.useQuery();
//   const { data: spacesData, isLoading: spacesLoading } = api.spaces.getDashboardStats.useQuery();

//   // Test mutations
//   const switchRoleMutation = api.user.switchRole.useMutation({
//     onSuccess: (data) => {
//       setTestResults(prev => [...prev, `✅ Role switched to: ${data.role}`]);
//     },
//     onError: (error) => {
//       setTestResults(prev => [...prev, `❌ Role switch failed: ${error.message}`]);
//     }
//   });

//   const addToCartMutation = api.cart.addToCart.useMutation({
//     onSuccess: (data) => {
//       setTestResults(prev => [...prev, `✅ Added to cart: ${data.booking?.id}`]);
//     },
//     onError: (error) => {
//       setTestResults(prev => [...prev, `❌ Add to cart failed: ${error.message}`]);
//     }
//   });

//   const testRoleSwitch = () => {
//     const newRole = userData?.role === 'ADVERTISER' ? 'SPACE_OWNER' : 'ADVERTISER';
//     switchRoleMutation.mutate({ role: newRole });
//   };

//   const testAddToCart = () => {
//     // This will fail since we don't have test data, but it tests the API structure
//     addToCartMutation.mutate({
//       campaignId: "test-campaign-id",
//       spaceId: "test-space-id",
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       advertiserNotes: "Test booking from tRPC test page"
//     });
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">tRPC API Test Page</h1>
      
//       {/* User Data Test */}
//       <div className="mb-8 p-6 border rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">1. User Query Test</h2>
//         {userLoading && <p>Loading user data...</p>}
//         {userError && <p className="text-red-600">Error: {userError.message}</p>}
//         {userData && (
//           <div className="space-y-2">
//             <p>✅ User loaded successfully</p>
//             <p><strong>Role:</strong> {userData.role}</p>
//             <p><strong>Email:</strong> {userData.email}</p>
//             <p><strong>Name:</strong> {userData.name || 'Not set'}</p>
//           </div>
//         )}
//       </div>

//       {/* Dashboard Stats Test */}
//       <div className="mb-8 p-6 border rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">2. Dashboard Stats Test</h2>
//         {spacesLoading && <p>Loading dashboard stats...</p>}
//         {spacesData && (
//           <div className="space-y-2">
//             <p>✅ Dashboard stats loaded successfully</p>
//             <p><strong>Active Spaces:</strong> {spacesData.activeSpaces}</p>
//             <p><strong>Total Spaces:</strong> {spacesData.totalSpaces}</p>
//             <p><strong>Monthly Earnings:</strong> ${spacesData.thisMonthEarnings}</p>
//           </div>
//         )}
//       </div>

//       {/* Mutation Tests */}
//       <div className="mb-8 p-6 border rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">3. Mutation Tests</h2>
//         <div className="space-x-4 mb-4">
//           <button
//             onClick={testRoleSwitch}
//             disabled={switchRoleMutation.isPending}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             {switchRoleMutation.isPending ? 'Switching...' : 'Test Role Switch'}
//           </button>
          
//           <button
//             onClick={testAddToCart}
//             disabled={addToCartMutation.isPending}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//           >
//             {addToCartMutation.isPending ? 'Adding...' : 'Test Add to Cart (will fail)'}
//           </button>
//         </div>
//       </div>

//       {/* Test Results */}
//       <div className="p-6 border rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">4. Test Results</h2>
//         {testResults.length === 0 ? (
//           <p>No test results yet. Click the buttons above to test mutations.</p>
//         ) : (
//           <div className="space-y-1">
//             {testResults.map((result, index) => (
//               <p key={index} className="font-mono text-sm">{result}</p>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Connection Status */}
//       <div className="mt-8 p-4 bg-gray-100 rounded-lg">
//         <h3 className="font-semibold mb-2">Connection Status:</h3>
//         <p>✅ tRPC Client Connected</p>
//         <p>✅ User Authentication: {userData ? 'Working' : 'Check Clerk setup'}</p>
//         <p>✅ Database Connection: {userData ? 'Working' : 'Check Prisma setup'}</p>
//       </div>
//     </div>
//   );
// }