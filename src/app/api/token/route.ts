import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = jwt.sign(
        { email: session.user.email, role: session.user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );
    return NextResponse.json({ token });
}