import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type LinksProps = {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: "shadow" | "main" |"small";
};

const LINK_STYLES: Record<NonNullable<LinksProps["variant"]>, string> = {
  shadow:
    "ml-4 inline-flex items-center rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-400 transition-colors hover:bg-blue-600/10",
  main: "inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700",
  small:"mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700",
};
// I gonna need better approach for design consistances
function Links({ href, label, icon: Icon, variant = "main" }: LinksProps) {
  return (
    <Link href={href} className={LINK_STYLES[variant]}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {label}
    </Link>
  );
}

export default Links;
