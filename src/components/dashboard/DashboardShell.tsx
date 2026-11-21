"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";
import { House, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { authClient } from "@/lib/auth-client";
import { ROLE_BADGE } from "@/lib/constants";
import type { Role } from "@/lib/types";

type InitialUser = { name: string; email: string; image?: string | null; role: Role };

export default function DashboardShell({ user: initial, children }: { user: InitialUser; children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useSearchParams();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // live session: after Update Profile the new name + photo show here without logging out
    const { data } = authClient.useSession();
    const user = data?.user ?? initial;
    const role = initial.role;

    // close the mobile drawer after navigating
    const [lastPath, setLastPath] = useState(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setMobileOpen(false);
    }
    const toggleCollapse = () => setCollapsed((v) => !v);

    // a user who opened another role's route is sent here with ?forbidden=1
    useEffect(() => {
        if (params.get("forbidden")) {
            toast.error("Forbidden: that page belongs to another role.");
            router.replace(pathname);
        }
    }, [params, pathname, router]);

    return (
        <div className="min-h-screen bg-paper">
            <Sidebar
                role={role}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggleCollapse={toggleCollapse}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className={clsx("flex min-h-screen flex-col transition-all duration-300", collapsed ? "lg:pl-20" : "lg:pl-64")}>
                {/* top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b-2 border-ink bg-paper/95 px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-white lg:hidden" aria-label="Open sidebar">
                            <Menu size={20} />
                        </button>
                        <Link href="/" className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold hover:bg-paper-dark sm:flex">
                            <House size={16} /> Home
                        </Link>
                    </div>

                    <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg py-1 pl-1 pr-1 hover:bg-paper-dark sm:pr-3">
                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-mustard font-bold shadow-hard-sm">
                            {user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                user.name?.[0]?.toUpperCase()
                            )}
                        </span>
                        <span className="hidden leading-tight sm:block">
                            <span className="block max-w-[180px] truncate text-sm font-bold">{user.name}</span>
                            <span className={clsx("mt-0.5 inline-block rounded px-1.5 text-[10px] font-bold uppercase tracking-wider", ROLE_BADGE[role])}>{role}</span>
                        </span>
                    </Link>
                </header>

                <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}