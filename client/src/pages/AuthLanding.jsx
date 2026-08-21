import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Smartphone } from "lucide-react";

export const AuthLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">

            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative flex w-full max-w-md flex-col items-center text-center">

                {/* Logo */}
                <div className="mb-6">
                    <img
                        src="/chat.png"
                        alt="ChatLynk"
                        className="h-32 w-32 object-contain drop-shadow-2xl"
                    />
                </div>

                {/* App Name */}
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    ChatLynk
                </h1>

                {/* Tagline */}
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                    Simple, fast and secure conversations with the people who matter.
                </p>

                {/* Authentication Options */}
                <div className="mt-10 w-full space-y-4">

                    {/* Email & Password */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-left transition-all duration-200 hover:border-blue-500 hover:bg-slate-800/90 active:scale-[0.98]"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            <Mail size={22} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold text-white">
                                Email & Password
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Login or create a new account
                            </p>
                        </div>

                        <span className="text-xl text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400">
                            →
                        </span>
                    </button>

                    {/* Mobile Number */}
                    <button
                        type="button"
                        onClick={() => navigate("/mobile-login")}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-left transition-all duration-200 hover:border-blue-500 hover:bg-slate-800/90 active:scale-[0.98]"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            <Smartphone size={22} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold text-white">
                                Mobile Number
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Continue with OTP
                            </p>
                        </div>

                        <span className="text-xl text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400">
                            →
                        </span>
                    </button>

                </div>

                {/* Footer */}
                <p className="mt-10 text-xs text-slate-600">
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>

            </div>
        </div>
    );
};