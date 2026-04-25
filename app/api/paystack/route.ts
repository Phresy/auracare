import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { email, amount, orderId } = await req.json();

        // Validate required fields
        if (!email || !amount || !orderId) {
            return NextResponse.json(
                { error: "Missing required fields: email, amount, or orderId" },
                { status: 400 }
            );
        }

        // Initialize Paystack transaction
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Paystack uses kobo (GHS * 100)
                currency: "GHS",
                metadata: {
                    order_id: orderId,
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: orderId,
                        },
                    ],
                },
                callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-verify`,
            }),
        });

        const data = await response.json();

        if (!data.status) {
            console.error("Paystack error:", data);
            return NextResponse.json(
                { error: data.message || "Failed to initialize payment" },
                { status: 400 }
            );
        }

        // Update order with payment reference
        const supabase = createClient();
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                payment_reference: data.data.reference,
                payment_status: "pending",
            })
            .eq("id", orderId);

        if (updateError) {
            console.error("Failed to update order:", updateError);
        }

        return NextResponse.json({
            authorization_url: data.data.authorization_url,
            reference: data.data.reference,
        });
    } catch (error) {
        console.error("Paystack API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}