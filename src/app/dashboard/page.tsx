import { redirect } from "next/navigation";
import { getSession, roleOf } from "@/lib/session";

// /dashboard -> the dashboard of the logged-in role
export default async function DashboardIndex() {
    const session = await getSession();
    if (!session) redirect("/sign-in");
    redirect(`/dashboard/${roleOf(session.user)}`);
}