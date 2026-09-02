import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  badge?: { label: string; className: string };
};

export function StatCard({ label, value, badge }: StatCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</p>
      {badge && (
        <span
          className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      )}
    </Card>
  );
}
