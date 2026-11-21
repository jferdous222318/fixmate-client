import Link from "next/link";
import { CircleX, RotateCcw } from "lucide-react";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
    await requireRole("customer");

    return (
        <section className="bg-blueprint">
            <div className="container-x py-16">
                <div className="mx-auto max-w-lg rounded-2xl border-2 border-ink bg-white p-8 text-center shadow-hard">
                    <span className="mx-auto flex h-16 w-16 rotate-[-6deg] items-center justify-center rounded-xl border-2 border-ink bg-mustard">
                        <CircleX size={30} />
                    </span>
                    <h1 className="mt-5 text-3xl font-extrabold">Payment cancelled</h1>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        No worries, nothing was charged and your booking is unchanged. You can pay whenever you are ready.
                    </p>
                    <Link href="/dashboard/customer/bookings" className="btn-primary mt-7">
                        <RotateCcw size={16} /> Try Again
                    </Link>
                </div>
            </div>
        </section>
    );
}