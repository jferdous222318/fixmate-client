import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

export default function Categories() {
    return (
        <section className="border-y-2 border-ink bg-ink py-20 text-paper">
            <div className="container-x">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-mustard">Popular categories</p>
                        <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">What can we fix for you?</h2>
                    </div>
                    <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-mustard hover:underline">
                        See every service <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {CATEGORIES.map((c, i) => {
                        const { icon: Icon, blurb } = CATEGORY_META[c];
                        return (
                            <Link
                                key={c}
                                href={`/services?category=${encodeURIComponent(c)}`}
                                className="group flex flex-col rounded-xl border-2 border-paper/20 bg-paper/[0.04] p-5 transition hover:-translate-y-1 hover:border-signal hover:bg-signal"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-paper/30 bg-paper text-ink group-hover:border-ink">
                                        <Icon size={22} />
                                    </span>
                                    <span className="font-mono text-xs text-paper/40 group-hover:text-white/80">0{i + 1}</span>
                                </div>
                                <h3 className="mt-5 font-display text-lg font-bold">{c}</h3>
                                <p className="mt-1 text-xs leading-relaxed text-paper/60 group-hover:text-white/90">{blurb}</p>
                            </Link>
                        );
                    })}
                    <Link href="/services" className="flex flex-col items-start justify-between rounded-xl border-2 border-dashed border-mustard/60 p-5 text-mustard transition hover:bg-mustard hover:text-ink">
                        <span className="font-display text-lg font-bold">Not sure?</span>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Browse all <ArrowRight size={16} /></span>
                    </Link>
                </div>
            </div>
        </section>
    );
}