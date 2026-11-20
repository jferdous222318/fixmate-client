export function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-paper-dark ${className}`} />;
}

export function CardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border-2 border-ink/20 bg-white">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-4 h-10 w-full" />
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3 rounded-xl border-2 border-ink/20 bg-white p-4">
            <Skeleton className="h-9 w-full" />
            {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
    );
}