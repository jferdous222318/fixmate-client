import { requireRole } from "@/lib/session";

// only admins may open /dashboard/admin/*; other roles are sent to their own dashboard
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireRole("admin");
    return <>{children}</>;
}