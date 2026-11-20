import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type Props = {
    title: string;
    text?: string;
    icon?: LucideIcon;
    action?: { href: string; label: string };
    children?: React.ReactNode;
};

export default function EmptyState({ title, text, icon: Icon = Inbox, action, children }: Props) {
    return (
        <div className="bg-blueprint flex flex-col items-center rounded-xl border-2 border-dashed border-ink/30 px-6 py-14 text-center">
            <span className="flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-xl border-2 border-ink bg-mustard shadow-hard-sm">
                <Icon size={28} />
            </span>
            <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
            {text && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{text}</p>}
            {action && (
                <Link href={action.href} className="btn-primary mt-6">
                    {action.label}
                </Link>
            )}
            {children}
        </div>
    );
}