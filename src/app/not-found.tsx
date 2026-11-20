import Link from "next/link";
import { House, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Page Not Found" };

// a broken plug with a loose wrench: the repair-themed 404 illustration
function BrokenPlug() {
    return (
        <svg viewBox="0 0 320 200" className="h-auto w-full max-w-md" aria-hidden="true">
            <rect x="10" y="150" width="300" height="10" rx="5" fill="#14211f" opacity=".12" />
            {/* cable */}
            <path d="M20 120 C70 120 70 70 120 90" fill="none" stroke="#14211f" strokeWidth="6" strokeLinecap="round" />
            {/* plug */}
            <rect x="112" y="72" width="54" height="40" rx="8" fill="#0f5c55" stroke="#14211f" strokeWidth="4" />
            <rect x="166" y="80" width="18" height="6" rx="2" fill="#14211f" />
            <rect x="166" y="98" width="18" height="6" rx="2" fill="#14211f" />
            {/* sparks */}
            <path d="M196 74 l10 -12 M200 92 h16 M196 110 l10 12" stroke="#ff6a2b" strokeWidth="5" strokeLinecap="round" />
            {/* socket */}
            <rect x="226" y="62" width="64" height="60" rx="10" fill="#f6f2ea" stroke="#14211f" strokeWidth="4" />
            <rect x="240" y="80" width="6" height="12" rx="2" fill="#14211f" />
            <rect x="270" y="80" width="6" height="12" rx="2" fill="#14211f" />
            <path d="M248 106 q10 -6 20 0" stroke="#14211f" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* wrench */}
            <g transform="rotate(-28 120 150)">
                <rect x="80" y="140" width="80" height="14" rx="7" fill="#f2b84b" stroke="#14211f" strokeWidth="4" />
                <circle cx="168" cy="147" r="15" fill="#f2b84b" stroke="#14211f" strokeWidth="4" />
                <rect x="170" y="141" width="18" height="12" fill="#f6f2ea" />
            </g>
        </svg>
    );
}

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="bg-blueprint">
                <div className="container-x flex flex-col items-center py-20 text-center">
                    <BrokenPlug />
                    <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.25em] text-signal">Error 404 · Disconnected</p>
                    <h1 className="section-title mt-3">This page came unplugged</h1>
                    <p className="section-sub mx-auto">
                        The page you are looking for does not exist, was moved, or the service is no longer available.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/" className="btn-primary"><House size={16} /> Back to Home</Link>
                        <Link href="/services" className="btn-ghost"><Search size={16} /> Browse Services</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}