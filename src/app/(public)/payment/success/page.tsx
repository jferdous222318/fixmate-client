import VerifyPayment from "@/components/payment/VerifyPayment";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Payment Successful" };

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
    await requireRole("customer");
    const { session_id } = await searchParams;

    return (
        <section className="bg-blueprint">
            <div className="container-x py-16">
                <VerifyPayment sessionId={session_id ?? null} />
            </div>
        </section>
    );
}