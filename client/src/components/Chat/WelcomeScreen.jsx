import { MessageCircle, ShieldCheck, Zap } from "lucide-react";

const WelcomeScreen = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 px-6 text-center mt-4">

            {/* Hero Icon */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/20">
                <MessageCircle size={42} className="text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white">
                Welcome to ChatSphere
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                Select a conversation from the sidebar to start secure,
                real-time messaging with your friends.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800">
                    <Zap className="mx-auto mb-3 text-yellow-400" size={26} />
                    <h3 className="font-semibold text-white">
                        Real-time
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                        Instant messaging powered by Socket.IO.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-green-500 hover:bg-slate-800">
                    <ShieldCheck
                        className="mx-auto mb-3 text-green-400"
                        size={26}
                    />
                    <h3 className="font-semibold text-white">
                        Secure
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                        JWT authentication with protected routes.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800">
                    <MessageCircle
                        className="mx-auto mb-3 text-cyan-400"
                        size={26}
                    />
                    <h3 className="font-semibold text-white">
                        Modern UI
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                        Clean, responsive interface built with Tailwind CSS.
                    </p>
                </div>

            </div>

        </div>
    );
};

export default WelcomeScreen;