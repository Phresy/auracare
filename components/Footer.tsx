"use client";

import Link from "next/link";
import {
    Heart,
    Mail,
    Phone,
    MapPin,
    Clock,
    Share2,      // For Facebook or generic sharing
    Camera,      // For Instagram
    MessageSquare, // For Twitter/X
    Users,       // For LinkedIn
    Video,
    Shield,
    Truck,
    CreditCard,
    Headphones,
    ArrowRight,
    Sparkles,
    Pill,
    Microscope,
    Activity,
    ShoppingBag
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const footerSections = {
        company: {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Blog", href: "/blog" },
                { name: "Press", href: "/press" },
                { name: "Sustainability", href: "/sustainability" }
            ]
        },
        services: {
            title: "Services",
            links: [
                { name: "Pharmacy", href: "/pharmacy" },
                { name: "Wellness", href: "/wellness" },
                { name: "Lab Tests", href: "/lab-tests" },
                { name: "Consultation", href: "/consultation" },
                { name: "Health Checkups", href: "/checkups" }
            ]
        },
        support: {
            title: "Support",
            links: [
                { name: "Help Center", href: "/help" },
                { name: "FAQs", href: "/faqs" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Returns", href: "/returns" },
                { name: "Contact Us", href: "/contact" }
            ]
        },
        legal: {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" },
                { name: "HIPAA Compliance", href: "/hipaa" },
                { name: "Accessibility", href: "/accessibility" }
            ]
        }
    };

    // Replace your socialLinks array with this:
    const socialLinks = [
        { name: "Facebook", icon: Share2, href: "https://facebook.com", color: "hover:bg-[#1877f2]" },
        { name: "Twitter", icon: MessageSquare, href: "https://twitter.com", color: "hover:bg-[#1da1f2]" },
        { name: "Instagram", icon: Camera, href: "https://instagram.com", color: "hover:bg-[#e4405f]" },
        { name: "LinkedIn", icon: Users, href: "https://linkedin.com", color: "hover:bg-[#0077b5]" },
        { name: "YouTube", icon: Video, href: "https://youtube.com", color: "hover:bg-[#ff0000]" }
    ];

    const trustBadges = [
        { icon: Shield, text: "HIPAA Compliant" },
        { icon: Truck, text: "Free Delivery" },
        { icon: CreditCard, text: "Secure Payment" },
        { icon: Headphones, text: "24/7 Support" }
    ];

    return (
        <footer className="bg-zinc-950 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <h2 className="text-2xl font-black tracking-tighter italic">
                                AURA<span className="text-brand">PHARMA</span>
                            </h2>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Revolutionizing healthcare with premium medications, wellness products, and diagnostic services delivered to your doorstep with care and precision.
                        </p>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {trustBadges.map((badge, idx) => {
                                const Icon = badge.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Icon size={16} className="text-brand" />
                                        <span className="text-xs text-zinc-400">{badge.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Social Links */}
                        <div>
                            <h4 className="text-sm font-bold mb-3 uppercase tracking-wider">Follow Us</h4>
                            <div className="flex gap-2">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.values(footerSections).map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                                        >
                                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-zinc-800 pt-12 mb-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <Sparkles size={20} className="text-brand" />
                                Stay Healthy, Stay Updated
                            </h3>
                            <p className="text-zinc-400 text-sm">
                                Subscribe to receive health tips, exclusive offers, and wellness insights.
                            </p>
                        </div>
                        <div>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-brand transition-colors text-white placeholder:text-zinc-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/80 transition-all hover:scale-105 active:scale-95"
                                >
                                    Subscribe
                                </button>
                            </form>
                            {subscribed && (
                                <p className="text-green-500 text-sm mt-2 animate-in fade-in slide-in-from-top-2">
                                    ✓ Successfully subscribed!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Info Bar */}
                <div className="border-t border-zinc-800 pt-8 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                                <Phone size={18} className="text-brand" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Emergency Hotline</p>
                                <p className="font-bold">+1 (888) 555-0123</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                                <Mail size={18} className="text-brand" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Email Us</p>
                                <p className="font-bold">care@aurapharma.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                                <MapPin size={18} className="text-brand" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Visit Us</p>
                                <p className="font-bold">123 Healthcare Ave, NY 10001</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                                <Clock size={18} className="text-brand" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Customer Support</p>
                                <p className="font-bold">24/7 Available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-500 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} AURA Pharma. All rights reserved. | Empowering healthier lives
                    </p>
                    <div className="flex gap-6">
                        <Link href="/sitemap" className="text-xs text-zinc-500 hover:text-white transition">
                            Sitemap
                        </Link>
                        <Link href="/accessibility" className="text-xs text-zinc-500 hover:text-white transition">
                            Accessibility
                        </Link>
                        <Link href="/privacy" className="text-xs text-zinc-500 hover:text-white transition">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}