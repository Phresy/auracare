"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { CheckCircle, Package, Truck, Clock, MapPin, Phone, Mail, Calendar, Receipt, Download, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Main component wrapped in Suspense
export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OrderConfirmationContent />
        </Suspense>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
                <p className="text-zinc-600">Loading order details...</p>
            </div>
        </div>
    );
}

// Actual content component
function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) {
            router.push("/pharmacy");
            return;
        }
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (error) {
                console.error("Error fetching order:", error);
                setError("Order not found. Please check your order ID.");
                return;
            }

            setOrder(data);
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'pending': return "Your order is pending verification. Our team will review it shortly.";
            case 'verified': return "Your order has been verified and is being prepared for shipping.";
            case 'shipped': return "Your order is on the way! Track your delivery using the link below.";
            case 'delivered': return "Your order has been delivered. Thank you for shopping with us!";
            case 'cancelled': return "This order has been cancelled. Contact support for assistance.";
            default: return "Order status is being updated.";
        }
    };

    const downloadReceipt = () => {
        const receiptContent = `
AURA PHARMA - ORDER RECEIPT
================================
Order ID: ${order.id}
Date: ${new Date(order.created_at).toLocaleString()}
Status: ${order.status.toUpperCase()}

CUSTOMER DETAILS
----------------
Name: ${order.full_name}
Email: ${order.email}
Phone: ${order.phone}
Address: ${order.shipping_address}

ORDER ITEMS
-----------
${order.items?.map((item: any, i: number) =>
            `${i + 1}. ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')}

PAYMENT SUMMARY
---------------
Subtotal: $${(order.total_amount / 1.1).toFixed(2)}
Tax (10%): $${(order.total_amount / 11).toFixed(2)}
Total: $${order.total_amount.toFixed(2)}

Thank you for choosing AURA Pharma!
For support: support@aurapharma.com
    `;

        const blob = new Blob([receiptContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt_${order.id.slice(0, 8)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <LoadingFallback />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">Order Not Found</h1>
                    <p className="text-zinc-500 mb-6">{error || "We couldn't find your order details."}</p>
                    <Link href="/pharmacy">
                        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-zinc-500">
                        Thank you for your purchase. Your order has been received.
                    </p>
                </motion.div>

                {/* Order Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden mb-8"
                >
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Order ID</p>
                            <p className="font-mono text-sm font-bold text-zinc-900">#{order.id.slice(0, 12)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Order Date</p>
                            <p className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                <Calendar size={14} className="text-zinc-400" />
                                {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Order Status</p>
                            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-zinc-600 text-sm leading-relaxed">
                            {getStatusMessage(order.status)}
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Items */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Receipt size={20} className="text-emerald-600" />
                                Order Items
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 pb-4 border-b border-zinc-100 last:border-0">
                                    <div className="w-16 h-16 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || "/placeholder-image.jpg"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-zinc-900">{item.name}</p>
                                        <p className="text-xs text-zinc-500">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-bold text-emerald-600 mt-1">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Shipping Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Customer Details */}
                        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <MapPin size={20} className="text-emerald-600" />
                                    Shipping Details
                                </h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-zinc-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-zinc-600">{order.full_name}</p>
                                        <p className="text-sm text-zinc-600">{order.shipping_address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-zinc-400" />
                                    <p className="text-sm text-zinc-600">{order.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-zinc-400" />
                                    <p className="text-sm text-zinc-600">{order.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Receipt size={20} className="text-emerald-600" />
                                    Payment Summary
                                </h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="text-zinc-900">${(order.total_amount / 1.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Tax (10%)</span>
                                    <span className="text-zinc-900">${(order.total_amount / 11).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span className="text-zinc-900">Calculated at delivery</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-black">
                                        <span className="text-zinc-900">Total</span>
                                        <span className="text-emerald-600">${order.total_amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex flex-wrap gap-4 justify-center"
                >
                    <button
                        onClick={downloadReceipt}
                        className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition flex items-center gap-2"
                    >
                        <Download size={18} />
                        Download Receipt
                    </button>
                    <button
                        onClick={() => {
                            navigator.share?.({
                                title: 'Order Confirmation',
                                text: `Order #${order.id.slice(0, 8)} has been confirmed`,
                                url: window.location.href
                            }).catch(() => { });
                        }}
                        className="px-6 py-3 border-2 border-zinc-200 rounded-xl font-bold hover:border-emerald-600 transition flex items-center gap-2"
                    >
                        <Share2 size={18} />
                        Share Order
                    </button>
                    <Link href="/pharmacy">
                        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">
                            Continue Shopping
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}