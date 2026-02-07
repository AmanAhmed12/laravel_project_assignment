"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const { showToast } = useToast();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            showToast("Login successful!", "success");
            login(data.access_token, data.user);
        } catch (err: any) {
            setError(err.message);
            showToast(err.message || "Login failed", "error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] px-6">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="glass-card p-10 w-full max-w-md animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gradient mb-3">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to access your premium library</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full !py-4 text-lg">
                        Sign In
                    </button>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Create Account</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
