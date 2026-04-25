"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, Loader2, Mail } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // THE MASTER ACCESS KEY
    const MASTER_KEY = "admin_2026";

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 1. Simulating a quick network check for the aesthetic
        setTimeout(() => {
            if (password === MASTER_KEY) {
                // 2. Set a session flag so the Admin Page knows you're clear
                sessionStorage.setItem("is_staff_authenticated", "true");

                // 3. Force move to dashboard
                window.location.assign("/admin");
            } else {
                setError("ACCESS DENIED: INVALID SECURITY KEY");
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <ShieldCheck className="text-zinc-950" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight italic">STAFF PROTOCOL</h1>
                    <p className="text-zinc-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Administrative Access Only</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-2 text-left block">Identity Verified</label>
                        <div className="relative opacity-50">
                            <input
                                type="email"
                                disabled
                                value="obenggyanp@gmail.com"
                                className="w-full bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-2xl p-4 outline-none pl-12 cursor-not-allowed"
                            />
                            <Mail className="absolute left-4 top-4 text-zinc-600" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-2 text-left block">Security Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-zinc-800 text-white rounded-2xl p-4 focus:ring-2 focus:ring-white outline-none transition-all pl-12"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-4 text-zinc-600" size={18} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-white text-zinc-950 font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Initialize Access <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}