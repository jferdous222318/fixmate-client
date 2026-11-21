"use client";

import Link from "next/link";
import { CircleCheck, ClipboardList, Search, Timer } from "lucide-react";
import PageHeader, { Panel } from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { MonthlyBarChart, StatusBreakdown } from "@/components/dashboard/Charts";
import { useApi } from "@/lib/useApi";
import type { MonthlyPoint, StatusCounts } from "@/lib/types";

type Stats = { totalRequests: number; activeJobs: number; completedJobs: number; statusCounts: StatusCounts; monthlySpending: MonthlyPoint[] };

export default function CustomerOverview() {
    const { data, loading, error } = useApi<Stats>("/api/stats/customer");

    return (
        <>
            <PageHeader
                title="Customer Overview"
                subtitle="A quick look at your repair requests and spending."
                action={<Link href="/services" className="btn-primary"><Search size={16} /> Find a repair</Link>}
            />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            <div className="grid gap-5 sm:grid-cols-3">
                <StatCard label="Total Requests" value={data?.totalRequests} icon={ClipboardList} tone="blue" loading={loading} />
                <StatCard label="Active Jobs" value={data?.activeJobs} icon={Timer} tone="amber" hint="Requested, accepted or in progress" loading={loading} />
                <StatCard label="Completed Jobs" value={data?.completedJobs} icon={CircleCheck} tone="green" loading={loading} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <Panel title="Monthly spending">
                    <MonthlyBarChart data={data?.monthlySpending} label="Spending" />
                </Panel>
                <Panel title="My jobs by status" action={<Link href="/dashboard/customer/bookings" className="text-xs font-bold text-workshop hover:underline">View all</Link>}>
                    <StatusBreakdown counts={data?.statusCounts} />
                </Panel>
            </div>
        </>
    );
}