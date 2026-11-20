"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/constants";

const ROLE_BADGE: Record<string, string> = {
    customer: "bg-mustard text-ink",
    technician: "bg-workshop text-white",
    admin: "bg-signal text-white",
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    const user = session?.user;
    const role = (user?.role as string) || "customer";

    // close menus on route change
    useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [pathname]);

    // close avatar dropdown on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    const handleSignOut = async () => {
        await authClient.signOut();
        toast.success("Signed out successfully");
        setDropOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur">
            <div className="container-x flex h-16 items-center justify-between">
                <Logo />

                {/* desktop links */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={clsx(
                                "rounded-md px-3.5 py-2 text-sm font-semibold transition",
                                isActive(l.href) ? "bg-ink text-paper" : "text-ink hover:bg-paper-dark"
                            )}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {isPending ? (
                        <div className="h-10 w-10 animate-pulse rounded-full bg-paper-dark" />
                    ) : user ? (
                        <div className="relative" ref={dropRef}>
                            <button
                                onClick={() => setDropOpen((v) => !v)}
                                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-mustard font-bold shadow-hard-sm"
                                aria-label="Open user menu"
                            >
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user.name?.[0]?.toUpperCase()
                                )}
                            </button>

                            {dropOpen && (
                                <div className="absolute right-0 mt-3 w-64 rounded-xl border-2 border-ink bg-white p-2 shadow-hard">
                                    <div className="border-b-2 border-dashed border-ink/20 px-3 pb-3 pt-2">
                                        <p className="truncate font-display text-base font-bold">{user.name}</p>
                                        <p className="truncate font-mono text-xs text-ink-soft">{user.email}</p>
                                        <span className={clsx("mt-2 inline-block rounded px-2 py-0.5 text-xs font-bold capitalize", ROLE_BADGE[role])}>
                                            {role}
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/${role}`} className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-paper-dark">
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                    <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-paper-dark">
                                        <UserCog size={16} /> Update Profile
                                    </Link>
                                    <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link href="/sign-in" className="btn-ghost">Sign In</Link>
                            <Link href="/sign-up" className="btn-primary">Sign Up</Link>
                        </div>
                    )}

                    {/* hamburger */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-white md:hidden"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* mobile panel */}
            {menuOpen && (
                <div className="border-t-2 border-ink bg-paper md:hidden">
                    <div className="container-x flex flex-col gap-1 py-3">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={clsx("rounded-md px-3 py-2.5 text-sm font-semibold", isActive(l.href) ? "bg-ink text-paper" : "hover:bg-paper-dark")}
                            >
                                {l.label}
                            </Link>
                        ))}
                        {!user && !isPending && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <Link href="/sign-in" className="btn-ghost">Sign In</Link>
                                <Link href="/sign-up" className="btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}