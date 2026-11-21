import { requireRole } from "@/lib/session";

// only technicians may open /dashboard/technician/*; other roles are sent to their own dashboard
export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
    await requireRole("technician");
    return <>{children}</>;
}