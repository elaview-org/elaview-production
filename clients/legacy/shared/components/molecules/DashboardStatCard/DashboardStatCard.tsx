import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  hoverColor?: string;
  footerText?: string;
  valueColor?: string;
  iconColor: string;
  footerTextColor?: string;
  backgroundColor?: string;
}

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  href,
  hoverColor = "",
  footerText,
  valueColor = "text-white",
  iconColor,
  footerTextColor = "text-slate-500",
  backgroundColor = "bg-slate-800",
}: DashboardStatCardProps) {
  const cardContent = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">{label}</h3>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      {footerText && <p className={`mt-1 text-xs ${footerTextColor}`}>{footerText}</p>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors ${hoverColor} ${backgroundColor}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`rounded-lg border border-slate-700 p-6 ${backgroundColor}`}>{cardContent}</div>
  );
}
