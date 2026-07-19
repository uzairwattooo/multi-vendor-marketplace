import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOrder } from "@/lib/order/create-order";


export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }
        const { shipping } = await req.json();

        const result = await createOrder({
            userId: session.user.id,
            paymentMethod: "cod",
            shipping,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to place order",
            },
            {
                status: 500,
            },
        );
    }
}
