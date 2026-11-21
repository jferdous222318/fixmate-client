import { CreditCard, Search, Send, Wrench } from "lucide-react";

const STEPS = [
    { icon: Search, title: "Find a Service", text: "Search by device or category and compare approved technicians, prices and service areas." },
    { icon: Send, title: "Send a Request", text: "Describe the problem, pick a date and share your address. The technician gets it instantly." },
    { icon: Wrench, title: "Technician Fixes It", text: "Follow the job live as it moves from Accepted to In Progress to Completed." },
    { icon: CreditCard, title: "Pay After Completion", text: "Only when the job is completed do you pay, securely through Stripe." },
];

export default function HowItWorks() {
    return (
        <section className="container-x py-20" id="how-it-works">
            <div className="max-w-2xl">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">How FixMate works</p>
                <h2 className="section-title mt-2">From broken to fixed in four steps</h2>
                <p className="section-sub">A clear, trackable flow for every repair, with no payment until the job is done.</p>
            </div>

            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map(({ icon: Icon, title, text }, i) => (
                    <li key={title} className="relative">
                        {/* dashed connector between steps on desktop */}
                        {i < STEPS.length - 1 && (
                            <span className="absolute left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] top-8 hidden border-t-2 border-dashed border-ink/40 lg:block" aria-hidden="true" />
                        )}
                        <div className="flex h-full flex-col items-center rounded-xl border-2 border-ink bg-white p-6 text-center shadow-hard-sm">
                            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-paper">
                                <Icon size={26} />
                                <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-signal font-mono text-xs font-bold text-white">
                                    {i + 1}
                                </span>
                            </span>
                            <h3 className="mt-5 text-lg font-bold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}