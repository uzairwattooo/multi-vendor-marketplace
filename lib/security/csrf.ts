import { NextResponse } from "next/server";

type CsrfCheckResult =
    | {
        success: true;
    }
    | {
        success: false;
        response: NextResponse;
    };

function normalizeOrigin(value: string): string | null {
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

export function validateCsrf(request: Request): CsrfCheckResult {
    const method = request.method.toUpperCase();

    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
        return {
            success: true,
        };
    }

    const allowedOrigins = [
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
    ].filter((origin): origin is string => Boolean(origin));

    const normalizedAllowedOrigins = allowedOrigins
        .map(normalizeOrigin)
        .filter((origin): origin is string => Boolean(origin));

    const originHeader = request.headers.get("origin");
    const refererHeader = request.headers.get("referer");

    const requestOrigin =
        (originHeader && normalizeOrigin(originHeader)) ||
        (refererHeader && normalizeOrigin(refererHeader));

    if (!requestOrigin) {
        return {
            success: false,
            response: NextResponse.json(
                {
                    message: "Request origin is missing",
                },
                {
                    status: 403,
                },
            ),
        };
    }

    if (!normalizedAllowedOrigins.includes(requestOrigin)) {
        return {
            success: false,
            response: NextResponse.json(
                {
                    message: "Request origin is not allowed",
                },
                {
                    status: 403,
                },
            ),
        };
    }

    const fetchSite = request.headers.get("sec-fetch-site");

    if (
        fetchSite &&
        !["same-origin", "same-site", "none"].includes(fetchSite)
    ) {
        return {
            success: false,
            response: NextResponse.json(
                {
                    message: "Cross-site request blocked",
                },
                {
                    status: 403,
                },
            ),
        };
    }

    return {
        success: true,
    };
}