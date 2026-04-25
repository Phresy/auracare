import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { reference } = await req.json();

        if (!reference) {
            return NextResponse.json(
                { error: "Missing payment reference" },
                { status: 400 }
            );
        }

        // Verify transaction with Paystack
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!data.status || data.data.status !== "success") {
            console.error("Paystack verification failed:", data);
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // Update order in Supabase
        const supabase = createClient();
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("payment_reference", reference)
            .single();

        if (fetchError || !order) {
            console.error("Order not found:", fetchError);
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Update order status
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                status: "verified",
                payment_status: "paid",
                payment_details: data.data,
            })
            .eq("id", order.id);

        if (updateError) {
            console.error("Failed to update order:", updateError);
            return NextResponse.json(
                { error: "Failed to update order status" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            transaction: data.data,
        });
    } catch (error) {
        console.error("Verification API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}