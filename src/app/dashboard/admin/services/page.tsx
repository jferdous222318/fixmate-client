"use client";

import { useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { Check, Layers, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { api, errorMessage } from "@/lib/api";
import { date, money } from "@/lib/format";
import type { Service } from "@/lib/types";

const FILTERS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "", label: "All" },
];

export default function ServiceApprovalPage() {
    const [filter, setFilter] = useState("pending"); // pending first, by default
    const { data, loading, error, reload } = useApi<Service[]>(`/api/admin/services${filter ? `?status=${filter}` : ""}`);
    const [busy, setBusy] = useState<string | null>(null);

    const decide = async (s: Service, approvalStatus: "approved" | "rejected") => {
        setBusy(s._id + approvalStatus);
        try {
            await api(`/api/admin/services/${s._id}/approval`, { method: "PATCH", body: { approvalStatus } });
            toast.success(`"${s.title}" ${approvalStatus}`);
            reload();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(null);
        }
    };

    return (
        <>
            <PageHeader title="Service Approval" subtitle="Only approved and available services appear on public pages." />

            <div className="mb-5 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value || "all"}
                        onClick={() => setFilter(f.value)}
                        className={clsx("rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition", filter === f.value ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white hover:border-ink")}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !data?.length ? (
                <EmptyState icon={Layers} title={filter === "pending" ? "Nothing waiting for review" : "No services here"} text={filter === "pending" ? "You are all caught up. New and edited services will show up here." : undefined} />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Technician</th>
                                <th className="px-4 py-3">Category / Mode</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Submitted</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {data.map((s) => (
                                <tr key={s._id} className={clsx("hover:bg-paper/60", s.approvalStatus === "pending" && "bg-amber-50/60")}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={s.image} alt="" className="h-11 w-16 shrink-0 rounded-md border-2 border-ink object-cover" />
                                            <div className="min-w-0">
                                                <p className="font-bold leading-tight">{s.title}</p>
                                                <p className="mt-0.5 line-clamp-1 max-w-[260px] text-xs text-ink-soft">{s.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold">{s.technicianName}</p>
                                        <p className="font-mono text-xs text-ink-soft">{s.technicianEmail}</p>
                                    </td>
                                    <td className="px-4 py-3 text-xs">{s.category}<br /><span className="text-ink-soft">{s.serviceMode}</span></td>
                                    <td className="px-4 py-3 font-mono font-bold">{money(s.basePrice)}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{date(s.createdAt)}</td>
                                    <td className="px-4 py-3"><StatusBadge status={s.approvalStatus} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            {s.approvalStatus !== "approved" && (
                                                <button className="btn bg-green-600 px-3 py-1.5 text-xs text-white" disabled={!!busy} onClick={() => decide(s, "approved")}>
                                                    {busy === s._id + "approved" ? <Spinner size={14} /> : <Check size={14} />} Approve
                                                </button>
                                            )}
                                            {s.approvalStatus !== "rejected" && (
                                                <button className="btn-ghost px-3 py-1.5 text-xs text-red-700" disabled={!!busy} onClick={() => decide(s, "rejected")}>
                                                    {busy === s._id + "rejected" ? <Spinner size={14} /> : <X size={14} />} Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}