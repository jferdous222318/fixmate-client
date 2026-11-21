import Link from "next/link";
import { ArrowUpRight, House, MapPin, Store, UserRound } from "lucide-react";
import type { Service } from "@/lib/types";
import { CATEGORY_META } from "@/lib/constants";
import { money } from "@/lib/format";

// Equal height + width: the grid stretches each card, the body is flex-col and the
// button is pushed to the bottom with mt-auto, the image always has the same ratio.
export default function ServiceCard({ service }: { service: Service }) {
    const Icon = CATEGORY_META[service.category]?.icon;
    const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-white shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard">
            <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-paper-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border-2 border-ink bg-paper px-2 py-0.5 text-xs font-bold">
                    {Icon && <Icon size={13} />} {service.category}
                </span>
                {/* price tag sticker */}
                <span className="absolute -bottom-px right-3 rounded-t-lg border-2 border-b-0 border-ink bg-signal px-3 py-1 font-mono text-sm font-bold text-white">
                    from {money(service.basePrice)}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug">{service.title}</h3>

                <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                    <li className="flex items-center gap-2"><ModeIcon size={15} className="shrink-0 text-workshop" /> {service.serviceMode}</li>
                    <li className="flex items-center gap-2"><MapPin size={15} className="shrink-0 text-workshop" /> <span className="truncate">{service.serviceArea}</span></li>
                    <li className="flex items-center gap-2"><UserRound size={15} className="shrink-0 text-workshop" /> <span className="truncate">{service.technicianName}</span></li>
                </ul>

                <div className="mt-auto pt-5">
                    <Link href={`/services/${service._id}`} className="btn-dark w-full">
                        View Details <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
}