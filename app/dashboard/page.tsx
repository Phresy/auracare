"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Settings,
    LogOut,
    ShoppingBag,
    Clock,
    ChevronRight,
    User,
    Activity,
    ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SettingsPage from "./settings/page"; // Import your settings component

export default function UserDashboard() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. ADDED: State to manage which view is active
    const [activeTab, setActiveTab] = useState("Overview");

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }
            setUser(user);

            const { data: ordersData } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            setOrders(ordersData || []);
            setLoading(false);
        };

        fetchUserData();
    }, [router, supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-brand/20 rounded-full" />
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Loading Dashboard</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-72 bg-white border-r border-zinc-100 flex-col p-8 sticky top-0 h-screen">
                <Link href="/" className="text-xl font-black tracking-tighter uppercase mb-12">AuraCare</Link>

                <nav className="flex-1 space-y-2">
                    <SidebarLink
                        icon={<Activity size={20} />}
                        label="Overview"
                        active={activeTab === "Overview"}
                        onClick={() => setActiveTab("Overview")}
                    />
                    <SidebarLink
                        icon={<Package size={20} />}
                        label="My Orders"
                        active={activeTab === "My Orders"}
                        onClick={() => setActiveTab("My Orders")}
                    />
                    <SidebarLink
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={activeTab === "Settings"}
                        onClick={() => setActiveTab("Settings")}
                    />
                </nav>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-zinc-400 hover:text-red-500 font-bold text-sm transition-colors mt-auto"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-12 max-w-6xl">
                <AnimatePresence mode="wait">
                    {activeTab === "Overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <header className="flex justify-between items-end mb-12">
                                <div>
                                    <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mb-1">Personal Dashboard</p>
                                    <h1 className="text-4xl font-black text-zinc-950">
                                        Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
                                    </h1>
                                </div>
                                <Link href="/pharmacy" className="bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-brand/20">
                                    <ShoppingBag size={18} /> New Order
                                </Link>
                            </header>

                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                                    <div className="bg-zinc-950 p-8 rounded-[2.5rem] text-white space-y-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Package className="text-brand" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black">{orders.length}</h3>
                                            <p className="text-zinc-400 font-medium text-sm">Total Orders Placed</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 space-y-4">
                                        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                                            <Clock className="text-brand" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black">2 Days</h3>
                                            <p className="text-zinc-500 font-medium text-sm">Avg. Delivery Time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand p-8 rounded-[2.5rem] text-white">
                                    <h3 className="font-bold text-lg mb-2 text-white">Verification Status</h3>
                                    <p className="text-white/70 text-sm mb-6">Trust is our priority. We verify all prescriptions manually.</p>
                                    <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <ShieldCheck size={24} className="text-white" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">Account Status</p>
                                            <p className="text-sm font-bold">HIPAA Verified</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Orders Table */}
                                <section className="lg:col-span-3">
                                    <h2 className="text-xl font-bold mb-6 px-2">Recent Orders</h2>
                                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden">
                                        {orders.length > 0 ? (
                                            <div className="divide-y divide-zinc-50">
                                                {orders.slice(0, 5).map((order) => (
                                                    <OrderRow key={order.id} order={order} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-20 text-center">
                                                <p className="text-zinc-400 font-medium">You haven't placed any orders yet.</p>
                                                <Link href="/pharmacy" className="text-brand font-bold mt-2 inline-block underline">Browse the Pharmacy</Link>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "Settings" && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <SettingsPage />
                        </motion.div>
                    )}

                    {activeTab === "My Orders" && (
                        <motion.div
                            key="all-orders"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-3xl font-black mb-8">All Orders</h1>
                            <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden">
                                {orders.map((order) => (
                                    <OrderRow key={order.id} order={order} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// Separate component for order rows for cleaner code
function OrderRow({ order }: { order: any }) {
    return (
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <Package size={20} className="text-zinc-400" />
                </div>
                <div>
                    <p className="font-bold text-zinc-950">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-zinc-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="font-bold text-zinc-950">${order.total_amount?.toFixed(2)}</p>
                    <span className="text-[10px] uppercase font-black text-brand tracking-widest">{order.status}</span>
                </div>
                <ChevronRight size={20} className="text-zinc-300" />
            </div>
        </div>
    );
}

function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/10" : "text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}