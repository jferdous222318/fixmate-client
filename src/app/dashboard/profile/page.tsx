"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";
import { Lock, Save } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ImageUpload from "@/components/forms/ImageUpload";
import Spinner, { PageLoader } from "@/components/ui/Spinner";
import { authClient } from "@/lib/auth-client";
import { api, errorMessage } from "@/lib/api";
import { ROLE_BADGE } from "@/lib/constants";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    if (isPending || !session) return <PageLoader />;
    // the form mounts once the session is ready, so its initial state comes straight from it
    return <ProfileForm key={session.user.id} />;
}

function ProfileForm() {
    const router = useRouter();
    const { data: session, refetch } = authClient.useSession();
    const u = session!.user;
    const [form, setForm] = useState({ name: u.name ?? "", phone: u.phone ?? "", area: u.area ?? "", bio: u.bio ?? "", image: u.image ?? "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const role = (u.role as string) || "customer";

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: "" }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";
        if (form.phone.trim() && !/^[+\d][\d\s-]{6,19}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
        if (form.bio.length > 400) next.bio = "Bio must be 400 characters or fewer";
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;

        setSaving(true);
        try {
            await api("/api/users/profile", { method: "PATCH", body: form });
            await refetch(); // navbar + dashboard top bar pick up the new name and photo
            router.refresh();
            toast.success("Profile updated");
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageHeader title="Update Profile" subtitle="This is how customers and technicians see you on FixMate." />

            <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[320px_1fr]">
                {/* identity card */}
                <aside className="h-fit rounded-xl border-2 border-ink bg-white p-6 text-center shadow-hard-sm">
                    <div className="flex justify-center">
                        <ImageUpload shape="avatar" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} onUploading={setUploading} />
                    </div>
                    <p className="mt-4 font-display text-xl font-bold">{form.name || u.name}</p>
                    <span className={clsx("mt-2 inline-block rounded px-2 py-0.5 text-xs font-bold capitalize", ROLE_BADGE[role])}>{role}</span>
                    <p className="mt-3 text-xs text-ink-soft">Click the photo to upload a new one (ImgBB).</p>
                </aside>

                <div className="space-y-5 rounded-xl border-2 border-ink bg-white p-5 sm:p-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="label" htmlFor="name">Full Name</label>
                            <input id="name" className="input" value={form.name} onChange={set("name")} />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="label" htmlFor="phone">Phone</label>
                            <input id="phone" className="input" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} />
                            {errors.phone && <p className="error-text">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="label flex items-center gap-1.5" htmlFor="email">Email <Lock size={12} /></label>
                            <input id="email" className="input bg-paper-dark/60" value={u.email} readOnly />
                        </div>
                        <div>
                            <label className="label flex items-center gap-1.5" htmlFor="role">Role <Lock size={12} /></label>
                            <input id="role" className="input bg-paper-dark/60 capitalize" value={role} readOnly />
                        </div>
                    </div>
                    <div>
                        <label className="label" htmlFor="area">Area</label>
                        <input id="area" className="input" placeholder="e.g. Mirpur, Dhaka" value={form.area} onChange={set("area")} />
                    </div>
                    <div>
                        <label className="label" htmlFor="bio">Bio</label>
                        <textarea id="bio" rows={4} className="input resize-none" placeholder={role === "technician" ? "Your skills and years of experience" : "A little about you"} value={form.bio} onChange={set("bio")} />
                        <div className="flex justify-between">
                            {errors.bio ? <p className="error-text">{errors.bio}</p> : <span />}
                            <span className="mt-1 font-mono text-xs text-ink-soft">{form.bio.length}/400</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary" disabled={saving || uploading}>
                            {saving ? <Spinner size={16} /> : <Save size={16} />} Save changes
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}