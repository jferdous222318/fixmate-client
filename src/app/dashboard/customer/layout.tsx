import { requireRole } from "@/lib/session";

// only customers may open /dashboard/customer/*; other roles are sent to their own dashboard
export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    await requireRole("customer");
    return <>{children}</>;
}