import { UserCircle } from "lucide-react";

export default function AudiencesPage() {
  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-white">Audience Segments</h2>
          <p className="mt-2 text-slate-400">
            Create and manage user segments for targeted campaigns
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
              <UserCircle className="h-8 w-8 text-purple-400" />
            </div>
            <p className="mt-4 text-lg font-medium text-white">Coming Soon</p>
            <p className="mt-2 text-slate-400">
              Audience segmentation features are currently in development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
