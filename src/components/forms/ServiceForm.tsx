"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ImageUpload from "./ImageUpload";
import Spinner from "@/components/ui/Spinner";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";

export type ServiceInput = {
    title: string;
    category: string;
    description: string;
    image: string;
    basePrice: string;
    estimatedDuration: string;
    serviceMode: string;
    serviceArea: string;
};

export const EMPTY_SERVICE: ServiceInput = {
    title: "", category: "", description: "", image: "", basePrice: "",
    estimatedDuration: "", serviceMode: "Home Visit", serviceArea: "",
};

type Props = {
    initial?: ServiceInput;
    technician: { name: string; email: string };
    submitLabel: string;
    compact?: boolean; // stack the columns (used inside the edit modal)
    onSubmit: (data: Omit<ServiceInput, "basePrice"> & { basePrice: number }) => Promise<boolean>;
};

const FieldError = ({ msg }: { msg?: string }) => (msg ? <p className="error-text">{msg}</p> : null);

// Shared by Add Service and the Edit modal in My Services
export default function ServiceForm({ initial = EMPTY_SERVICE, technician, submitLabel, compact, onSubmit }: Props) {
    const [form, setForm] = useState<ServiceInput>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const set = (k: keyof ServiceInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: "" })); // clear this field's error while typing
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters";
        if (!CATEGORIES.includes(form.category as (typeof CATEGORIES)[number])) e.category = "Choose a category";
        if (form.description.trim().length < 20) e.description = "Description must be at least 20 characters";
        const price = Number(form.basePrice);
        if (!form.basePrice || !Number.isFinite(price) || price <= 0) e.basePrice = "Base price must be a positive number";
        if (!form.estimatedDuration.trim()) e.estimatedDuration = "Estimated duration is required";
        if (!SERVICE_MODES.includes(form.serviceMode as (typeof SERVICE_MODES)[number])) e.serviceMode = "Choose a service mode";
        if (!form.serviceArea.trim()) e.serviceArea = "Service area is required";
        if (!form.image) e.image = "Upload a service image";
        return e;
    };

    const submit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setSaving(true);
        const ok = await onSubmit({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            estimatedDuration: form.estimatedDuration.trim(),
            serviceArea: form.serviceArea.trim(),
            basePrice: Number(form.basePrice),
        });
        setSaving(false);
        if (ok && initial === EMPTY_SERVICE) setForm(EMPTY_SERVICE); // clear after adding
    };

    return (
        <form onSubmit={submit} noValidate className={compact ? "grid gap-6" : "grid gap-6 lg:grid-cols-[1fr_340px]"}>
            <div className="space-y-5">
                <div>
                    <label className="label" htmlFor="title">Service Title</label>
                    <input id="title" className="input" placeholder="e.g. iPhone Screen Replacement" value={form.title} onChange={set("title")} />
                    <FieldError msg={errors.title} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="label" htmlFor="category">Category</label>
                        <select id="category" className="input" value={form.category} onChange={set("category")}>
                            <option value="">Select a category</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <FieldError msg={errors.category} />
                    </div>
                    <div>
                        <label className="label" htmlFor="price">Base Price (USD)</label>
                        <input id="price" type="number" min="1" step="0.01" className="input font-mono" placeholder="e.g. 45" value={form.basePrice} onChange={set("basePrice")} />
                        <FieldError msg={errors.basePrice} />
                    </div>
                    <div>
                        <label className="label" htmlFor="duration">Estimated Duration</label>
                        <input id="duration" className="input" placeholder="e.g. 2-3 hours" value={form.estimatedDuration} onChange={set("estimatedDuration")} />
                        <FieldError msg={errors.estimatedDuration} />
                    </div>
                    <div>
                        <label className="label" htmlFor="area">Service Area</label>
                        <input id="area" className="input" placeholder="e.g. Dhanmondi, Dhaka" value={form.serviceArea} onChange={set("serviceArea")} />
                        <FieldError msg={errors.serviceArea} />
                    </div>
                </div>

                <fieldset>
                    <legend className="label">Service Mode</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {SERVICE_MODES.map((m) => (
                            <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold ${form.serviceMode === m ? "border-ink bg-mustard/40" : "border-ink/25 bg-white"}`}>
                                <input type="radio" name="serviceMode" value={m} checked={form.serviceMode === m} onChange={set("serviceMode")} className="accent-[#0f5c55]" />
                                {m}
                            </label>
                        ))}
                    </div>
                    <FieldError msg={errors.serviceMode} />
                </fieldset>

                <div>
                    <label className="label" htmlFor="desc">Description</label>
                    <textarea id="desc" rows={5} className="input resize-none" placeholder="What is included, parts used, warranty…" value={form.description} onChange={set("description")} />
                    <FieldError msg={errors.description} />
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <span className="label">Service Image</span>
                    <ImageUpload
                        value={form.image}
                        onChange={(url) => {
                            setForm((f) => ({ ...f, image: url }));
                            setErrors((er) => ({ ...er, image: "" }));
                        }}
                        onUploading={setUploading}
                        error={errors.image}
                    />
                </div>
                <div className="rounded-xl border-2 border-ink/15 bg-paper p-4">
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Listed by</p>
                    <label className="label" htmlFor="tname">Technician Name</label>
                    <input id="tname" className="input bg-paper-dark/60" value={technician.name} readOnly />
                    <label className="label mt-3" htmlFor="temail">Technician Email</label>
                    <input id="temail" className="input bg-paper-dark/60" value={technician.email} readOnly />
                </div>
                <button type="submit" className="btn-primary w-full py-3" disabled={saving || uploading}>
                    {saving ? <Spinner size={18} /> : <Save size={18} />} {submitLabel}
                </button>
            </div>
        </form>
    );
}