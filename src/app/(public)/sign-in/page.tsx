import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { getSession, roleOf, safeRedirect } from "@/lib/session";

export const metadata = { title: "Sign In" };

type Search = { redirect?: string; registered?: string };

export default async function SignInPage({ searchParams }: { searchParams: Promise<Search> }) {
    const sp = await searchParams;
    const target = safeRedirect(sp.redirect);
    const session = await getSession();
    // logged-in users never see the form
    if (session) redirect(target || `/dashboard/${roleOf(session.user)}`);

    return (
        <AuthShell eyebrow="Welcome back" title="Sign in to FixMate" subtitle="Track your repairs, manage jobs and payments in one place.">
            <SignInForm redirectTo={target} registered={sp.registered === "1"} />
        </AuthShell>
    );
}