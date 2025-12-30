import { LucideIcon } from "lucide-react";

function Badge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
      <Icon className="h-8 w-8 text-purple-400" />
    </div>
  );
}

export default Badge;
