"use client";

import SubmitButton from "@/app/(auth)/login/_component/SubmitButton";
import {useActionState, useState} from "react";
import { login } from "@/lib/actions";

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(login, undefined);
    const [isClicked,setClick]=useState(false);


    const handleClick = () => {
        setClick(!isClicked);
    };


    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
            <div className="w-[90%] max-w-md rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-[2px] shadow-2xl shadow-purple-500/30">
                <div className="rounded-3xl bg-[#05070A]/90 backdrop-blur-xl p-8">

                    <h1 className="text-4xl font-extrabold text-center text-amber-50 tracking-wide mb-8">
                        Login to Your Account
                    </h1>


                    <form action={dispatch} className="flex flex-col gap-6">

                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full px-4 py-3 text-lg rounded-xl border border-white/20 bg-white/5
                           text-white placeholder-gray-400  focus:outline-none"

                            />
                        </div>


                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full text-lg px-4 py-3 rounded-xl border border-white/20 bg-white/5
                           text-white placeholder-gray-400
                           focus:outline-none
                          "
                            />
                        </div>


                        <SubmitButton />


                        {errorMessage && (
                            <p className="text-red-600 mt-2  text-center animate-pulse">
                                {errorMessage}
                            </p>
                        )}
                    </form>


                    <div className="mt-6 text-center">
                        <a  onClick={handleClick}
                            href="#"
                            className="text-sm text-purple-400 hover:text-purple-300 transition"
                        >
                            {
                                !isClicked ? "Who can register ?" : "Only admins can register you !"
                            }
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
