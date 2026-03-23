"use client";

import { useActionState } from "react";
import { submitDemoRequest } from "./request-demo.actions";

const initialState = {
  success: false,
  message: "",
  data: null,
};

const INPUT_CLASSES =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export default function DemoRequestForm() {
  const [state, action, isPending] = useActionState(
    submitDemoRequest,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 py-12 text-center dark:border-green-900 dark:bg-green-950/30">
        <p className="font-semibold text-green-800 dark:text-green-400">
          Request received!
        </p>
        <p className="text-sm text-green-700 dark:text-green-500">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            defaultValue={state.data?.name ?? ""}
            disabled={isPending}
            className={INPUT_CLASSES}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Acme Corp"
            defaultValue={state.data?.company ?? ""}
            disabled={isPending}
            className={INPUT_CLASSES}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            defaultValue={state.data?.email ?? ""}
            disabled={isPending}
            className={INPUT_CLASSES}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="phone">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            defaultValue={state.data?.phone ?? ""}
            disabled={isPending}
            className={INPUT_CLASSES}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="role">
          I am primarily a...
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue={state.data?.role ?? ""}
          disabled={isPending}
          className={INPUT_CLASSES}
        >
          <option value="">Select one</option>
          <option value="advertiser">Advertiser / brand</option>
          <option value="space_owner">Space owner / property manager</option>
          <option value="agency">Agency / consultant</option>
          <option value="both">Both advertiser and space owner</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="message">
          Anything you&apos;d like us to know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your use case, goals, or questions..."
          defaultValue={state.data?.message ?? ""}
          disabled={isPending}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Request demo"}
        </button>
      </div>
    </form>
  );
}
