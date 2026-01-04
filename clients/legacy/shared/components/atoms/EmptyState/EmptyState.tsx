import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <div className="py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
          <Icon className="h-8 w-8 text-purple-400" />
        </div>
        <p className="mt-4 text-lg font-medium text-white">{title}</p>
        <p className="mt-2 text-slate-400">{description}</p>
        {children}
      </div>
    </div>
  );
}

EmptyState.Button = ({
  icon: Icon,
  href,
  label,
}: {
  icon: LucideIcon;
  href: string;
  label: string;
}) => (
  <Link
    href={href}
    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);
export default EmptyState;
