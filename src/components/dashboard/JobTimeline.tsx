import clsx from "clsx";
import { Check, CircleX } from "lucide-react";
import type { Booking } from "@/lib/types";
import { date } from "@/lib/format";

const STEPS = ["requested", "accepted", "in-progress", "completed", "paid"] as const;
const LABELS: Record<string, string> = {
    requested: "Requested", accepted: "Accepted", "in-progress": "In Progress", completed: "Completed", paid: "Paid",
};

// Visual step tracker built from booking.statusHistory: Requested -> Accepted -> In Progress -> Completed -> Paid
export default function JobTimeline({ booking }: { booking: Booking }) {
    const history = booking.statusHistory ?? [{ status: "requested", changedAt: booking.createdAt }];
    const when = (s: string) =>
        s === "paid" ? booking.paidAt : history.find((h) => h.status === s)?.changedAt;

    const stopped = booking.status === "rejected" || booking.status === "cancelled";
    const reached = new Set<string>(history.map((h) => h.status));
    if (booking.paymentStatus === "paid") reached.add("paid");

    return (
        <div>
            <ol className="flex items-start">
                {STEPS.map((s, i) => {
                    const done = reached.has(s);
                    const current = !stopped && done && !reached.has(STEPS[i + 1] ?? "");
                    return (
                        <li key={s} className="relative flex flex-1 flex-col items-center text-center">
                            {i > 0 && (
                                <span className={clsx("absolute right-1/2 top-3.5 h-0.5 w-full", done ? "bg-workshop" : "bg-ink/15")} aria-hidden="true" />
                            )}
                            <span
                                className={clsx(
                                    "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2",
                                    done ? "border-ink bg-workshop text-white" : "border-ink/20 bg-white",
                                    current && "ring-4 ring-workshop/20"
                                )}
                            >
                                {done && <Check size={14} strokeWidth={3} />}
                            </span>
                            <span className={clsx("mt-2 text-[11px] font-bold sm:text-xs", done ? "text-ink" : "text-ink/40")}>{LABELS[s]}</span>
                            <span className="font-mono text-[10px] text-ink-soft">{done ? date(when(s)) : ""}</span>
                        </li>
                    );
                })}
            </ol>
            {stopped && (
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                    <CircleX size={15} /> This job was {booking.status} on {date(when(booking.status))}.
                </p>
            )}
        </div>
    );
}