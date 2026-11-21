"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, Lock, Send, Wrench } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { api, errorMessage } from "@/lib/api";
import { todayInput } from "@/lib/format";

type Viewer = { name: string; email: string; role: string; phone?: string; area?: string } | null;

export default function RequestRepair({ serviceId, serviceTitle, viewer }: { serviceId: string; serviceTitle: string; viewer: Viewer }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        customerPhone: viewer?.phone ?? "",
        address: viewer?.area ?? "",
        preferredDate: "",
        problemDescription: "",
    });

    // logged out: send to sign in, then come back here
    if (!viewer) {
        return (
            <button className="btn-primary w-full py-3" onClick={() => router.push(`/sign-in?redirect=/services/${serviceId}`)}>
                <Wrench size={18} /> Request Repair
            </button>
        );
    }

    // technicians and admins cannot book
    if (viewer.role !== "customer") {
        return (
            <div>
                <button className="btn-primary w-full py-3" disabled><Lock size={18} /> Request Repair</button>
                <p className="mt-3 flex items-center gap-2 rounded-lg border-2 border-dashed border-ink/30 bg-paper px-3 py-2 text-sm font-medium text-ink-soft">
                    <Lock size={15} /> Only customers can request a repair.
                </p>
            </div>
        );
    }

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const next: Record<string, string> = {};
        if (!/^[+\d][\d\s-]{6,19}$/.test(form.customerPhone.trim())) next.customerPhone = "Enter a valid phone number";
        if (form.address.trim().length < 5) next.address = "Address must be at least 5 characters";
        if (!form.preferredDate) next.preferredDate = "Pick a preferred date";
        else if (form.preferredDate < todayInput()) next.preferredDate = "Date must be today or later";
        if (form.problemDescription.trim().length < 20) next.problemDescription = "Describe the problem in at least 20 characters";
        return next;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            await api("/api/bookings", { method: "POST", body: { serviceId, ...form } });
            setDone(true);
            toast.success("Repair request sent!", {
                action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
            });
        } catch (err) {
            toast.error(errorMessage(err)); // e.g. "You already have an active request for this service"
        } finally {
            setLoading(false);
        }
    };

    const close = () => {
        setOpen(false);
        if (done) {
            setDone(false);
            setForm((f) => ({ ...f, preferredDate: "", problemDescription: "" }));
        }
    };

    return (
        <>
            <button className="btn-primary w-full py-3" onClick={() => setOpen(true)}>
                <Wrench size={18} /> Request Repair
            </button>

            <Modal open={open} onClose={close} title={done ? "Request sent" : "Request a repair"} size="lg">
                {done ? (
                    <div className="py-4 text-center">
                        <CircleCheck size={52} className="mx-auto text-green-600" />
                        <h4 className="mt-4 text-xl font-extrabold">Your request is on the board</h4>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                            The technician will accept or reject it soon. You can follow every update from My Bookings.
                        </p>
                        <div className="mt-6 flex justify-center gap-2">
                            <button className="btn-ghost" onClick={close}>Close</button>
                            <Link href="/dashboard/customer/bookings" className="btn-primary">Go to My Bookings</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} noValidate className="space-y-4">
                        <p className="rounded-lg bg-paper-dark px-3 py-2 text-sm">
                            Service: <span className="font-bold">{serviceTitle}</span>
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="label">Name</label>
                                <input className="input bg-paper-dark/60" value={viewer.name} readOnly />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input className="input bg-paper-dark/60" value={viewer.email} readOnly />
                            </div>
                            <div>
                                <label className="label" htmlFor="phone">Phone</label>
                                <input id="phone" className="input" placeholder="01XXXXXXXXX" value={form.customerPhone} onChange={set("customerPhone")} />
                                {errors.customerPhone && <p className="error-text">{errors.customerPhone}</p>}
                            </div>
                            <div>
                                <label className="label" htmlFor="date">Preferred Date</label>
                                <input id="date" type="date" min={todayInput()} className="input" value={form.preferredDate} onChange={set("preferredDate")} />
                                {errors.preferredDate && <p className="error-text">{errors.preferredDate}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="label" htmlFor="address">Service / Pickup Address</label>
                            <input id="address" className="input" placeholder="House, road, area, city" value={form.address} onChange={set("address")} />
                            {errors.address && <p className="error-text">{errors.address}</p>}
                        </div>
                        <div>
                            <label className="label" htmlFor="problem">Problem Description</label>
                            <textarea id="problem" rows={4} className="input resize-none" placeholder="What is wrong with the device? When did it start?"
                                value={form.problemDescription} onChange={set("problemDescription")} />
                            <div className="flex justify-between">
                                {errors.problemDescription ? <p className="error-text">{errors.problemDescription}</p> : <span />}
                                <span className={`mt-1 font-mono text-xs ${form.problemDescription.trim().length >= 20 ? "text-green-700" : "text-ink-soft"}`}>
                                    {form.problemDescription.trim().length}/20
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <Spinner size={16} /> : <Send size={16} />} Send Request
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}