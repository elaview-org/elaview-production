import LowApproval from "./lowApproval";
import HighRejection from "./highRejection";
import { Suspense } from "react";

export default function FraudMonitoring() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-white">Fraud Monitoring</h1>
          <p className="mt-1 text-slate-400">Detect and manage bad actors</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* High Rejection Advertisers */}
          <Suspense>
            <HighRejection />
          </Suspense>

          {/* Low Approval Space Owners */}
          <Suspense>
            <LowApproval />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
