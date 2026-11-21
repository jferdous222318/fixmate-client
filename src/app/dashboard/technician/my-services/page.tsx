"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CirclePlus, Package, Pencil, Trash } from "lucide-react";
import clsx from "clsx";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm, { type ServiceInput } from "@/components/forms/ServiceForm";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";

const toInput = (s: Service): ServiceInput => ({
    title: s.title, category: s.category, description: s.description, image: s.image,
    basePrice: String(s.basePrice), estimatedDuration: s.estimatedDuration, serviceMode: s.serviceMode, serviceArea: s.serviceArea,
});

// availability switch
function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
    return (
        <button
            role="switch"
            aria-checked={on}
            onClick={onClick}
            disabled={disabled}
            className={clsx("relative h-7 w-12 shrink-0 rounded-full border-2 border-ink transition disabled:opacity-50", on ? "bg-workshop" : "bg-paper-dark")}
        >
            <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full border-2 border-ink bg-white transition-all", on ? "left-[22px]" : "left-0.5")} />
            <span className="sr-only">{on ? "Available" : "Hidden"}</span>
        </button>
    );
}

export default function MyServicesPage() {
    const { data, loading, error, reload, setData } = useApi<Service[]>("/api/services/my");
    const { data: session } = authClient.useSession();
    const [editing, setEditing] = useState<Service | null>(null);
    const [deleting, setDeleting] = useState<Service | null>(null);
    const [busy, setBusy] = useState<string | null>(null);

    const toggle = async (s: Service) => {
        setBusy(s._id);
        try {
            const res = await api<{ message: string }>(`/api/services/${s._id}/availability`, { method: "PATCH", body: { isAvailable: !s.isAvailable } });
            setData((list) => list?.map((x) => (x._id === s._id ? { ...x, isAvailable: !s.isAvailable } : x)) ?? null);
            toast.success(res.message);
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(null);
        }
    };

    const remove = async () => {
        if (!deleting) return;
        setBusy(deleting._id);
        try {
            await api(`/api/services/${deleting._id}`, { method: "DELETE" });
            toast.success("Service deleted");
            setDeleting(null);
            reload();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(null);
        }
    };

    return (
        <>
            <PageHeader
                title="My Services"
                subtitle="Edit, hide or delete your listings. Editing sends a service back for admin approval."
                action={<Link href="/dashboard/technician/add-service" className="btn-primary"><CirclePlus size={16} /> Add service</Link>}
            />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !data?.length ? (
                <EmptyState icon={Package} title="No services yet" text="Add your first repair service and it will appear here while it waits for approval." action={{ href: "/dashboard/technician/add-service", label: "Add a service" }} />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Approval</th>
                                <th className="px-4 py-3">Available</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {data.map((s) => (
                                <tr key={s._id} className="hover:bg-paper/60">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={s.image} alt="" className="h-11 w-16 shrink-0 rounded-md border-2 border-ink object-cover" />
                                            <span className="font-bold leading-tight">{s.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{s.category}</td>
                                    <td className="px-4 py-3 font-mono font-bold">{money(s.basePrice)}</td>
                                    <td className="px-4 py-3"><StatusBadge status={s.approvalStatus} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Toggle on={s.isAvailable} onClick={() => toggle(s)} disabled={busy === s._id} />
                                            <span className="text-xs font-semibold text-ink-soft">{s.isAvailable ? "On" : "Hidden"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setEditing(s)}><Pencil size={14} /> Edit</button>
                                            <button className="btn bg-red-600 px-3 py-1.5 text-xs text-white" onClick={() => setDeleting(s)}><Trash size={14} /> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" size="lg">
                {editing && session && (
                    <ServiceForm
                        key={editing._id}
                        initial={toInput(editing)}
                        technician={{ name: session.user.name, email: session.user.email }}
                        submitLabel="Save & send for re-approval"
                        compact
                        onSubmit={async (body) => {
                            try {
                                await api(`/api/services/${editing._id}`, { method: "PATCH", body });
                                toast.success("Service updated. It is pending approval again.");
                                setEditing(null);
                                reload();
                                return true;
                            } catch (err) {
                                toast.error(errorMessage(err));
                                return false;
                            }
                        }}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!deleting}
                title="Delete this service?"
                message={`"${deleting?.title}" will be permanently removed. Existing bookings keep their copied details.`}
                confirmLabel="Delete service"
                loading={busy === deleting?._id}
                onConfirm={remove}
                onClose={() => setDeleting(null)}
            />
        </>
    );
}