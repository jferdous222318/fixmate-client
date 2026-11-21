"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";
import { House, LogOut, PanelLeftClose, PanelLeft, Wrench, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { DASHBOARD_MENU, PROFILE_LINK, type MenuItem } from "@/lib/constants";
import type { Role } from "@/lib/types";

type Props = {
    role: Role;
    collapsed: boolean;
    mobileOpen: boolean;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
};

const HOME_LINK: MenuItem = { href: "/", label: "Back to Home", icon: House };

function SidebarLink({ item, active, collapsed, onNavigate }: { item: MenuItem; active: boolean; collapsed: boolean; onNavigate: () => void }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={clsx(
                "group flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition",
                active ? "border-paper bg-signal text-white shadow-[2px_2px_0_0_#f6f2ea]" : "border-transparent text-paper/75 hover:bg-paper/10 hover:text-paper",
                collapsed && "lg:justify-center lg:px-0"
            )}
        >
            <Icon size={19} className="shrink-0" />
            <span className={clsx(collapsed && "lg:hidden")}>{item.label}</span>
        </Link>
    );
}

export default function Sidebar({ role, collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const items = DASHBOARD_MENU[role];

    // overview links match exactly, others match their sub-routes too
    const isActive = (href: string) => (href === `/dashboard/${role}` ? pathname === href : pathname.startsWith(href));

    const signOut = async () => {
        await authClient.signOut();
        clearToken();
        toast.success("Signed out successfully");
        router.push("/");
        router.refresh();
    };

    return (
        <>
            {/* mobile / tablet backdrop */}
            {mobileOpen && <button className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={onCloseMobile} aria-label="Close menu" />}

            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r-2 border-ink bg-ink text-paper transition-all duration-300",
                    "w-72 lg:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                    collapsed ? "lg:w-20" : "lg:w-64"
                )}
            >
                <div className={clsx("flex h-16 items-center border-b-2 border-paper/10 px-4", collapsed ? "lg:justify-center" : "justify-between")}>
                    <Link href="/" className="flex items-center gap-2.5" aria-label="FixMate home">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-paper bg-signal text-white">
                            <Wrench size={18} strokeWidth={2.6} />
                        </span>
                        <span className={clsx("font-display text-2xl font-extrabold tracking-tight", collapsed && "lg:hidden")}>
                            Fix<span className="text-signal">Mate</span>
                        </span>
                    </Link>
                    <button onClick={onCloseMobile} className="rounded-md p-1.5 hover:bg-paper/10 lg:hidden" aria-label="Close sidebar">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    <p className={clsx("px-3 pb-2 pt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-paper/40", collapsed && "lg:hidden")}>
                        {role} menu
                    </p>
                    {items.map((it) => <SidebarLink key={it.href} item={it} active={isActive(it.href)} collapsed={collapsed} onNavigate={onCloseMobile} />)}

                    <div className="my-4 border-t-2 border-dashed border-paper/10" />
                    <SidebarLink item={PROFILE_LINK} active={isActive(PROFILE_LINK.href)} collapsed={collapsed} onNavigate={onCloseMobile} />
                    <SidebarLink item={HOME_LINK} active={false} collapsed={collapsed} onNavigate={onCloseMobile} />
                </nav>

                <div className="space-y-1 border-t-2 border-paper/10 p-3">
                    <button
                        onClick={signOut}
                        title={collapsed ? "Sign Out" : undefined}
                        className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/15", collapsed && "lg:justify-center lg:px-0")}
                    >
                        <LogOut size={19} /> <span className={clsx(collapsed && "lg:hidden")}>Sign Out</span>
                    </button>
                    <button
                        onClick={onToggleCollapse}
                        className={clsx("hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-paper/60 hover:bg-paper/10 lg:flex", collapsed && "lg:justify-center lg:px-0")}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <PanelLeft size={19} /> : <><PanelLeftClose size={19} /> Collapse</>}
                    </button>
                </div>
            </aside>
        </>
    );
}