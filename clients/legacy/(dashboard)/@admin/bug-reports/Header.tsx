import { AlertCircle } from "lucide-react";
import RefreshButton from "./RefreshButton";

export default function Header() {
  return (
    <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">User Bug Reports</h1>
          </div>
          <p className="mt-1 text-slate-400">Review and manage bug reports submitted by users</p>
        </div>
        <RefreshButton />
      </div>
    </div>
  );
}
