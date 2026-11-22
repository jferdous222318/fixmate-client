"use client";

import { useState } from "react";
import clsx from "clsx";
import { ClipboardList } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { date, money, statusLabel } from "@/lib/format";
import type { Booking } from "@/lib/types";

const FILTERS = ["", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

// read-only view of every booking on the platform
export default function AllBookingsPage() {
    const [filter, setFilter] = useState("");
    const { data, loading, error } = useApi<Booking[]>(`/api/admin/bookings${filter ? `?status=${filter}` : ""}`);

    return (
        <>
            <PageHeader title="All Bookings" subtitle="Monitor every repair job across the platform (read-only)." />

            <div className="mb-5 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f || "all"}
                        onClick={() => setFilter(f)}
                        className={clsx("rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition", filter === f ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white hover:border-ink")}
                    >
                        {f ? statusLabel(f) : "All"}
                    </button>
                ))}
            </div>

            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !data?.length ? (
                <EmptyState icon={ClipboardList} title="No bookings found" text="Try another status filter." />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Technician</th>
                                <th className="px-4 py-3">Preferred date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {data.map((b) => (
                                <tr key={b._id} className="hover:bg-paper/60">
                                    <td className="px-4 py-3 font-bold">{b.serviceTitle}</td>
                                    <td className="px-4 py-3">{b.customerName}<p className="font-mono text-xs text-ink-soft">{b.customerEmail}</p></td>
                                    <td className="px-4 py-3">{b.technicianName}<p className="font-mono text-xs text-ink-soft">{b.technicianEmail}</p></td>
                                    <td className="px-4 py-3 font-mono text-xs">{date(b.preferredDate)}</td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                                    <td className="px-4 py-3 text-right font-mono font-bold">{money(b.finalAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}