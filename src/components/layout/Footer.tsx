import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";

// the new X logo (not the old Twitter bird)
const XIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const FbIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
);
const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="mt-24 border-t-2 border-ink bg-ink text-paper">
            <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Logo light />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
                        Verified technicians, trackable jobs, and payment only after the work is done.
                    </p>
                    <div className="mt-5 flex gap-2">
                        {[
                            { label: "X", icon: <XIcon />, href: "https://x.com" },
                            { label: "Facebook", icon: <FbIcon />, href: "https://facebook.com" },
                            { label: "LinkedIn", icon: <LinkedinIcon />, href: "https://linkedin.com" },
                        ].map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                                className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-paper/30 transition hover:border-signal hover:bg-signal">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-display text-lg font-bold">Quick Links</h4>
                    <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
                        <li><Link className="hover:text-signal" href="/">Home</Link></li>
                        <li><Link className="hover:text-signal" href="/services">Services</Link></li>
                        <li><Link className="hover:text-signal" href="/about">How It Works</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display text-lg font-bold">Popular Categories</h4>
                    <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
                        {CATEGORIES.slice(0, 5).map((c) => (
                            <li key={c}>
                                <Link className="hover:text-signal" href={`/services?category=${encodeURIComponent(c)}`}>{c}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-display text-lg font-bold">Contact</h4>
                    <ul className="mt-4 space-y-3 text-sm text-paper/70">
                        <li className="flex items-center gap-2"><Mail size={15} className="text-signal" /> support@fixmate.com</li>
                        <li className="flex items-center gap-2"><Phone size={15} className="text-signal" /> +880 1700-000000</li>
                        <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-signal" /> House 12, Road 5, Mirpur, Dhaka</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-paper/15 py-5 text-center text-xs text-paper/60">
                © {new Date().getFullYear()} FixMate. All rights reserved.
            </div>
        </footer>
    );
}