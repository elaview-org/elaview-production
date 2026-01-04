import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/payment-flows"
          className="group flex items-center justify-between rounded-lg border-2 border-blue-500/30 bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">💳 Payment Flow Tracking</p>
            <p className="mt-1 text-xs text-slate-400">
              Real-time payment monitoring
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-blue-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/finance"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">Financial Dashboard</p>
            <p className="mt-1 text-xs text-slate-400">
              Manage disputes & payouts
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/fraud"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">Fraud Monitoring</p>
            <p className="mt-1 text-xs text-slate-400">Detect bad actors</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/analytics"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">Analytics</p>
            <p className="mt-1 text-xs text-slate-400">Revenue & performance</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/users"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">User Management</p>
            <p className="mt-1 text-xs text-slate-400">Search & manage users</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/spaces"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">Space Management</p>
            <p className="mt-1 text-xs text-slate-400">
              Approve & manage spaces
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>

        <Link
          href="/system"
          className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900"
        >
          <div>
            <p className="font-medium text-white">System Health</p>
            <p className="mt-1 text-xs text-slate-400">
              Monitor platform status
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
        </Link>
      </div>
    </div>
  );
}
