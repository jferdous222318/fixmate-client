import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";
import { getSession, roleOf, safeRedirect } from "@/lib/session";

export const metadata = { title: "Sign Up" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    const target = safeRedirect((await searchParams).redirect);
    const session = await getSession();
    // logged-in users never see the form
    if (session) redirect(target || `/dashboard/${roleOf(session.user)}`);

    return (
        <AuthShell eyebrow="Create your account" title="Join FixMate" subtitle="Pick how you want to use FixMate. It takes less than a minute.">
            <SignUpForm redirectTo={target} />
        </AuthShell>
    );
}