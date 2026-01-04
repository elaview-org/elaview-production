import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  iconColor?: string;
  borderClass?: string;
}

export function QuickActionCard({
  title,
  description,
  href,
  iconColor = "text-slate-400",
  borderClass = "",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-lg bg-slate-900/50 p-4 transition-colors hover:bg-slate-900 ${borderClass}`}
    >
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <ArrowRight className={`h-5 w-5 transition-colors group-hover:text-white ${iconColor}`} />
    </Link>
  );
}
