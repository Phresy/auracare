import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get("x-paystack-signature");

        // Verify webhook signature (optional but recommended)
        const crypto = require("crypto");
        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
            .update(JSON.stringify(body))
            .digest("hex");

        if (hash !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // Process webhook event
        if (body.event === "charge.success") {
            const reference = body.data.reference;

            const supabase = createClient();

            // Update order status
            const { error } = await supabase
                .from("orders")
                .update({
                    status: "verified",
                    payment_status: "paid",
                    payment_details: body.data,
                })
                .eq("payment_reference", reference);

            if (error) {
                console.error("Webhook update error:", error);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}