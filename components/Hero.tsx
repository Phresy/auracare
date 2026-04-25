"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Truck, Clock, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-zinc-50/30 to-white pt-20 pb-32">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand/5 to-transparent rounded-full blur-2xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-black uppercase tracking-wider mb-8 backdrop-blur-sm border border-brand/20"
                        >
                            <ShieldCheck size={14} />
                            Verified Pharmaceutical Provider
                            <span className="w-1 h-1 rounded-full bg-brand/40" />
                            <span className="text-brand/80">ISO Certified</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            className="text-6xl lg:text-8xl font-black text-zinc-950 leading-[1.05] mb-8 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Your Health,{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-brand">Evolved.</span>
                                <motion.span
                                    className="absolute bottom-2 left-0 w-full h-3 bg-brand/20 -z-0 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                />
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-lg text-zinc-600 max-w-lg mb-10 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Experience the future of pharmacy. Genuine medications, wellness essentials,
                            and expert care delivered to your doorstep with precision and care.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/pharmacy">
                                <button className="group relative px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Shop Medications
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </Link>
                            <Link href="/prescription">
                                <button className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold border-2 border-zinc-200 hover:border-brand hover:bg-brand hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                    Upload Prescription
                                </button>
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            className="flex gap-8 pt-8 border-t border-zinc-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div>
                                <p className="text-2xl font-black text-zinc-950">50K+</p>
                                <p className="text-xs text-zinc-500 font-medium">Happy Customers</p>
                            </div>
                            <div className="w-px bg-zinc-200" />
                            <div>
                                <p className="text-2xl font-black text-zinc-950">99.9%</p>
                                <p className="text-xs text-zinc-500 font-medium">Delivery Success</p>
                            </div>
                            <div className="w-px bg-zinc-200" />
                            <div>
                                <p className="text-2xl font-black text-zinc-950">24/7</p>
                                <p className="text-xs text-zinc-500 font-medium">Pharmacist Support</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image Section */}
                    <motion.div
                        style={{ opacity, scale }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-white border border-zinc-200 overflow-hidden shadow-2xl">
                            {/* Main Image */}
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop"
                                alt="Medical professional caring for patient"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                            {/* Floating Cards */}
                            <motion.div
                                className="absolute top-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Heart size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium">Patient Trust</p>
                                        <p className="text-sm font-bold text-zinc-900">98% Satisfaction</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <Clock className="mx-auto mb-2 text-brand" size={20} />
                                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Delivery</p>
                                        <p className="text-sm font-bold text-zinc-900">30 Mins</p>
                                    </div>
                                    <div className="w-px bg-zinc-200" />
                                    <div className="text-center">
                                        <Truck className="mx-auto mb-2 text-brand" size={20} />
                                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Shipping</p>
                                        <p className="text-sm font-bold text-zinc-900">Free $50+</p>
                                    </div>
                                    <div className="w-px bg-zinc-200" />
                                    <div className="text-center">
                                        <ShieldCheck className="mx-auto mb-2 text-brand" size={20} />
                                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Authentic</p>
                                        <p className="text-sm font-bold text-zinc-900">100% Genuine</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-brand/20 rounded-full" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand/10 rounded-full blur-2xl" />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <span className="text-xs text-zinc-400 font-medium tracking-wider">SCROLL</span>
                <motion.div
                    className="w-5 h-8 border-2 border-zinc-300 rounded-full flex justify-center"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <motion.div
                        className="w-1 h-2 bg-brand rounded-full mt-1"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}