"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { CheckCircle, XCircle, Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentVerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const reference = searchParams.get("reference");
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (reference) {
            verifyPayment();
        } else {
            setError("No payment reference found");
            setVerifying(false);
        }
    }, [reference]);

    const verifyPayment = async () => {
        try {
            // Call our verification API
            const response = await fetch("/api/paystack/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setOrderId(data.orderId);

                // Clear cart after successful payment
                localStorage.removeItem("cart");
            } else {
                setError(data.error || "Payment verification failed");
            }
        } catch (error) {
            console.error("Verification error:", error);
            setError("Failed to verify payment. Please contact support.");
        } finally {
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Verifying Payment</h2>
                    <p className="text-zinc-500">Please wait while we confirm your transaction...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center"
                >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 mb-3">Payment Successful! 🎉</h1>
                    <p className="text-zinc-500 mb-6">
                        Your order has been confirmed. We'll notify you once it's processed.
                    </p>
                    <div className="space-y-3">
                        <Link href={`/order-confirmation?orderId=${orderId}`}>
                            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                                View Order Details <ArrowRight size={18} />
                            </button>
                        </Link>
                        <Link href="/pharmacy">
                            <button className="w-full border-2 border-zinc-200 py-4 rounded-2xl font-bold hover:border-emerald-600 transition">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center"
            >
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={48} className="text-red-600" />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 mb-3">Payment Failed</h1>
                <p className="text-zinc-500 mb-6">{error || "Something went wrong with your payment."}</p>
                <div className="space-y-3">
                    <Link href="/cart">
                        <button className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition">
                            Return to Cart
                        </button>
                    </Link>
                    <Link href="/pharmacy">
                        <button className="w-full border-2 border-zinc-200 py-4 rounded-2xl font-bold hover:border-emerald-600 transition">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-6">
                    If money was deducted, please contact support with your order reference.
                </p>
            </motion.div>
        </div>
    );
}