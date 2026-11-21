import Link from "next/link";
import { ArrowRight, Hammer, PackageSearch } from "lucide-react";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import ServiceCard from "@/components/services/ServiceCard";
import EmptyState from "@/components/ui/EmptyState";
import { getPublic } from "@/lib/server-api";
import type { ServicesPage } from "@/lib/types";

export default async function Home() {
    // 6 latest approved + available services (server sorts by createdAt desc, limit 6)
    const [featured, stats] = await Promise.all([
        getPublic<ServicesPage>("/api/services?sort=newest&limit=6"),
        getPublic<{ technicians: number; services: number; completedJobs: number }>("/api/stats/public"),
    ]);
    const services = featured?.services ?? [];

    return (
        <>
            <Hero />

            {/* featured services */}
            <section className="container-x py-20">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">Fresh on the board</p>
                        <h2 className="section-title mt-2">Featured Repair Services</h2>
                        <p className="section-sub">The latest services approved by our team, ready to book today.</p>
                    </div>
                    <Link href="/services" className="btn-ghost shrink-0">View all services <ArrowRight size={16} /></Link>
                </div>

                {services.length ? (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s) => <ServiceCard key={s._id} service={s} />)}
                    </div>
                ) : (
                    <div className="mt-10">
                        <EmptyState icon={PackageSearch} title="No services listed yet" text="Technicians are setting up shop. Check back soon." />
                    </div>
                )}
            </section>

            <HowItWorks />
            <Categories />
            <WhyChoose stats={stats} />

            {/* technician CTA */}
            <section className="container-x pb-4">
                <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-signal p-8 text-white shadow-hard sm:p-12">
                    <Hammer size={180} className="absolute -right-6 -top-6 rotate-12 text-white/10" aria-hidden="true" />
                    <div className="relative max-w-2xl">
                        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Are you a skilled technician?</h2>
                        <p className="mt-3 text-white/85">List your repair services, receive jobs from nearby customers and get paid online, all from one dashboard.</p>
                        <Link href="/sign-up" className="btn mt-7 bg-white text-ink">Join as a Technician <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>
        </>
    );
}