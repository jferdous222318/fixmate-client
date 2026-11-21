"use client";

import { useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { Check, CircleCheck, Inbox, MapPin, Phone, Play, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { api, errorMessage } from "@/lib/api";
import { date, money } from "@/lib/format";
import type { Booking } from "@/lib/types";

const FILTERS = [
    { value: "", label: "All" },
    { value: "requested", label: "Requested" },
    { value: "accepted", label: "Accepted" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

export default function ManageRequestsPage() {
    const [filter, setFilter] = useState("");
    // the status filter runs on the server
    const { data, loading, error, reload } = useApi<Booking[]>(`/api/bookings/technician${filter ? `?status=${filter}` : ""}`);
    const [busy, setBusy] = useState<string | null>(null);
    const [rejecting, setRejecting] = useState<Booking | null>(null);
    const [completing, setCompleting] = useState<Booking | null>(null);
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState("");

    const update = async (b: Booking, status: string, extra: Record<string, unknown> = {}) => {
        setBusy(b._id);
        try {
            const res = await api<{ message: string }>(`/api/bookings/${b._id}/status`, { method: "PATCH", body: { status, ...extra } });
            toast.success(res.message);
            reload();
            return true;
        } catch (err) {
            toast.error(errorMessage(err));
            return false;
        } finally {
            setBusy(null);
        }
    };

    const openComplete = (b: Booking) => {
        setCompleting(b);
        setAmount(String(b.basePrice)); // pre-filled with the base price
        setAmountError("");
    };

    const complete = async (e: React.FormEvent) => {
        e.preventDefault();
        const n = Number(amount);
        if (!amount || !Number.isFinite(n) || n <= 0) return setAmountError("Final amount must be greater than 0");
        if (completing && (await update(completing, "completed", { finalAmount: n }))) setCompleting(null);
    };

    const renderActions = (b: Booking) => {
        const loadingThis = busy === b._id;
        if (b.status === "requested")
            return (
                <div className="flex flex-wrap gap-2">
                    <button className="btn bg-green-600 px-3 py-1.5 text-xs text-white" disabled={loadingThis} onClick={() => update(b, "accepted")}>
                        {loadingThis ? <Spinner size={14} /> : <Check size={14} />} Accept
                    </button>
                    <button className="btn-ghost px-3 py-1.5 text-xs text-red-700" disabled={loadingThis} onClick={() => setRejecting(b)}>
                        <X size={14} /> Reject
                    </button>
                </div>
            );
        if (b.status === "accepted")
            return (
                <button className="btn bg-amber-400 px-3 py-1.5 text-xs text-ink" disabled={loadingThis} onClick={() => update(b, "in-progress")}>
                    {loadingThis ? <Spinner size={14} /> : <Play size={14} />} Start Work
                </button>
            );
        if (b.status === "in-progress")
            return (
                <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => openComplete(b)}>
                    <CircleCheck size={14} /> Mark Completed
                </button>
            );
        if (b.status === "completed") return <StatusBadge status={b.paymentStatus} />;
        return <span className="text-xs text-ink-soft">No action</span>;
    };

    return (
        <>
            <PageHeader title="Manage Requests" subtitle="Accept new jobs and move them through the pipeline. Only valid next steps are shown." />

            <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        role="tab"
                        aria-selected={filter === f.value}
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
                <EmptyState icon={Inbox} title={filter ? "No jobs with this status" : "No requests yet"} text="When customers book your services, their requests will land here." />
            ) : (
                <>
                    {/* desktop table */}
                    <div className="hidden overflow-x-auto rounded-xl border-2 border-ink bg-white xl:block">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                                <tr>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Phone / Address</th>
                                    <th className="px-4 py-3">Preferred date</th>
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Problem</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/10">
                                {data.map((b) => (
                                    <tr key={b._id} className="align-top hover:bg-paper/60">
                                        <td className="px-4 py-3 font-bold">{b.customerName}</td>
                                        <td className="px-4 py-3">
                                            <a href={`tel:${b.customerPhone}`} className="font-mono text-xs hover:underline">{b.customerPhone}</a>
                                            <p className="mt-1 max-w-[180px] text-xs text-ink-soft">{b.address}</p>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{date(b.preferredDate)}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold leading-tight">{b.serviceTitle}</p>
                                            <p className="mt-1 font-mono text-xs text-ink-soft">{money(b.status === "completed" ? b.finalAmount : b.basePrice)}</p>
                                        </td>
                                        <td className="max-w-[260px] px-4 py-3 text-xs leading-relaxed text-ink-soft">{b.problemDescription}</td>
                                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                        <td className="px-4 py-3">{renderActions(b)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* cards below xl */}
                    <div className="grid gap-4 xl:hidden">
                        {data.map((b) => (
                            <article key={b._id} className="grid gap-4 rounded-xl border-2 border-ink bg-white p-5 md:grid-cols-[1.3fr_1fr] md:items-start">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusBadge status={b.status} />
                                        <span className="font-mono text-xs text-ink-soft">Preferred: {date(b.preferredDate)}</span>
                                    </div>
                                    <h3 className="mt-2 text-lg font-bold leading-tight">{b.serviceTitle}</h3>
                                    <p className="mt-1 font-mono text-xs text-ink-soft">
                                        Base {money(b.basePrice)}{b.status === "completed" && <> · Final <b className="text-ink">{money(b.finalAmount)}</b></>}
                                    </p>
                                    <p className="mt-3 rounded-lg bg-paper px-3 py-2 text-sm leading-relaxed">{b.problemDescription}</p>
                                </div>

                                <div className="space-y-1.5 text-sm">
                                    <p className="font-bold">{b.customerName}</p>
                                    <p className="flex items-center gap-2 text-ink-soft"><Phone size={14} className="shrink-0 text-workshop" /> <a href={`tel:${b.customerPhone}`} className="hover:underline">{b.customerPhone}</a></p>
                                    <p className="flex items-start gap-2 text-ink-soft"><MapPin size={14} className="mt-0.5 shrink-0 text-workshop" /> {b.address}</p>
                                </div>

                                <div className="md:col-span-2">{renderActions(b)}</div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <ConfirmModal
                open={!!rejecting}
                title="Reject this request?"
                message={`${rejecting?.customerName}'s request for "${rejecting?.serviceTitle}" will be rejected. This is a final state.`}
                confirmLabel="Reject request"
                loading={busy === rejecting?._id}
                onConfirm={async () => {
                    if (rejecting && (await update(rejecting, "rejected"))) setRejecting(null);
                }}
                onClose={() => setRejecting(null)}
            />

            <Modal open={!!completing} onClose={() => setCompleting(null)} title="Mark job as completed" size="sm">
                <form onSubmit={complete} noValidate>
                    <p className="text-sm text-ink-soft">
                        Confirm the final amount for <b className="text-ink">{completing?.serviceTitle}</b>. The customer will pay this through Stripe.
                    </p>
                    <label className="label mt-4" htmlFor="final">Final amount (USD)</label>
                    <input id="final" type="number" min="1" step="0.01" className="input font-mono text-lg" value={amount} onChange={(e) => { setAmount(e.target.value); setAmountError(""); }} autoFocus />
                    {amountError && <p className="error-text">{amountError}</p>}
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" className="btn-ghost" onClick={() => setCompleting(null)}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={busy === completing?._id}>
                            {busy === completing?._id ? <Spinner size={16} /> : <CircleCheck size={16} />} Complete job
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}