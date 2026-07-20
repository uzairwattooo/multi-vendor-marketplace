import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/order/create-order";

export async function POST(
    req: Request,
) {
    try {
        const session =
            await auth.api.getSession({
                headers: await headers(),
            });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }
        const { shipping } =
            await req.json();

        if (!shipping) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Shipping address is required",
                },
                {
                    status: 400,
                },
            );
        }
        const orders = await createOrder({
            userId: session.user.id,
            paymentMethod: "cod",
            shipping,
        });

        return NextResponse.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to place order",
            },
            {
                status: 500,
            },
        );
    }
}
