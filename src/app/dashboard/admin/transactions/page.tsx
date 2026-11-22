"use client";

import { CircleDollarSign, CreditCard, Receipt } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { date, money } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function TransactionsPage() {
    const { data, loading, error } = useApi<{ payments: Payment[]; totalRevenue: number }>("/api/admin/payments");
    const payments = data?.payments ?? [];

    return (
        <>
            <PageHeader title="Transactions" subtitle="Every Stripe payment saved on the platform." />

            {/* total revenue above the table */}
            <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:max-w-3xl">
                <StatCard label="Total Revenue" value={money(data?.totalRevenue)} icon={CircleDollarSign} tone="green" loading={loading} />
                <StatCard label="Transactions" value={payments.length} icon={CreditCard} tone="blue" loading={loading} />
            </div>

            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !payments.length ? (
                <EmptyState icon={Receipt} title="No transactions yet" text="Payments appear here once customers pay for completed jobs." />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Technician</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Transaction ID</th>
                                <th className="px-4 py-3">Payment date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {payments.map((p) => (
                                <tr key={p._id} className="hover:bg-paper/60">
                                    <td className="px-4 py-3">{p.customerName}<p className="font-mono text-xs text-ink-soft">{p.customerEmail}</p></td>
                                    <td className="px-4 py-3">{p.technicianName}<p className="font-mono text-xs text-ink-soft">{p.technicianEmail}</p></td>
                                    <td className="px-4 py-3 font-semibold">{p.serviceTitle}</td>
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