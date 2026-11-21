"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Hourglass } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/forms/ServiceForm";
import { PageLoader } from "@/components/ui/Spinner";
import { authClient } from "@/lib/auth-client";
import { api, errorMessage } from "@/lib/api";

export default function AddServicePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session) return <PageLoader />;

    return (
        <>
            <PageHeader title="Add a Service" subtitle="New services are reviewed by an admin before they appear on the public pages." />
            <p className="mb-6 flex items-center gap-2 rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900">
                <Hourglass size={16} /> Saved as <b>pending</b> until approved.
            </p>
            <div className="rounded-xl border-2 border-ink bg-white p-5 sm:p-7">
                <ServiceForm
                    technician={{ name: session.user.name, email: session.user.email }}
                    submitLabel="Submit for approval"
                    onSubmit={async (data) => {
                        try {
                            await api("/api/services", { method: "POST", body: data });
                            toast.success("Service submitted! It is waiting for admin approval.");
                            router.push("/dashboard/technician/my-services");
                            return true;
                        } catch (err) {
                            toast.error(errorMessage(err));
                            return false;
                        }
                    }}
                />
            </div>
        </>
    );
}