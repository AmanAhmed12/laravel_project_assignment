"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    VideoStore
                </Link>
                <div className="flex gap-4 items-center">
                    <Link href="/" className="hover:text-gray-300">Home</Link>
                    {isAuthenticated && user?.role === 'admin' && (
                        <>
                            <Link href="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            <Link href="/admin/upload" className="hover:text-gray-300">Upload</Link>
                        </>
                    )}
                    {isAuthenticated && user?.role !== 'admin' && (
                        <Link href="/dashboard" className="hover:text-gray-300">My Purchases</Link>
                    )}
                    {isAuthenticated ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="text-gray-300 hover:text-white transition">
                                Login
                            </Link>
                            <Link href="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div >
        </nav >
    );
}
