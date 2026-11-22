"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import PasswordInput from "./PasswordInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ redirectTo, registered }: { redirectTo: string | null; registered: boolean }) {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: "" }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!form.email.trim()) next.email = "Email is required";
        else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
        if (!form.password) next.password = "Password is required";
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;

        setLoading(true);
        const { data, error } = await authClient.signIn.email({
            email: form.email.trim().toLowerCase(),
            password: form.password,
        });
        setLoading(false);

        if (error) {
            // show the real reason instead of a vague message
            if (error.status === 401) toast.error("Wrong email or password");
            else if (error.status === 429) toast.error("Too many attempts. Please wait a minute and try again.");
            else if (error.status === 403) toast.error(error.message || "This address is not allowed to sign in");
            else toast.error(error.message || `Sign in failed (${error.status ?? "network error"})`);
            return;
        }

        clearToken();
        const role = (data?.user as { role?: string })?.role || "customer";
        toast.success(`Welcome back, ${data?.user.name?.split(" ")[0] ?? "there"}!`);
        // back to the page they were trying to open, otherwise their own dashboard
        router.replace(redirectTo || `/dashboard/${role}`);
        router.refresh();
    };

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            {registered && (
                <p className="flex items-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-800">
                    <CircleCheck size={17} /> Account created. Sign in to continue.
                </p>
            )}
            <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" autoComplete="email" placeholder="you@example.com"
                    value={form.email} onChange={set("email")} />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
                <label className="label" htmlFor="password">Password</label>
                <PasswordInput id="password" autoComplete="current-password" placeholder="Your password"
                    value={form.password} onChange={set("password")} />
                {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? <Spinner size={18} /> : <LogIn size={18} />} Sign In
            </button>

            <p className="text-center text-sm text-ink-soft">
                New to FixMate?{" "}
                <Link href={redirectTo ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}` : "/sign-up"} className="font-bold text-workshop underline underline-offset-4">
                    Create an account
                </Link>
            </p>
        </form>
    );
}