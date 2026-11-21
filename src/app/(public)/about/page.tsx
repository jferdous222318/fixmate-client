import Link from "next/link";
import {
    ArrowRight, BadgeCheck, CircleCheck, CircleX, ClipboardList, CreditCard, Hammer, Layers, Send, ShieldCheck, Users, Wrench,
} from "lucide-react";

export const metadata = { title: "How It Works" };

const PIPELINE = [
    { label: "Requested", color: "bg-blue-100 text-blue-800 border-blue-300", who: "Customer sends the request" },
    { label: "Accepted", color: "bg-indigo-100 text-indigo-800 border-indigo-300", who: "Technician accepts the job" },
    { label: "In Progress", color: "bg-amber-100 text-amber-800 border-amber-300", who: "Technician starts the work" },
    { label: "Completed", color: "bg-green-100 text-green-800 border-green-300", who: "Technician sets the final amount" },
    { label: "Paid", color: "bg-ink text-paper border-ink", who: "Customer pays with Stripe" },
];

const ROLES = [
    {
        icon: Wrench, title: "For Customers", tone: "bg-mustard",
        items: ["Browse approved services by category, area and price", "Send a request with your address and preferred date", "Cancel any time while the request is still pending", "Pay online only after the job is completed"],
    },
    {
        icon: Hammer, title: "For Technicians", tone: "bg-workshop text-white",
        items: ["List services with photos, prices and your service area", "Accept or reject incoming requests", "Move each job forward and set the final amount", "See your earnings and job stats on charts"],
    },
    {
        icon: ShieldCheck, title: "For Admins", tone: "bg-signal text-white",
        items: ["Approve or reject every new or edited service", "Manage user roles across the platform", "Monitor all repair jobs and their status", "Track every Stripe transaction and revenue"],
    },
];

const FAQ = [
    { q: "When do I pay?", a: "Only after the technician marks your job as completed. A Pay Now button then appears in My Bookings and you pay through Stripe Checkout." },
    { q: "Can I cancel a request?", a: "Yes, while the request is still in the Requested stage. Once a technician accepts it, the job is in their hands." },
    { q: "Why can I not see a service I added?", a: "New and edited services wait for admin approval. Hidden (unavailable) services are also removed from public pages." },
    { q: "Can the final price differ from the base price?", a: "The base price is a starting price. The technician confirms the final amount when completing the job, and that is what you pay." },
];

export default function AboutPage() {
    return (
        <>
            <section className="bg-blueprint border-b-2 border-ink">
                <div className="container-x py-16 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">How it works</p>
                    <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
                        One clear path for every repair job
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
                        People struggle to find a trustworthy technician and have no idea what is happening after handing over a device.
                        FixMate gives every job a visible status, and payment happens only after the work is delivered.
                    </p>
                </div>
            </section>

            {/* pipeline */}
            <section className="container-x py-20">
                <h2 className="section-title">The job status pipeline</h2>
                <p className="section-sub">Every booking moves forward one stage at a time. Our server rejects any jump that skips a step.</p>

                <ol className="mt-10 grid gap-4 md:grid-cols-5">
                    {PIPELINE.map((s, i) => (
                        <li key={s.label} className="relative rounded-xl border-2 border-ink bg-white p-5">
                            <span className="font-mono text-xs font-bold text-ink-soft">STAGE {i + 1}</span>
                            <span className={`mt-3 block w-fit rounded-md border px-2.5 py-1 text-sm font-bold ${s.color}`}>{s.label}</span>
                            <p className="mt-3 text-sm text-ink-soft">{s.who}</p>
                            {i < PIPELINE.length - 1 && (
                                <ArrowRight size={20} className="absolute -right-[18px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full border-2 border-ink bg-paper md:block" />
                            )}
                        </li>
                    ))}
                </ol>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <p className="flex items-start gap-3 rounded-xl border-2 border-dashed border-red-300 bg-red-50 p-4 text-sm">
                        <CircleX size={20} className="shrink-0 text-red-600" />
                        <span><b>Rejected:</b> a technician can decline a request while it is still Requested.</span>
                    </p>
                    <p className="flex items-start gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-sm">
                        <CircleCheck size={20} className="shrink-0 text-gray-600" />
                        <span><b>Cancelled:</b> a customer can cancel their own request while it is still Requested.</span>
                    </p>
                </div>
            </section>

            {/* roles */}
            <section className="border-y-2 border-ink bg-paper-dark py-20">
                <div className="container-x">
                    <h2 className="section-title">Built for three kinds of people</h2>
                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {ROLES.map(({ icon: Icon, title, tone, items }) => (
                            <div key={title} className="flex flex-col rounded-2xl border-2 border-ink bg-white shadow-hard-sm">
                                <div className={`flex items-center gap-3 rounded-t-[14px] border-b-2 border-ink px-6 py-4 ${tone}`}>
                                    <Icon size={22} /> <h3 className="text-xl font-bold">{title}</h3>
                                </div>
                                <ul className="space-y-3 p-6">
                                    {items.map((it) => (
                                        <li key={it} className="flex items-start gap-2.5 text-sm">
                                            <BadgeCheck size={17} className="mt-0.5 shrink-0 text-workshop" /> {it}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* numbers that describe the platform */}
            <section className="container-x py-20">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Layers, title: "7 categories", text: "Phones to wiring" },
                        { icon: Send, title: "1 request form", text: "Phone, address, date, problem" },
                        { icon: ClipboardList, title: "6 job statuses", text: "Always know where it is" },
                        { icon: CreditCard, title: "0 upfront", text: "Pay after completion" },
                    ].map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-4 rounded-xl border-2 border-ink bg-white p-5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-mustard"><Icon size={22} /></span>
                            <div>
                                <p className="font-display text-lg font-bold">{title}</p>
                                <p className="text-sm text-ink-soft">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="section-title mt-20">Questions people ask</h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {FAQ.map((f) => (
                        <details key={f.q} className="group rounded-xl border-2 border-ink bg-white p-5 open:shadow-hard-sm">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                                {f.q}
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-ink font-mono transition group-open:rotate-45">+</span>
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                        </details>
                    ))}
                </div>

                <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border-2 border-ink bg-workshop p-10 text-center text-white shadow-hard">
                    <Users size={34} />
                    <h2 className="font-display text-3xl font-extrabold">Ready to get started?</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/services" className="btn bg-white text-ink">Find a repair</Link>
                        <Link href="/sign-up" className="btn-primary">Create an account</Link>
                    </div>
                </div>
            </section>
        </>
    );
}