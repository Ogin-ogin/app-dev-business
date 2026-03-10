"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { signInWithGoogle, signInWithEmail, signUp, currentUser, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Redirect if already logged in
    if (!loading && currentUser) {
        router.replace("/dashboard");
        return null;
    }

    const handleGoogle = async () => {
        setError("");
        setSubmitting(true);
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Google sign-in failed";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Authentication failed";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#191919] p-6 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>

            <div className="w-full max-w-sm">
                <div className="text-center mb-10 border-b border-black/[0.1] dark:border-white/[0.1] pb-6">
                    <h1 className="text-2xl font-bold mb-2">{isSignUp ? "Sign up" : "Log in"}</h1>
                    <p className="text-black/60 dark:text-white/60 text-sm">
                        Continue to AI App Platform
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGoogle}
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-3 border border-black/[0.1] dark:border-white/[0.1] rounded-md py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors font-medium disabled:opacity-50"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/[0.1] dark:border-white/[0.1]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#191919] px-2 text-black/40 dark:text-white/40">or</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-black/[0.1] dark:border-white/[0.1] rounded-md py-3 px-4 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff47]/50"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-black/[0.1] dark:border-white/[0.1] rounded-md py-3 px-4 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff47]/50"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-md py-3 bg-[#d4ff47] text-black font-medium hover:bg-[#c5f035] transition-colors disabled:opacity-50"
                        >
                            {submitting ? "..." : isSignUp ? "Create account" : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-black/60 dark:text-white/60">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                            className="text-black dark:text-white font-medium hover:underline"
                        >
                            {isSignUp ? "Log in" : "Sign up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
