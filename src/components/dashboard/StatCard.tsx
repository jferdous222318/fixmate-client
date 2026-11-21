import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const TONES = {
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-mustard text-ink",
    green: "bg-green-100 text-green-800",
    teal: "bg-workshop text-white",
    orange: "bg-signal text-white",
    ink: "bg-ink text-paper",
};

type Props = {
    label: string;
    value: string | number | undefined;
    icon: LucideIcon;
    tone?: keyof typeof TONES;
    hint?: string;
    loading?: boolean;
};

// reusable stats card used on every overview page
export default function StatCard({ label, value, icon: Icon, tone = "blue", hint, loading }: Props) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border-2 border-ink bg-white p-5 shadow-hard-sm">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-soft">{label}</p>
                {loading ? (
                    <Skeleton className="mt-2 h-9 w-20" />
                ) : (
                    <p className="mt-1 font-mono text-3xl font-bold tracking-tight">{value ?? 0}</p>
                )}
                {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
            </div>
            <span className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-ink", TONES[tone])}>
                <Icon size={22} />
            </span>
        </div>
    );
}