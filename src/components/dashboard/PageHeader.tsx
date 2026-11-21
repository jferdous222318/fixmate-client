export default function PageHeader({
    title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
    return (
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

// white panel with a heading, used to frame charts and tables
export function Panel({ title, children, className = "", action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
    return (
        <section className={`rounded-xl border-2 border-ink bg-white ${className}`}>
            {title && (
                <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 px-5 py-3.5">
                    <h2 className="font-display text-base font-bold">{title}</h2>
                    {action}
                </div>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}