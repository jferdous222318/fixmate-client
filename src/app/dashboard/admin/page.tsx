"use client";

import Link from "next/link";
import { CircleDollarSign, Hammer, Hourglass, Users } from "lucide-react";
import PageHeader, { Panel } from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { HBarList, MonthlyBarChart, StatusBreakdown } from "@/components/dashboard/Charts";
import { useApi } from "@/lib/useApi";
import { money } from "@/lib/format";
import type { MonthlyPoint, StatusCounts } from "@/lib/types";

type Stats = {
    totalUsers: number; totalTechnicians: number; pendingServices: number; totalRevenue: number;
    statusCounts: StatusCounts; servicesByCategory: { category: string; count: number }[]; monthlyRevenue: MonthlyPoint[];
};

export default function AdminOverview() {
    const { data, loading, error } = useApi<Stats>("/api/stats/admin");

    return (
        <>
            <PageHeader
                title="Admin Overview"
                subtitle="Platform health: people, listings waiting for review, jobs and revenue."
                action={data?.pendingServices ? <Link href="/dashboard/admin/services" className="btn-primary"><Hourglass size={16} /> Review {data.pendingServices} pending</Link> : null}
            />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Users" value={data?.totalUsers} icon={Users} tone="blue" loading={loading} />
                <StatCard label="Total Technicians" value={data?.totalTechnicians} icon={Hammer} tone="teal" loading={loading} />
                <StatCard label="Pending Services" value={data?.pendingServices} icon={Hourglass} tone="amber" hint="Waiting for your approval" loading={loading} />
                <StatCard label="Total Revenue" value={money(data?.totalRevenue)} icon={CircleDollarSign} tone="green" loading={loading} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <Panel title="Monthly revenue">
                    <MonthlyBarChart data={data?.monthlyRevenue} label="Revenue" />
                </Panel>
                <Panel title="All jobs by status">
                    <StatusBreakdown counts={data?.statusCounts} />
                </Panel>
            </div>

            <Panel title="Approved services by category" className="mt-6">
                <div className="max-w-3xl">
                    <HBarList rows={(data?.servicesByCategory ?? []).map((c) => ({ label: c.category, value: c.count }))} />
                </div>
            </Panel>
        </>
    );
}