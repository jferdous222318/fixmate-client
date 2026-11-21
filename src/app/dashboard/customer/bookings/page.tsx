"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ClipboardList, CreditCard, X } from "lucide-react";
import clsx from "clsx";
import PageHeader from "@/components/dashboard/PageHeader";
import JobTimeline from "@/components/dashboard/JobTimeline";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { api, errorMessage } from "@/lib/api";
import { date, money } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function MyBookingsPage() {
    const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
    const [toCancel, setToCancel] = useState<Booking | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [open, setOpen] = useState<string | null>(null);

    const cancel = async () => {
        if (!toCancel) return;
        setBusy(toCancel._id);
        try {
            await api(`/api/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
            toast.success("Booking cancelled");
            setToCancel(null);
            reload();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(null);
        }
    };

    // the server reads the amount from the database and returns the Stripe Checkout URL
    const pay = async (b: Booking) => {
        setBusy(b._id);
        try {
            const { url } = await api<{ url: string }>("/api/payments/create-checkout-session", { method: "POST", body: { bookingId: b._id } });
            toast.loading("Redirecting to secure checkout…");
            window.location.assign(url);
        } catch (err) {
            toast.error(errorMessage(err));
            setBusy(null);
        }
    };

    const renderActions = (b: Booking) => (
        <div className="flex flex-wrap items-center gap-2">
            {b.status === "requested" && (
                <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setToCancel(b)}>
                    <X size={14} /> Cancel
                </button>
            )}
            {b.status === "completed" && b.paymentStatus === "unpaid" && (
                <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => pay(b)} disabled={busy === b._id}>
                    {busy === b._id ? <Spinner size={14} /> : <CreditCard size={14} />} Pay Now
                </button>
            )}
            {b.paymentStatus === "paid" && <StatusBadge status="paid" />}
            {["accepted", "in-progress", "rejected", "cancelled"].includes(b.status) && <span className="text-xs text-ink-soft">—</span>}
        </div>
    );

    const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

    return (
        <>
            <PageHeader title="My Bookings" subtitle="Track every repair request, cancel pending ones and pay for completed jobs." />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !data?.length ? (
                <EmptyState icon={ClipboardList} title="No bookings yet" text="When you request a repair, it will show up here with live status updates." action={{ href: "/services", label: "Browse services" }} />
            ) : (
                <>
                    {/* desktop table */}
                    <div className="hidden overflow-x-auto rounded-xl border-2 border-ink bg-white md:block">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                                <tr>
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Technician</th>
                                    <th className="px-4 py-3">Preferred date</th>
                                    <th className="px-4 py-3">Base / Final</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Payment</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-2 py-3"><span className="sr-only">Timeline</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/10">
                                {data.map((b) => (
                                    <Fragment key={b._id}>
                                        <tr className="align-middle hover:bg-paper/60">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={b.serviceImage} alt="" className="h-11 w-16 shrink-0 rounded-md border-2 border-ink object-cover" />
                                                    <span className="font-bold leading-tight">{b.serviceTitle}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{b.technicianName}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{date(b.preferredDate)}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{money(b.basePrice)} / <b className="text-ink">{money(b.finalAmount)}</b></td>
                                            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                            <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                                            <td className="px-4 py-3">{renderActions(b)}</td>
                                            <td className="px-2 py-3">
                                                <button onClick={() => toggle(b._id)} className="rounded-md p-1.5 hover:bg-paper-dark" aria-label="Show job timeline" aria-expanded={open === b._id}>
                                                    <ChevronDown size={18} className={clsx("transition", open === b._id && "rotate-180")} />
                                                </button>
                                            </td>
                                        </tr>
                                        {open === b._id && (
                                            <tr className="bg-paper/60">
                                                <td colSpan={8} className="px-6 py-5"><JobTimeline booking={b} /></td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* mobile cards */}
                    <div className="grid gap-4 md:hidden">
                        {data.map((b) => (
                            <article key={b._id} className="overflow-hidden rounded-xl border-2 border-ink bg-white">
                                <div className="flex gap-3 p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-md border-2 border-ink object-cover" />
                                    <div className="min-w-0">
                                        <p className="font-bold leading-tight">{b.serviceTitle}</p>
                                        <p className="mt-1 text-xs text-ink-soft">{b.technicianName} · {date(b.preferredDate)}</p>
                                        <p className="mt-1 font-mono text-xs">{money(b.basePrice)} / <b>{money(b.finalAmount)}</b></p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 border-t-2 border-dashed border-ink/10 px-4 py-3">
                                    <StatusBadge status={b.status} />
                                    <StatusBadge status={b.paymentStatus} />
                                    <div className="ml-auto">{renderActions(b)}</div>
                                </div>
                                <div className="border-t-2 border-dashed border-ink/10 px-3 py-4"><JobTimeline booking={b} /></div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <ConfirmModal
                open={!!toCancel}
                title="Cancel this request?"
                message={`Your request for "${toCancel?.serviceTitle}" will be cancelled. This cannot be undone.`}
                confirmLabel="Yes, cancel it"
                loading={busy === toCancel?._id}
                onConfirm={cancel}
                onClose={() => setToCancel(null)}
            />
        </>
    );
}