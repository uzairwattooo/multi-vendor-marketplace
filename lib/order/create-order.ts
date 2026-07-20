import { db } from "@/db";
import { cart, cartItem, order, orderItem, product, shippingAddress, } from "@/db/schema";
import { and, eq, sql, } from "drizzle-orm";
import { generateOrderNumber } from "./generate-order-number";
import { groupCartBySeller } from "./group-cart-by-seller";
import type { CartItemType } from "./group-cart-by-seller";

type ShippingData = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
};

type CreateOrderInput = {
    userId: string;
    paymentMethod: "stripe" | "cod";
    stripePaymentIntentId?: string;
    stripeCheckoutSessionId?: string;
    shipping: ShippingData
    platformFee?: number;
};

export async function createOrder(
    input: CreateOrderInput,
) {
    const userCart = await db.query.cart.findFirst({
        where: eq(cart.userId, input.userId),
    });
    if (!userCart) {
        throw new Error("Cart not found");
    }
    const items = await db
        .select({
            cartItemId: cartItem.id,
            quantity: cartItem.quantity,
            productId: product.id,
            storeId: product.storeId,
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
        })
        .from(cartItem)
        .innerJoin(
            product,
            eq(product.id, cartItem.productId),
        )
        .where(eq(cartItem.cartId, userCart.id));
    if (items.length === 0) {
        throw new Error("Cart is empty");
    }
    for (const item of items) {
        if (item.quantity > item.stock) {
            throw new Error(
                `${item.name} is out of stock.`,
            );
        }
    }
    const sellerGroups = groupCartBySeller(items);

    await db.transaction(async (tx) => {
        const createdOrders: string[] = [];
        for (const seller of sellerGroups) {
            const subtotal = seller.items.reduce(
                (total: number,item: CartItemType) =>
                    total + item.price * item.quantity,0,);
            const platformFee = Math.round(subtotal * 0.10);
            const orderId = crypto.randomUUID();

            await tx.insert(order).values({
                id: orderId,
                orderNumber:
                    generateOrderNumber(),
                buyerId: input.userId,
                storeId: seller.storeId,
                status: "pending",
                paymentStatus: input.paymentMethod === "cod"
                        ? "pending"
                        : "paid",
                paymentMethod:
                    input.paymentMethod,
                stripePaymentIntentId:
                    input.stripePaymentIntentId ??
                    null,
                stripeCheckoutSessionId:
                    input.stripeCheckoutSessionId,
                currency: "usd",
                subtotal: subtotal.toString(),
                totalAmount:
                    subtotal.toString(),
                shippingAmount: "0",
                taxAmount: "0",
                discountAmount: "0",
                platformFee:
                    platformFee.toString(),
                sellerAmount:
                    (
                        subtotal - platformFee
                    ).toString(),
            });

            createdOrders.push(orderId);
            await tx.insert(shippingAddress).values({
                orderId,
                fullName: input.shipping.fullName,
                email: input.shipping.email,
                phone: input.shipping.phone,
                address: input.shipping.address,
                apartment:
                    input.shipping.apartment ?? null,
                city: input.shipping.city,
                state: input.shipping.state,
                postalCode:
                    input.shipping.postalCode ?? null,
                country: input.shipping.country,
            });
            for (const item of seller.items) {
                await tx.insert(orderItem).values({
                    orderId,
                    storeId: seller.storeId,
                    productId: item.productId,
                    productName: item.name,
                    sku: item.sku,
                    unitPrice:
                        item.price.toString(),
                    quantity:
                        item.quantity,
                    totalPrice: (
                        item.price *
                        item.quantity
                    ).toString(),
                });
                await tx
                    .update(product)
                    .set({
                        stock: sql`${product.stock} - ${item.quantity}`,
                    })
                    .where(
                        and(
                            eq(
                                product.id,
                                item.productId,
                            ),
                            eq(
                                product.storeId,
                                seller.storeId,
                            ),
                        ),
                    );
            }
        }
        await tx
            .delete(cartItem)
            .where(
                eq(cartItem.cartId, userCart.id),
            );
        await tx
            .delete(cart)
            .where(eq(cart.id, userCart.id));
    });
    return {
        success: true,
        orderCount: sellerGroups.length,
    };
}