"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthPage() {
    const router = useRouter();
    const supabase = createClient();

    // States
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                });
                if (error) throw error;
                alert("Check your email for the confirmation link!");
            }

            router.push("/");
            router.refresh();
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side: The Form */}
            <div className="flex items-center justify-center p-8 lg:p-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-10"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group w-fit">
                        <div className="bg-brand w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:scale-105">
                            <Pill className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tighter uppercase">AuraCare</span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-zinc-950">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            {isLogin ? "Access your prescriptions and health dashboard." : "Start your journey to better health today."}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleAuth}>
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                                />
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-red-500 text-sm font-bold ml-1 animate-pulse">{errorMsg}</p>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand disabled:bg-zinc-400 transition-all group shadow-xl shadow-zinc-950/10 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Register"}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500 font-medium">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-brand font-bold hover:underline"
                        >
                            {isLogin ? "Create one for free" : "Sign in instead"}
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* Right Side: The Visual */}
            <div className="hidden lg:block bg-zinc-50 m-6 rounded-[2.5rem] overflow-hidden relative">
                <img
                    src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1000&auto=format&fit=crop"
                    className="w-full h-full object-cover mix-blend-multiply opacity-60 transition-transform duration-1000 hover:scale-105"
                    alt="Healthcare background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent" />
                <div className="absolute bottom-16 left-16 right-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl"
                    >
                        <p className="text-xl font-bold text-zinc-950 leading-relaxed italic">
                            "The interface is so clean, I actually enjoy managing my vitamins. Best pharmacy experience I've had."
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold">AR</div>
                            <div>
                                <p className="font-bold text-zinc-950 text-sm">Alex Rivera</p>
                                <p className="text-zinc-500 text-xs uppercase tracking-widest font-black">Verified Patient</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}