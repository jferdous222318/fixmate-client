import Link from "next/link";
import { BadgeCheck, Check, CreditCard, Search, Smartphone, Wrench } from "lucide-react";

const QUICK = ["Screen replacement", "AC servicing", "Laptop", "Wiring"];

const STEPS = [
    { label: "Requested", time: "09:12", done: true },
    { label: "Accepted", time: "09:40", done: true },
    { label: "In Progress", time: "now", active: true },
    { label: "Completed", time: "—" },
    { label: "Paid", time: "—" },
];

// the right side "live job ticket" illustration, built with HTML so it stays crisp
function JobTicket() {
    return (
        <div className="relative mx-auto w-full max-w-md">
            {/* back card */}
            <div className="absolute inset-0 translate-x-5 translate-y-5 rotate-3 rounded-2xl border-2 border-ink bg-workshop" aria-hidden="true" />

            <div className="relative rounded-2xl border-2 border-ink bg-white shadow-hard">
                <div className="flex items-center justify-between rounded-t-[14px] border-b-2 border-dashed border-ink/30 bg-paper px-5 py-3">
                    <span className="font-mono text-xs font-bold tracking-wider">JOB #FM-2048</span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> In Progress
                    </span>
                </div>

                <div className="p-5">
                    <div className="flex items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-mustard">
                            <Smartphone size={22} />
                        </span>
                        <div>
                            <p className="font-display text-lg font-bold leading-tight">iPhone 13 Screen Replacement</p>
                            <p className="mt-0.5 text-xs text-ink-soft">Shop Drop-off · Mirpur, Dhaka</p>
                        </div>
                    </div>

                    <ol className="relative mt-6 space-y-3 pl-1">
                        <span className="absolute bottom-3 left-[13px] top-3 w-0.5 bg-ink/15" aria-hidden="true" />
                        {STEPS.map((s) => (
                            <li key={s.label} className="relative flex items-center gap-3">
                                <span
                                    className={
                                        s.done
                                            ? "z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-ink bg-workshop text-white"
                                            : s.active
                                                ? "z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-ink bg-signal text-white"
                                                : "z-10 h-[26px] w-[26px] rounded-full border-2 border-ink/25 bg-white"
                                    }
                                >
                                    {s.done && <Check size={14} strokeWidth={3} />}
                                    {s.active && <Wrench size={12} strokeWidth={3} />}
                                </span>
                                <span className={`flex-1 text-sm font-semibold ${s.done || s.active ? "text-ink" : "text-ink/40"}`}>{s.label}</span>
                                <span className="font-mono text-xs text-ink-soft">{s.time}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-6 flex items-center justify-between rounded-xl border-2 border-ink bg-paper px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-workshop font-bold text-white">R</span>
                            <div className="leading-tight">
                                <p className="text-sm font-bold">Rahim U.</p>
                                <p className="text-xs text-ink-soft">Your technician</p>
                            </div>
                        </div>
                        <span className="font-mono text-sm font-bold">$60</span>
                    </div>
                </div>
            </div>

            {/* stickers */}
            <span className="absolute -bottom-5 left-4 hidden rotate-[-4deg] items-center gap-1.5 rounded-lg border-2 border-ink bg-mustard px-3 py-1.5 text-xs font-bold shadow-hard-sm sm:inline-flex">
                <BadgeCheck size={15} /> Verified technician
            </span>
            <span className="absolute -bottom-4 -right-3 inline-flex rotate-[5deg] items-center gap-1.5 rounded-lg border-2 border-ink bg-signal px-3 py-1.5 text-xs font-bold text-white shadow-hard-sm">
                <CreditCard size={15} /> Pay after it&apos;s fixed
            </span>
        </div>
    );
}

export default function Hero() {
    return (
        <section className="bg-blueprint relative overflow-hidden border-b-2 border-ink">
            <div className="container-x grid items-center gap-14 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-24">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-workshop" /> Repair desk for Dhaka &amp; beyond
                    </span>

                    <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl xl:text-6xl">
                        Broken Device? Get It{" "}
                        <span className="relative inline-block text-signal">
                            Fixed
                            <svg viewBox="0 0 200 18" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                                <path d="M3 13 C40 3 80 3 110 9 S170 16 197 5" fill="none" stroke="#14211f" strokeWidth="5" strokeLinecap="round" />
                            </svg>
                        </span>{" "}
                        by Verified Technicians
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                        Book a trusted technician for your phone, laptop, AC or fridge, follow every step of the job,
                        and pay online only when the work is done.
                    </p>

                    <form action="/services" className="mt-8 flex max-w-xl items-center gap-2 rounded-xl border-2 border-ink bg-white p-2 shadow-hard">
                        <Search size={20} className="ml-2 shrink-0 text-ink-soft" />
                        <input
                            name="search"
                            placeholder="What needs fixing? e.g. iPhone screen"
                            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-ink-soft/60"
                            aria-label="Search repair services"
                        />
                        <button type="submit" className="btn-primary shrink-0">Find a fix</button>
                    </form>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-ink-soft">Popular:</span>
                        {QUICK.map((q) => (
                            <Link key={q} href={`/services?search=${encodeURIComponent(q.split(" ")[0])}`} className="rounded-full border border-ink/25 bg-white/70 px-3 py-1 font-medium hover:border-ink">
                                {q}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="pb-6 lg:pb-0">
                    <JobTicket />
                </div>
            </div>
        </section>
    );
}