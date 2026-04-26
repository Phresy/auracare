"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, ArrowRight, Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthPage() {
    const router = useRouter();
    const supabase = createClient();

    // States
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/");
                router.refresh();
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
                setSuccessMsg("Check your email for the confirmation link!");
                setEmail("");
                setPassword("");
                setFullName("");
            }
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setSuccessMsg("Password reset link sent! Check your email.");
            setEmail("");
            setTimeout(() => {
                setIsForgotPassword(false);
                setSuccessMsg("");
            }, 3000);
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
                },
            });
            if (error) throw error;
            setSuccessMsg("Magic link sent! Check your email.");
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

                    <AnimatePresence mode="wait">
                        {!isForgotPassword ? (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
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
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1 flex items-center gap-2">
                                                <User size={12} /> Full Name
                                            </label>
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
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1 flex items-center gap-2">
                                            <Mail size={12} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                                        />
                                    </div>
                                    {isLogin && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1 flex items-center gap-2">
                                                <Lock size={12} /> Password
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                                            />
                                        </div>
                                    )}

                                    {errorMsg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm font-bold ml-1 flex items-center gap-2"
                                        >
                                            <AlertCircle size={14} /> {errorMsg}
                                        </motion.p>
                                    )}

                                    {successMsg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-green-600 text-sm font-bold ml-1 flex items-center gap-2"
                                        >
                                            <CheckCircle size={14} /> {successMsg}
                                        </motion.p>
                                    )}

                                    <button
                                        type="submit"
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

                                {/* Forgot Password Link */}
                                {isLogin && (
                                    <p className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotPassword(true)}
                                            className="text-sm text-brand font-bold hover:underline transition"
                                        >
                                            Forgot Password?
                                        </button>
                                    </p>
                                )}

                                {/* Magic Link Option */}
                                {isLogin && email && (
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-zinc-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-zinc-400">Or</span>
                                        </div>
                                    </div>
                                )}

                                {isLogin && email && (
                                    <button
                                        type="button"
                                        onClick={handleMagicLink}
                                        disabled={loading || !email}
                                        className="w-full border-2 border-zinc-200 text-zinc-700 py-4 rounded-2xl font-bold hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Mail size={18} />
                                        Send Magic Link
                                    </button>
                                )}

                                <p className="text-center text-sm text-zinc-500 font-medium">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setErrorMsg("");
                                            setSuccessMsg("");
                                        }}
                                        className="text-brand font-bold hover:underline"
                                    >
                                        {isLogin ? "Create one for free" : "Sign in instead"}
                                    </button>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black tracking-tight text-zinc-950">
                                        Reset Password
                                    </h1>
                                    <p className="text-zinc-500 font-medium">
                                        Enter your email and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={handleForgotPassword}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1 flex items-center gap-2">
                                            <Mail size={12} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-zinc-950"
                                        />
                                    </div>

                                    {errorMsg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm font-bold ml-1 flex items-center gap-2"
                                        >
                                            <AlertCircle size={14} /> {errorMsg}
                                        </motion.p>
                                    )}

                                    {successMsg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-green-600 text-sm font-bold ml-1 flex items-center gap-2"
                                        >
                                            <CheckCircle size={14} /> {successMsg}
                                        </motion.p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand/80 disabled:bg-zinc-400 transition-all group"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                Send Reset Link
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(false);
                                            setErrorMsg("");
                                            setSuccessMsg("");
                                        }}
                                        className="w-full border-2 border-zinc-200 text-zinc-700 py-4 rounded-2xl font-bold hover:border-brand hover:text-brand transition-all"
                                    >
                                        Back to Sign In
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
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