// import type { BugCategory, BugSeverity, BugStatus } from "@prisma/client";
// import Header from "./Header";
// import Filters from "./Filters";
// import { Suspense } from "react";
// import BugList, { BugListSkeleton } from "./BugList";
// import StatsBar, { StatsBarSkeleton } from "./StatsBar";

// type SearchParams = {
//   status?: BugStatus;
//   severity?: BugSeverity;
//   category?: BugCategory;
// };

// export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
//   return (
//     <div className="flex min-h-screen flex-col bg-slate-950">
//       <div className="flex-1 overflow-hidden">
//         <Header />
//         <Suspense fallback={<StatsBarSkeleton />}>
//           <StatsBar />
//         </Suspense>
//         <Filters />
//         <div className="overflow-y-auto px-8 py-6" style={{ height: "calc(100vh - 280px)" }}>
//           <Suspense fallback={<BugListSkeleton />}>
//             <BugList filters={await searchParams} />
//           </Suspense>
//         </div>
//       </div>
//     </div>
//   );
// }
