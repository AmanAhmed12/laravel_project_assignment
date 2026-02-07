"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    const logoHref = isAuthenticated
        ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
        : '/';

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href={logoHref} className="text-2xl font-bold tracking-tighter group flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
                    </div>
                    <span className="text-white">Video</span>
                    <span className="text-indigo-400">Lux</span>
                </Link>

                <div className="flex gap-8 items-center">
                    {!isAuthenticated && (
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm">Home</Link>
                    )}

                    {isAuthenticated && user?.role === 'admin' && (
                        <>
                            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm relative group">
                                Admin Dashboard
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all"></div>
                            </Link>
                            <Link href="/admin/upload" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm relative group">
                                Studio
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all"></div>
                            </Link>
                        </>
                    )}

                    {isAuthenticated && user?.role !== 'admin' && (
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm relative group">
                            My Library
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all"></div>
                        </Link>
                    )}

                    <div className="h-4 w-[1px] bg-white/10 mx-2" />

                    {isAuthenticated ? (
                        <div className="flex gap-6 items-center">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 pr-2 pl-4 py-1.5 rounded-full">
                                <span className="text-xs font-bold text-gray-400 tracking-wider">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-500/10">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2 rounded-xl transition-all border border-rose-500/10 font-bold text-xs uppercase tracking-widest"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="text-gray-400 hover:text-white px-4 py-2 transition-colors font-semibold text-sm">
                                Sign In
                            </Link>
                            <Link href="/register" className="btn-primary !px-5 !py-2.5 !text-sm">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
