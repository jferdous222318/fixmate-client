import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSession, roleOf } from "@/lib/session";

export const metadata = { title: { default: "Dashboard", template: "%s | FixMate Dashboard" } };

// Separate layout for every /dashboard route: sidebar + top bar, no public footer.
// The session is read on the server, so reloading a private page keeps the user logged in.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/sign-in");

    const user = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: roleOf(session.user),
    };

    return (
        <Suspense>
            <DashboardShell user={user}>{children}</DashboardShell>
        </Suspense>
    );
}