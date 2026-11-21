import { BadgeCheck, CreditCard, Quote, ScanSearch, ShieldCheck } from "lucide-react";

type Stats = { technicians: number; services: number; completedJobs: number } | null;

const POINTS = [
    { icon: BadgeCheck, title: "Verified technicians", text: "Every listing is reviewed by an admin before customers can see it." },
    { icon: ScanSearch, title: "Track every step", text: "Requested, Accepted, In Progress, Completed: no more guessing." },
    { icon: CreditCard, title: "Pay after service", text: "Nothing is charged until the technician marks your job completed." },
    { icon: ShieldCheck, title: "Secure checkout", text: "Card payments run through Stripe. We never see your card details." },
];

const TESTIMONIALS = [
    { name: "Sadia K.", area: "Mohammadpur", text: "My fridge stopped cooling on a Friday. I could see the technician accept the job and only paid once it was cold again." },
    { name: "Arif H.", area: "Uttara", text: "Laptop servicing was quick, and the final price matched what I was told. The status updates made it stress-free." },
    { name: "Nabila R.", area: "Banani", text: "Booked an AC wash for my office. Clear pricing, and paying online after the work felt fair." },
];

export default function WhyChoose({ stats }: { stats: Stats }) {
    const figures = [
        { value: stats?.technicians, label: "Verified technicians" },
        { value: stats?.services, label: "Live repair services" },
        { value: stats?.completedJobs, label: "Jobs completed" },
        { value: "0%", label: "Paid before the work" },
    ];

    return (
        <section className="container-x py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
                <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">Why choose us</p>
                    <h2 className="section-title mt-2">Repairs you can actually keep an eye on</h2>
                    <p className="section-sub">FixMate puts both sides of a repair on the same page, so customers stay informed and technicians stay organised.</p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {figures.map((f) => (
                            <div key={f.label} className="rounded-xl border-2 border-ink bg-white p-5">
                                <p className="font-mono text-3xl font-bold text-workshop">{f.value ?? "—"}{typeof f.value === "number" ? "+" : ""}</p>
                                <p className="mt-1 text-sm font-semibold text-ink-soft">{f.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {POINTS.map(({ icon: Icon, title, text }, i) => (
                        <div key={title} className={`rounded-xl border-2 border-ink p-6 ${i === 0 ? "bg-mustard" : i === 3 ? "bg-workshop text-white" : "bg-paper-dark"}`}>
                            <Icon size={26} />
                            <h3 className="mt-4 text-lg font-bold">{title}</h3>
                            <p className={`mt-2 text-sm leading-relaxed ${i === 3 ? "text-white/80" : "text-ink-soft"}`}>{text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* testimonials */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                    <figure key={t.name} className="flex flex-col rounded-xl border-2 border-ink bg-white p-6 shadow-hard-sm">
                        <Quote size={26} className="text-signal" />
                        <blockquote className="mt-3 flex-1 text-sm leading-relaxed">{t.text}</blockquote>
                        <figcaption className="mt-5 flex items-center gap-3 border-t-2 border-dashed border-ink/15 pt-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper font-bold">{t.name[0]}</span>
                            <span className="leading-tight">
                                <span className="block text-sm font-bold">{t.name}</span>
                                <span className="text-xs text-ink-soft">{t.area}, Dhaka</span>
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}