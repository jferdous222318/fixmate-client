"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CircleCheck, CircleX, ClipboardList } from "lucide-react";
import { PageLoader } from "@/components/ui/Spinner";
import { api, errorMessage } from "@/lib/api";
import { money } from "@/lib/format";

type Result = { amount: number; transactionId: string; serviceTitle: string };

// Calls the server, which retrieves the Stripe session and saves the payment once.
export default function VerifyPayment({ sessionId }: { sessionId: string | null }) {
    const [state, setState] = useState<{ status: "loading" | "ok" | "error"; data?: Result; error?: string }>(
        sessionId ? { status: "loading" } : { status: "error", error: "Missing payment session" }
    );
    const ran = useRef(false); // React dev mode runs effects twice; the server is idempotent anyway

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        if (!sessionId) return;
        api<Result>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
            .then((data) => {
                setState({ status: "ok", data });
                toast.success("Payment successful!");
            })
            .catch((err) => {
                setState({ status: "error", error: errorMessage(err) });
                toast.error(errorMessage(err));
            });
    }, [sessionId]);

    if (state.status === "loading") return <PageLoader label="Confirming your payment" />;

    if (state.status === "error") {
        return (
            <div className="mx-auto max-w-lg rounded-2xl border-2 border-ink bg-white p-8 text-center shadow-hard">
                <CircleX size={52} className="mx-auto text-red-600" />
                <h1 className="mt-4 text-2xl font-extrabold">We could not confirm this payment</h1>
                <p className="mt-2 text-sm text-ink-soft">{state.error}</p>
                <Link href="/dashboard/customer/bookings" className="btn-primary mt-6">Back to My Bookings</Link>
            </div>
        );
    }

    const d = state.data!;
    return (
        <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-hard">
            <div className="bg-green-600 px-8 py-8 text-center text-white">
                <CircleCheck size={56} className="mx-auto" />
                <h1 className="mt-3 font-display text-3xl font-extrabold">Payment successful</h1>
                <p className="mt-1 text-white/85">Thanks! Your technician has been paid.</p>
            </div>
            {/* receipt */}
            <dl className="space-y-3 p-8 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-ink-soft">Service</dt><dd className="text-right font-bold">{d.serviceTitle}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-soft">Amount paid</dt><dd className="font-mono text-lg font-bold">{money(d.amount)}</dd></div>
                <div className="border-t-2 border-dashed border-ink/15 pt-3">
                    <dt className="text-ink-soft">Transaction ID</dt>
                    <dd className="mt-1 break-all rounded-md bg-paper px-3 py-2 font-mono text-xs">{d.transactionId}</dd>
                </div>
            </dl>
            <div className="px-8 pb-8">
                <Link href="/dashboard/customer/bookings" className="btn-primary w-full"><ClipboardList size={16} /> Back to My Bookings</Link>
            </div>
        </div>
    );
}