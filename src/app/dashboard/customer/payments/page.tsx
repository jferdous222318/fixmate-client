"use client";

import { Receipt } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { date, money } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function PaymentHistoryPage() {
    const { data, loading, error } = useApi<Payment[]>("/api/payments/my");
    const total = (data ?? []).reduce((s, p) => s + p.amount, 0);

    return (
        <>
            <PageHeader
                title="Payment History"
                subtitle="Every repair you have paid for through Stripe."
                action={data?.length ? <p className="rounded-lg border-2 border-ink bg-white px-4 py-2 text-sm font-semibold">Total paid: <span className="font-mono">{money(total)}</span></p> : null}
            />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !data?.length ? (
                <EmptyState icon={Receipt} title="No payments yet" text="Once a technician completes your job, you can pay from My Bookings." action={{ href: "/dashboard/customer/bookings", label: "Go to My Bookings" }} />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Technician</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Transaction ID</th>
                                <th className="px-4 py-3">Payment date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {data.map((p) => (
                                <tr key={p._id} className="hover:bg-paper/60">
                                    <td className="px-4 py-3 font-bold">{p.serviceTitle}</td>
                                    <td className="px-4 py-3">{p.technicianName}</td>
                                    <td className="px-4 py-3 font-mono font-bold">{money(p.amount)}</td>
                                    <td className="px-4 py-3"><code className="rounded bg-paper px-2 py-1 font-mono text-xs">{p.transactionId}</code></td>
                                    <td className="px-4 py-3 font-mono text-xs">{date(p.paidAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}