import clsx from "clsx";
import { STATUS_STYLES } from "@/lib/constants";
import { statusLabel } from "@/lib/format";

export default function StatusBadge({ status, className }: { status: string; className?: string }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-bold",
                STATUS_STYLES[status] ?? "border-gray-300 bg-gray-100 text-gray-700",
                className
            )}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabel(status)}
        </span>
    );
}