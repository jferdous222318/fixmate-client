import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <section className="container-x py-10">
            <Skeleton className="h-4 w-32" />
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-4">
                    <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-[420px] w-full rounded-2xl" />
            </div>
        </section>
    );
}