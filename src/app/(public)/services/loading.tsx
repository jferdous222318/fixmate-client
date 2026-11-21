import { CardGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <>
            <section className="bg-blueprint border-b-2 border-ink">
                <div className="container-x space-y-3 py-12">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-80 max-w-full" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
            </section>
            <section className="container-x py-10">
                <Skeleton className="mb-8 h-16 w-full" />
                <CardGridSkeleton />
            </section>
        </>
    );
}