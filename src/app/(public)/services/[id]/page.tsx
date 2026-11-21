import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock, House, MapPin, ShieldCheck, Store, Tag } from "lucide-react";
import RequestRepair from "@/components/services/RequestRepair";
import { getPublic } from "@/lib/server-api";
import { getSession, roleOf } from "@/lib/session";
import { CATEGORY_META } from "@/lib/constants";
import { money } from "@/lib/format";
import type { ServiceDetails } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
    const service = await getPublic<ServiceDetails>(`/api/services/${(await params).id}`);
    return { title: service?.title ?? "Service" };
}

export default async function ServiceDetailsPage({ params }: Props) {
    const { id } = await params;
    // the API only returns approved + available services; anything else -> 404 page
    const [service, session] = await Promise.all([getPublic<ServiceDetails>(`/api/services/${id}`), getSession()]);
    if (!service) notFound();

    const viewer = session
        ? {
            name: session.user.name,
            email: session.user.email,
            role: roleOf(session.user),
            phone: session.user.phone ?? "",
            area: session.user.area ?? "",
        }
        : null;

    const Icon = CATEGORY_META[service.category]?.icon;
    const tech = service.technician;
    const facts = [
        { icon: Tag, label: "Starting price", value: money(service.basePrice) },
        { icon: Clock, label: "Estimated duration", value: service.estimatedDuration },
        { icon: service.serviceMode === "Home Visit" ? House : Store, label: "Service mode", value: service.serviceMode },
        { icon: MapPin, label: "Service area", value: service.serviceArea },
    ];

    return (
        <section className="container-x py-10">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-ink">
                <ArrowLeft size={16} /> Back to services
            </Link>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                {/* left: image + description */}
                <div>
                    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-paper-dark shadow-hard">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={service.image} alt={service.title} className="aspect-[16/9] w-full object-cover" />
                    </div>

                    <span className="mt-8 inline-flex items-center gap-1.5 rounded-md border-2 border-ink bg-mustard px-2.5 py-1 text-xs font-bold">
                        {Icon && <Icon size={14} />} {service.category}
                    </span>
                    <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{service.title}</h1>

                    <h2 className="mt-8 text-xl font-bold">What this service includes</h2>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{service.description}</p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {["Admin-approved listing", "Pay only after completion", "Live status tracking"].map((t) => (
                            <p key={t} className="flex items-center gap-2 rounded-lg border-2 border-ink/15 bg-white px-3 py-2.5 text-sm font-semibold">
                                <ShieldCheck size={16} className="shrink-0 text-workshop" /> {t}
                            </p>
                        ))}
                    </div>
                </div>

                {/* right: booking card + technician */}
                <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-hard">
                        <p className="text-sm font-semibold text-ink-soft">Starting from</p>
                        <p className="font-mono text-4xl font-bold">{money(service.basePrice)}</p>
                        <p className="mt-1 text-xs text-ink-soft">Final amount is confirmed by the technician when the job is completed.</p>

                        <dl className="mt-6 divide-y-2 divide-dashed divide-ink/10 border-y-2 border-dashed border-ink/10">
                            {facts.map(({ icon: FIcon, label, value }) => (
                                <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
                                    <dt className="flex items-center gap-2 text-ink-soft"><FIcon size={16} className="text-workshop" /> {label}</dt>
                                    <dd className="text-right font-bold">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6">
                            <RequestRepair serviceId={service._id} serviceTitle={service.title} viewer={viewer} />
                        </div>
                    </div>

                    <div className="rounded-2xl border-2 border-ink bg-paper-dark p-6">
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Your technician</p>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-workshop text-2xl font-bold text-white">
                                {tech?.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={tech.image} alt={tech.name} className="h-full w-full object-cover" />
                                ) : (
                                    (tech?.name ?? service.technicianName)[0]
                                )}
                            </span>
                            <div>
                                <p className="flex items-center gap-1.5 font-display text-lg font-bold">
                                    {tech?.name ?? service.technicianName} <BadgeCheck size={18} className="text-workshop" />
                                </p>
                                <p className="flex items-center gap-1 text-sm text-ink-soft"><MapPin size={14} /> {tech?.area || service.serviceArea}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                            {tech?.bio || "This technician has not added a bio yet."}
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}