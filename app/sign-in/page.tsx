'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "@/lib/redux/userSlice";
import OAuth from "@/components/OAuth";
import { RootState } from "@/lib/redux/store";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            router.push("/");
        } catch (error: any) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md z-10 animate-fade-in-up">
                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-premium border border-white">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-outfit font-extrabold text-primary mb-3">Welcome Back</h1>
                        <p className="text-text-muted">Enter your details to access your account</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    id="email"
                                    className="w-full bg-white/50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-primary"
                                    onChange={handleChange}
                                    required
                                />
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    id="password"
                                    className="w-full bg-white/50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-primary"
                                    onChange={handleChange}
                                    required
                                />
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-premium w-full bg-primary text-white hover:bg-slate-800 py-4 mt-2 shadow-lg shadow-primary/10 group"
                        >
                            {loading ? "Signing in..." : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-white px-4 text-slate-400">Or Secure Login</span>
                            </div>
                        </div>

                        <OAuth />
                    </form>

                    <div className="flex justify-center mt-10 gap-2 text-text-muted font-medium">
                        <p>New to NextHome?</p>
                        <Link href="/sign-up">
                            <span className="text-secondary font-bold hover:underline">Create account</span>
                        </Link>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                            <p className="text-red-600 text-center text-sm font-bold">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
