// "use client";

// import { api } from "../../../../../elaview-mvp/src/trpc/react";
// import { useState } from "react";
// import { Ban, CheckCircle, Search, User } from "lucide-react";

// export default function UserManagement() {
//   const [query, setQuery] = useState("");
//   const [role, setRole] = useState<"ADVERTISER" | "SPACE_OWNER" | undefined>();

//   const { data: searchResults, isLoading } =
//     api.admin.users.searchUsers.useQuery({
//       query: query ?? undefined,
//       role,
//     });

//   const suspendUser = api.admin.users.suspendUser.useMutation({
//     onSuccess: () => {
//       alert("User suspended successfully");
//       window.location.reload();
//     },
//   });

//   const reactivateUser = api.admin.users.reactivateUser.useMutation({
//     onSuccess: () => {
//       alert("User reactivated successfully");
//       window.location.reload();
//     },
//   });

//   return (
//     <div className="h-full w-full p-4">
//       <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
//         {/* Header - Fixed */}
//         <div className="shrink-0 border-b border-slate-700 p-6">
//           <h1 className="text-3xl font-bold text-white">User Management</h1>
//           <p className="mt-1 text-slate-400">
//             Search and manage platform users
//           </p>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 space-y-6 overflow-y-auto p-6">
//           {/* Search Filters */}
//           <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
//             <div className="flex gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pr-4 pl-10 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <select
//                 value={role ?? ""}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === "") {
//                     setRole(undefined);
//                   } else {
//                     setRole(value as typeof role);
//                   }
//                 }}
//                 className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white"
//               >
//                 <option value="">All Roles</option>
//                 <option value="ADVERTISER">Advertiser</option>
//                 <option value="SPACE_OWNER">Space Owner</option>
//               </select>
//             </div>
//           </div>

//           {/* Results */}
//           {isLoading ? (
//             <div className="py-8 text-center text-white">Loading...</div>
//           ) : searchResults && searchResults.users.length > 0 ? (
//             <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
//               <table className="w-full">
//                 <thead className="border-b border-slate-700 bg-slate-800">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
//                       User
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
//                       Role
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
//                       Activity
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-800">
//                   {searchResults.users.map((user) => (
//                     <tr
//                       key={user.id}
//                       className="transition-colors hover:bg-slate-800/50"
//                     >
//                       <td className="px-4 py-3">
//                         <div>
//                           <p className="text-sm font-medium text-white">
//                             {user.name ?? "N/A"}
//                           </p>
//                           <p className="text-xs text-slate-400">{user.email}</p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                             user.role === "ADVERTISER"
//                               ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
//                               : "border border-purple-500/20 bg-purple-500/10 text-purple-400"
//                           }`}
//                         >
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                             user.status === "ACTIVE"
//                               ? "border border-green-500/20 bg-green-500/10 text-green-400"
//                               : user.status === "SUSPENDED"
//                                 ? "border border-red-500/20 bg-red-500/10 text-red-400"
//                                 : "border border-slate-500/20 bg-slate-500/10 text-slate-400"
//                           }`}
//                         >
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-slate-400">
//                         {user.role === "ADVERTISER" ? (
//                           <span>{user._count.campaigns} campaigns</span>
//                         ) : (
//                           <span>{user._count.ownedSpaces} spaces</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         {user.status === "ACTIVE" ? (
//                           <button
//                             onClick={() => {
//                               const reason = prompt(
//                                 "Suspension reason (min 10 chars):"
//                               );
//                               if (reason && reason.length >= 10) {
//                                 suspendUser.mutate({
//                                   userId: user.id,
//                                   reason,
//                                 });
//                               }
//                             }}
//                             className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
//                           >
//                             <Ban className="h-3.5 w-3.5" />
//                             Suspend
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               if (confirm("Reactivate this user?")) {
//                                 reactivateUser.mutate({ userId: user.id });
//                               }
//                             }}
//                             className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
//                           >
//                             <CheckCircle className="h-3.5 w-3.5" />
//                             Reactivate
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center">
//               <User className="mx-auto mb-3 h-12 w-12 text-slate-600" />
//               <p className="text-slate-400">No users found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
