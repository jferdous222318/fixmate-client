"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";
import { Check, Hammer, UserPlus, Wrench } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/ui/Spinner";
import PasswordInput from "./PasswordInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RULES = [
    { test: (p: string) => p.length >= 6, text: "At least 6 characters" },
    { test: (p: string) => /[A-Z]/.test(p), text: "One uppercase letter" },
    { test: (p: string) => /[a-z]/.test(p), text: "One lowercase letter" },
];

const ROLES = [
    { value: "customer", title: "Customer", text: "I need something repaired", icon: Wrench },
    { value: "technician", title: "Technician", text: "I offer repair services", icon: Hammer },
] as const;

export default function SignUpForm({ redirectTo }: { redirectTo: string | null }) {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "customer" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const next: Record<string, string> = {};
        if (form.name.trim().length < 2) next.name = "Full name is required";
        if (!form.email.trim()) next.email = "Email is required";
        else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
        const failed = RULES.filter((r) => !r.test(form.password));
        if (failed.length) next.password = `Password needs: ${failed.map((r) => r.text.toLowerCase()).join(", ")}`;
        if (!form.confirm) next.confirm = "Please retype your password";
        else if (form.confirm !== form.password) next.confirm = "Passwords do not match";
        if (!["customer", "technician"].includes(form.role)) next.role = "Choose a role";
        return next;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        const { error } = await authClient.signUp.email({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: form.role, // the server hook forces anything else to "customer"
        });
        setLoading(false);

        if (error) {
            toast.error(error.message || "Sign up failed");
            return;
        }

        // autoSignIn is off, so the new user signs in on the next page
        toast.success("Account created! Please sign in.");
        const q = new URLSearchParams({ registered: "1" });
        if (redirectTo) q.set("redirect", redirectTo);
        router.replace(`/sign-in?${q.toString()}`);
    };

    const matches = form.confirm.length > 0 && form.confirm === form.password;

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <fieldset>
                <legend className="label">I am joining as</legend>
                <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(({ value, title, text, icon: Icon }) => {
                        const active = form.role === value;
                        return (
                            <label
                                key={value}
                                className={clsx(
                                    "relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition",
                                    active ? "border-ink bg-mustard/40 shadow-hard-sm" : "border-ink/25 bg-white hover:border-ink/60"
                                )}
                            >
                                <input type="radio" name="role" value={value} checked={active} onChange={set("role")} className="sr-only" />
                                <Icon size={22} className={active ? "text-ink" : "text-ink-soft"} />
                                <span className="font-display text-base font-bold">{title}</span>
                                <span className="text-xs text-ink-soft">{text}</span>
                                {active && (
                                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-paper">
                                        <Check size={13} strokeWidth={3} />
                                    </span>
                                )}
                            </label>
                        );
                    })}
                </div>
                {errors.role && <p className="error-text">{errors.role}</p>}
            </fieldset>

            <div>
                <label className="label" htmlFor="name">Full Name</label>
                <input id="name" className="input" autoComplete="name" placeholder="e.g. Tanvir Hasan" value={form.name} onChange={set("name")} />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
                <label className="label" htmlFor="password">Password</label>
                <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={set("password")} />
                <ul className="mt-2 grid gap-1 sm:grid-cols-3">
                    {RULES.map((r) => {
                        const ok = r.test(form.password);
                        return (
                            <li key={r.text} className={clsx("flex items-center gap-1.5 text-xs font-medium", ok ? "text-green-700" : "text-ink-soft")}>
                                <span className={clsx("flex h-3.5 w-3.5 items-center justify-center rounded-full border", ok ? "border-green-700 bg-green-700 text-white" : "border-ink/30")}>
                                    {ok && <Check size={9} strokeWidth={4} />}
                                </span>
                                {r.text}
                            </li>
                        );
                    })}
                </ul>
                {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <div>
                <label className="label" htmlFor="confirm">Confirm Password</label>
                <PasswordInput id="confirm" autoComplete="new-password" placeholder="Retype your password" value={form.confirm} onChange={set("confirm")} />
                {errors.confirm ? (
                    <p className="error-text">{errors.confirm}</p>
                ) : (
                    matches && <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-700"><Check size={12} strokeWidth={3} /> Passwords match</p>
                )}
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? <Spinner size={18} /> : <UserPlus size={18} />} Create Account
            </button>

            <p className="text-center text-sm text-ink-soft">
                Already have an account?{" "}
                <Link href={redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in"} className="font-bold text-workshop underline underline-offset-4">
                    Sign in
                </Link>
            </p>
        </form>
    );
}