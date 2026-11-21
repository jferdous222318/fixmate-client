"use client";

import Link from "next/link";
import { BadgeCheck, CirclePlus, HandCoins, Inbox, Package } from "lucide-react";
import PageHeader, { Panel } from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { MonthlyBarChart, StatusBreakdown } from "@/components/dashboard/Charts";
import { useApi } from "@/lib/useApi";
import { money } from "@/lib/format";
import type { MonthlyPoint, StatusCounts } from "@/lib/types";

type Stats = {
    totalServices: number; approvedServices: number; pendingRequests: number; totalEarnings: number;
    statusCounts: StatusCounts; monthlyEarnings: MonthlyPoint[];
};

export default function TechnicianOverview() {
    const { data, loading, error } = useApi<Stats>("/api/stats/technician");

    return (
        <>
            <PageHeader
                title="Technician Overview"
                subtitle="Your services, incoming jobs and earnings at a glance."
                action={<Link href="/dashboard/technician/add-service" className="btn-primary"><CirclePlus size={16} /> Add a service</Link>}
            />
            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Services" value={data?.totalServices} icon={Package} tone="blue" loading={loading} />
                <StatCard label="Approved Services" value={data?.approvedServices} icon={BadgeCheck} tone="green" loading={loading} />
                <StatCard label="Pending Requests" value={data?.pendingRequests} icon={Inbox} tone="amber" hint="Waiting for you to accept" loading={loading} />
                <StatCard label="Total Earnings" value={money(data?.totalEarnings)} icon={HandCoins} tone="teal" loading={loading} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <Panel title="Monthly earnings">
                    <MonthlyBarChart data={data?.monthlyEarnings} label="Earnings" />
                </Panel>
                <Panel title="Jobs by status" action={<Link href="/dashboard/technician/requests" className="text-xs font-bold text-workshop hover:underline">Manage</Link>}>
                    <StatusBreakdown counts={data?.statusCounts} />
                </Panel>
            </div>
        </>
    );
}