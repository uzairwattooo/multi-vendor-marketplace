import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

function isTrustedMutationRequest(request: Request) {
    if (request.method === "GET" || request.method === "HEAD") {
        return true;
    }

    const fetchSite = request.headers.get("sec-fetch-site");

    if (fetchSite === "cross-site") {
        return false;
    }

    const requestOrigin = new URL(request.url).origin;
    const origin = request.headers.get("origin");

    const configuredOrigins = [
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
    ]
        .filter((value): value is string => Boolean(value))
        .map((value) => {
            try {
                return new URL(value).origin;
            } catch {
                return value;
            }
        });

    const allowedOrigins = new Set([
        requestOrigin,
        ...configuredOrigins,
    ]);

    return !origin || allowedOrigins.has(origin);
}

export async function requireAdminApi(request: Request) {
    if (!isTrustedMutationRequest(request)) {
        return {
            session: null,
            response: NextResponse.json(
                { message: "Untrusted request origin" },
                { status: 403 },
            ),
        };
    }

    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return {
            session: null,
            response: NextResponse.json(
                { message: "Authentication required" },
                { status: 401 },
            ),
        };
    }

    if (session.user.role !== "admin") {
        return {
            session: null,
            response: NextResponse.json(
                { message: "Admin access required" },
                { status: 403 },
            ),
        };
    }

    return {
        session,
        response: null,
    };
}
