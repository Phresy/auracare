"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Loader2, AlertCircle, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function CheckoutPage() {
    const { cart, cartCount, clearCart } = useCart();
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        notes: ""
    });

    // Calculate totals - Maintaining your precise calculation logic
    const subtotal = cart.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const quantity = item.quantity || 1;
        return acc + (price * quantity);
    }, 0);

    const shipping = subtotal > 500 ? 0 : 50.00; // Adjusted for GHS context
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const needsPrescription = cart.some(item => item.requiresPrescription);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?redirect=/checkout");
                return;
            }
            setUser(user);
            if (user.email) {
                setFormData(prev => ({ ...prev, email: user.email || "" }));
            }
        };
        getUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error("Please sign in to complete checkout");

            // 1. Prepare full order data for Supabase
            const orderData = {
                user_id: user.id,
                full_name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                city: formData.city,
                postal_code: formData.postalCode,
                total_amount: total,
                status: "pending",
                payment_status: "unpaid",
                prescription_status: needsPrescription ? "pending" : "not_required",
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                    quantity: item.quantity || 1,
                    requiresPrescription: item.requiresPrescription,
                    image: item.image
                })),
                notes: formData.notes,
                created_at: new Date().toISOString()
            };

            const { data: order, error } = await supabase
                .from("orders")
                .insert([orderData])
                .select()
                .single();

            if (error) throw new Error(error.message);

            // 2. Call Paystack API route
            const response = await fetch("/api/paystack", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    amount: total,
                    orderId: order.id,
                }),
            });

            const paystackData = await response.json();
            if (paystackData.error) throw new Error(paystackData.error);

            // 3. Redirect to Paystack secure checkout
            window.location.href = paystackData.authorization_url;

        } catch (error: any) {
            console.error("Checkout error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (cartCount === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400"
                >
                    <ShoppingBag size={40} />
                </motion.div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-zinc-950">Your bag is empty</h2>
                    <p className="text-zinc-500">Add some items from the pharmacy to get started.</p>
                </div>
                <Link href="/pharmacy" className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all">
                    <ArrowLeft size={18} /> Back to Pharmacy
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-16">

                {/* Left Side: Form Fields */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:col-span-7 space-y-12"
                >
                    <div>
                        <Link href="/pharmacy" className="text-zinc-400 hover:text-zinc-950 flex items-center gap-2 text-sm font-bold transition-colors mb-8 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shopping
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter text-zinc-950">Checkout</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Complete your details to finish your order.</p>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-10">
                        {/* Prescription Notice */}
                        <AnimatePresence>
                            {needsPrescription && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex gap-4 overflow-hidden"
                                >
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                        <AlertCircle className="text-amber-600" size={20} />
                                    </div>
                                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                                        <span className="font-bold block">Prescription Required</span>
                                        Our clinical team will reach out to verify your prescription for regulated items before delivery.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Customer Info */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                                    <User size={20} />
                                </div>
                                <h3 className="text-2xl font-black italic">Personal Details</h3>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">First Name</label>
                                    <input name="firstName" type="text" placeholder="Kwame" required value={formData.firstName} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Last Name</label>
                                    <input name="lastName" type="text" placeholder="Mensah" required value={formData.lastName} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                    <input name="email" type="email" placeholder="kwame@example.com" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number (For MoMo Prompt)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input name="phone" type="tel" placeholder="054 XXX XXXX" required value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Delivery Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-2xl font-black italic">Delivery Address</h3>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Street / Digital Address</label>
                                    <input name="address" type="text" placeholder="GA-123-4567 or Street Name" required value={formData.address} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">City</label>
                                    <input name="city" type="text" placeholder="Accra" required value={formData.city} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Postal Code (Optional)</label>
                                    <input name="postalCode" type="text" placeholder="00233" value={formData.postalCode} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Delivery Notes</label>
                                    <textarea name="notes" placeholder="Drop at the front desk..." rows={3} value={formData.notes} onChange={handleInputChange} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-950 focus:bg-white transition-all resize-none" />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-950 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 disabled:bg-zinc-200 disabled:cursor-not-allowed group shadow-xl shadow-zinc-200"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Pay with Paystack • GH₵{total.toFixed(2)}</span>
                                    <CreditCard size={24} className="group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Right Side: Sticky Order Summary */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:col-span-5"
                >
                    <div className="bg-zinc-50 rounded-[3rem] p-10 sticky top-24 border border-zinc-100 shadow-sm">
                        <h3 className="text-2xl font-black italic mb-8">Order Summary</h3>

                        <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item, i) => {
                                const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                                const quantity = item.quantity || 1;
                                return (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200 group-hover:scale-105 transition-transform">
                                            <img src={item.image || "/placeholder-image.jpg"} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="flex-1 py-1">
                                            <p className="font-black text-zinc-950 text-base leading-tight">{item.name}</p>
                                            <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-tighter">Qty: {quantity}</p>
                                            <p className="font-black text-emerald-600 text-lg mt-2">GH₵{(price * quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4 border-t border-zinc-200 pt-8">
                            <div className="flex justify-between items-center text-zinc-500 font-bold">
                                <span>Subtotal</span>
                                <span className="text-zinc-950">GH₵{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-500 font-bold">
                                <span>Delivery Fee</span>
                                <span className={shipping === 0 ? "text-emerald-600 uppercase tracking-widest text-xs font-black" : "text-zinc-950"}>
                                    {shipping === 0 ? "Free" : `GH₵${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-500 font-bold">
                                <span>VAT (10%)</span>
                                <span className="text-zinc-950">GH₵{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-3xl font-black pt-4 text-zinc-950 border-t border-zinc-200">
                                <span>Total</span>
                                <span>GH₵{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-10 p-5 bg-white rounded-3xl border border-zinc-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Guarantee</p>
                                <p className="text-xs font-bold text-zinc-600">HIPAA Compliant & Secure Payment</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}