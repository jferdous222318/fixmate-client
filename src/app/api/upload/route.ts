import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/upload  (multipart: image)
// Forwards the image to ImgBB so the IMGBB_API_KEY never reaches the browser.
export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const key = process.env.IMGBB_API_KEY;
    if (!key) return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });

    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ message: "No image received" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ message: "Image must be 5 MB or smaller" }, { status: 400 });

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
        return NextResponse.json({ message: data?.error?.message || "Image upload failed" }, { status: 502 });
    }

    return NextResponse.json({ url: data.data.display_url || data.data.url });
}