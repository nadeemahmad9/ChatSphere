// import React, { useContext, useState } from 'react'
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from '../context/AuthContext';

// export const Login = () => {
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const { login } = useContext(AuthContext)

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log(formData);


//         const data = await login(formData);
//         console.log(data);

//         if (data.success) {
//             navigate("/");
//         } else {
//             alert(data.message)
//         }
//     }
//     return (
//         <form onSubmit={handleSubmit}>

//             <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//             />

//             <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//             />

//             <button type="submit">
//                 Login
//             </button>

//         </form>
//     )
// }


import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(formData);

            if (data.success) {
                navigate("/home");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 flex items-center justify-center">

            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">

                    {/* Header */}
                    <div className="mb-8 text-center">

                        {/* Logo */}
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <LogIn className="text-white" size={28} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Login to continue to ChatSphere
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98]"
                        >
                            <LogIn size={19} />
                            Login
                        </button>

                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Create account
                        </button>
                    </p>

                </div>

            </div>
        </div>
    );
};