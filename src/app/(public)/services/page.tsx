import { Suspense } from "react";
import { CircleExclamationPoint, SearchX } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import Pagination from "@/components/services/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { getPublic } from "@/lib/server-api";
import type { ServicesPage } from "@/lib/types";

export const metadata = { title: "Browse Services" };

type Search = { search?: string; category?: string; mode?: string; sort?: string; page?: string };

export default async function ServicesPageRoute({ searchParams }: { searchParams: Promise<Search> }) {
    const sp = await searchParams;

    // every filter is forwarded to Express -> MongoDB (no client-side .filter())
    const q = new URLSearchParams();
    (["search", "category", "mode", "sort", "page"] as const).forEach((k) => sp[k] && q.set(k, sp[k]!));
    q.set("limit", "12");

    const data = await getPublic<ServicesPage>(`/api/services?${q.toString()}`);
    const services = data?.services ?? [];

    return (
        <>
            <section className="bg-blueprint border-b-2 border-ink">
                <div className="container-x py-12">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">The repair board</p>
                    <h1 className="section-title mt-2">Browse Repair Services</h1>
                    <p className="section-sub">Every listing below is approved by our admin team and offered by a verified technician.</p>
                </div>
            </section>

            <section className="container-x py-10">
                <Suspense>
                    <ServiceFilters />
                </Suspense>

                <div className="mt-8 flex items-center justify-between text-sm">
                    <p className="font-semibold text-ink-soft">
                        {data ? (
                            <>
                                Showing <span className="font-mono text-ink">{services.length}</span> of{" "}
                                <span className="font-mono text-ink">{data.total}</span> services
                                {sp.category && <> in <span className="text-ink">{sp.category}</span></>}
                            </>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-red-600"><CircleExclamationPoint size={14} /> Could not reach the service list</span>
                        )}
                    </p>
                </div>

                {services.length ? (
                    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {services.map((s) => <ServiceCard key={s._id} service={s} />)}
                    </div>
                ) : (
                    <div className="mt-5">
                        <EmptyState
                            icon={SearchX}
                            title="No services match your search"
                            text="Try another keyword, pick a different category, or clear the filters to see everything."
                            action={{ href: "/services", label: "Clear filters" }}
                        />
                    </div>
                )}

                {data && <Pagination page={data.page} pages={data.pages} params={sp} />}
            </section>
        </>
    );
}