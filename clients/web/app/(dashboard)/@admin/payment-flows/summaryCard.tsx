// Summary Card Component
export default function SummaryCard({
  title,
  value,
  color,
  alert = false,
}: {
  title: string;
  value: number | string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${color} ${alert ? "ring-2 ring-red-400" : ""}`}
    >
      <div className="mb-1 text-xs font-medium text-slate-400">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
