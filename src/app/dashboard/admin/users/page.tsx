"use client";

import { useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { Users } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/useApi";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { ROLE_BADGE } from "@/lib/constants";
import { date } from "@/lib/format";
import type { AppUser, Role } from "@/lib/types";

const ROLES: Role[] = ["customer", "technician", "admin"];

export default function ManageUsersPage() {
    const { data, loading, error, setData } = useApi<AppUser[]>("/api/admin/users");
    const { data: session } = authClient.useSession();
    const [busy, setBusy] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<"" | Role>("");

    const changeRole = async (u: AppUser, role: Role) => {
        if (role === u.role) return;
        setBusy(u._id);
        try {
            const res = await api<{ message: string }>(`/api/admin/users/${u._id}/role`, { method: "PATCH", body: { role } });
            setData((list) => list?.map((x) => (x._id === u._id ? { ...x, role } : x)) ?? null);
            toast.success(res.message);
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(null);
        }
    };

    const rows = (data ?? []).filter((u) => !roleFilter || u.role === roleFilter);
    const count = (r: Role) => (data ?? []).filter((u) => u.role === r).length;

    return (
        <>
            <PageHeader title="Manage Users" subtitle="Change anyone's role except your own. Changes apply immediately." />

            <div className="mb-5 flex flex-wrap gap-2">
                {(["", ...ROLES] as const).map((r) => (
                    <button
                        key={r || "all"}
                        onClick={() => setRoleFilter(r)}
                        className={clsx("rounded-full border-2 px-4 py-1.5 text-sm font-semibold capitalize transition", roleFilter === r ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white hover:border-ink")}
                    >
                        {r || "All"} {data && <span className="ml-1 font-mono text-xs opacity-70">{r ? count(r) : data.length}</span>}
                    </button>
                ))}
            </div>

            {error && <p className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            {loading ? (
                <TableSkeleton />
            ) : !rows.length ? (
                <EmptyState icon={Users} title="No users found" />
            ) : (
                <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="border-b-2 border-ink bg-paper-dark text-xs uppercase tracking-wider text-ink-soft">
                            <tr>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Current role</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3">Change role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                            {rows.map((u) => {
                                const self = u.email === session?.user.email;
                                return (
                                    <tr key={u._id} className="hover:bg-paper/60">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-mustard font-bold">
                                                    {u.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={u.image} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        u.name?.[0]?.toUpperCase()
                                                    )}
                                                </span>
                                                <span className="font-bold">{u.name}{self && <span className="ml-2 text-xs font-semibold text-ink-soft">(you)</span>}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={clsx("rounded px-2 py-0.5 text-xs font-bold capitalize", ROLE_BADGE[u.role] ?? ROLE_BADGE.customer)}>{u.role || "customer"}</span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{date(u.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    aria-label={`Role for ${u.name}`}
                                                    className="input w-40 py-1.5"
                                                    value={u.role || "customer"}
                                                    disabled={self || busy === u._id}
                                                    title={self ? "You cannot change your own role" : undefined}
                                                    onChange={(e) => changeRole(u, e.target.value as Role)}
                                                >
                                                    {ROLES.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
                                                </select>
                                                {busy === u._id && <Spinner size={16} />}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}