import { LucideIcon } from "lucide-react";
import Badge from "../../atoms/Badge";

function UpcommingFeatureNotice({
  status,
  title,
  description,
  icon,
}: {
  status: string;
  title:string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-slate-400">
            {description}
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center shadow-sm">
            <Badge icon={icon}/>
            <p className="mt-4 text-lg font-medium text-white">{status}</p>
            <p className="mt-2 text-slate-400">
              {title} features are currently in development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcommingFeatureNotice;
