import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCampaignPage() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <Link
            href="/campaigns"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
          <h2 className="text-3xl font-bold text-white">Create New Campaign</h2>
          <p className="mt-2 text-slate-400">
            Send targeted emails or SMS messages to your users
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-sm">
              <form className="space-y-6">
                {/* Campaign Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Summer Promotion 2025"
                    className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                {/* Campaign Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Campaign Type
                  </label>
                  <select
                    id="type"
                    className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Both</option>
                  </select>
                </div>

                {/* Audience */}
                <div>
                  <label
                    htmlFor="audience"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Target Audience
                  </label>
                  <select
                    id="audience"
                    className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option>All Users</option>
                    <option>Advertisers Only</option>
                    <option>Space Owners Only</option>
                    <option>Custom Segment</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Subject Line
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Your subject line here"
                    className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={8}
                    placeholder="Your message here..."
                    className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    You can use {"{firstName}"}, {"{lastName}"}, and {"{email}"}{" "}
                    as placeholders
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
                  >
                    Send Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
