import { BadgeCheck, CreditCard, Timer } from "lucide-react";

// Split layout for sign in / sign up: a "job ticket" panel on the left, the form on the right
export default function AuthShell({
    eyebrow, title, subtitle, children,
}: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <section className="bg-blueprint">
            <div className="container-x grid items-stretch gap-8 py-12 lg:grid-cols-[1fr_1.1fr] lg:py-16">
                {/* left: brand panel */}
                <div className="relative hidden overflow-hidden rounded-2xl border-2 border-ink bg-ink p-10 text-paper shadow-hard lg:flex lg:flex-col">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-mustard">Repair ticket #0001</p>
                    <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                        Every repair, <span className="text-signal">tracked</span> from drop-off to done.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
                        Join FixMate as a customer to get things fixed, or as a technician to grow your repair business.
                    </p>

                    <div className="mt-auto space-y-3 pt-10">
                        {[
                            { icon: BadgeCheck, text: "Technicians verified by our admin team" },
                            { icon: Timer, text: "Live job status: Requested → Completed" },
                            { icon: CreditCard, text: "Pay securely only after the job is done" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 rounded-lg border border-paper/15 bg-paper/5 px-4 py-3 text-sm">
                                <Icon size={18} className="shrink-0 text-mustard" /> {text}
                            </div>
                        ))}
                    </div>

                    {/* perforated ticket edge */}
                    <div className="pointer-events-none absolute -right-3 top-0 flex h-full flex-col justify-around" aria-hidden="true">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <span key={i} className="h-5 w-5 rounded-full bg-paper" />
                        ))}
                    </div>
                </div>

                {/* right: form */}
                <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-hard sm:p-10">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">{eyebrow}</p>
                    <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h1>
                    <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </section>
    );
}