"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Pill,
    ShoppingBag,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    Package,
    LogOut,
    Settings
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { cartCount } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Get initial user session
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsAccountMenuOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const navLinks = [
        { name: "Pharmacy", href: "/pharmacy" },
        { name: "Wellness", href: "/wellness" },
        { name: "Lab Tests", href: "/lab-tests" },
    ];

    return (
        <>
            <nav
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-500 border-b",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-xl h-16 border-zinc-200 shadow-sm"
                        : "bg-white h-20 border-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="bg-brand w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:scale-105">
                            <Pill className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tighter uppercase hidden lg:inline">
                            AuraCare<span className="text-brand">.</span>
                        </span>
                    </Link>

                    {/* Amazon-style Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl relative group">
                        <input
                            type="text"
                            placeholder="Search medicines, health records, or lab tests..."
                            className="w-full bg-zinc-100 border-none rounded-2xl py-2.5 px-11 text-sm focus:ring-2 focus:ring-brand/20 outline-none font-medium transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand transition-colors" size={18} />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-5">
                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex gap-6 text-sm font-bold mr-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "transition-colors text-zinc-500 hover:text-zinc-950",
                                        pathname === link.href && "text-brand"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Account Menu / Sign In */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 hover:bg-zinc-100 rounded-full transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {user.user_metadata?.full_name?.charAt(0) || "U"}
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-[10px] font-black uppercase text-zinc-400 leading-none tracking-tighter">Hi, {user.user_metadata?.full_name?.split(' ')[0]}</p>
                                        <div className="flex items-center gap-1 font-bold text-xs">
                                            Account <ChevronDown size={12} />
                                        </div>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isAccountMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-2 z-[60]"
                                        >
                                            <DropdownItem href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
                                            <DropdownItem href="/dashboard" icon={<Package size={16} />} label="My Orders" />
                                            <DropdownItem href="/dashboard" icon={<Settings size={16} />} label="Settings" />
                                            <div className="h-px bg-zinc-100 my-1" />
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/auth" className="flex items-center gap-2 p-2.5 hover:bg-zinc-100 rounded-full transition-colors font-bold text-sm">
                                <User size={20} className="text-zinc-600" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        )}

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-950 text-white hover:bg-brand transition-all duration-300"
                        >
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand text-[10px] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-black">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
                        >
                            <div className="p-6 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link key={link.name} href={link.href} className="text-lg font-bold text-zinc-900">
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-zinc-100" />
                                <Link href="/dashboard" className="text-lg font-bold text-zinc-900">Track Orders</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}

function DropdownItem({ href, icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 font-bold text-sm transition-all"
        >
            {icon}
            {label}
        </Link>
    );
}