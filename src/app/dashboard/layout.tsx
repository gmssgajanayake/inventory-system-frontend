"use client";

import Link from "next/link";
import isUser from "@/lib/actions";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "@/app/dashboard/_components/LogoutButton";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [authed, setAuthed] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dateTime, setDateTime] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);
    const [userRole, setUserRole] = useState<string>("USER");


    useEffect(() => {
        (async () => {
            const result = await isUser();

            if (result) {
                setUserRole("USER");
                setAuthed(true);
                if (window.location.pathname.includes("/dashboard/user")) {
                    redirect("/dashboard");
                }
            } else {
                setUserRole("ADMIN");
                setAuthed(true);
            }
        })();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatted = now.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setDateTime(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (authed === null) return null;

    return (
        <div className="w-screen h-screen flex bg-[#05070A] text-white overflow-hidden">
            <div
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 h-full 
          bg-[#0A0E17]/95 lg:bg-[#0A0E17]/80 backdrop-blur-xl border-r border-white/10 
          shadow-lg flex flex-col justify-between transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <p className="text-2xl lg:text-3xl font-extrabold text-center py-4 lg:py-[14px] border-b border-white/10 text-amber-50 tracking-wide">
                    IMS
                </p>

                <nav className="flex flex-col h-full gap-2 px-3 lg:px-4 mt-4">
                    <Link
                        onClick={() => setSidebarOpen(false)}
                        href="/dashboard"
                        className="text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-base lg:text-lg font-medium hover:bg-gray-300/10"
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white w-4 h-4 lg:w-5 lg:h-5"
                            icon={faUser}
                        />
                        Profile
                    </Link>
                    <Link
                        onClick={() => setSidebarOpen(false)}
                        href="/dashboard/inventory"
                        className="text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-base lg:text-lg font-medium hover:bg-gray-300/10"
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white w-4 h-4 lg:w-5 lg:h-5"
                            icon={faBoxesStacked}
                        />
                        Inventory
                    </Link>

                    <Link
                        onClick={() => setSidebarOpen(false)}
                        href="/dashboard/user"
                        className={`text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-base lg:text-lg font-medium hover:bg-gray-300/10 ${
                            userRole === "USER" ? "hidden" : ""
                        }`}
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white w-4 h-4 lg:w-5 lg:h-5"
                            icon={faUsers}
                        />
                        Users
                    </Link>
                </nav>

                <div className="p-3 lg:p-4 border-t flex justify-center items-center cursor-pointer border-white/10">
                    <LogoutButton />
                </div>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <header
                    className="h-16 lg:h-[65px]  flex items-center py-0 justify-between px-4 lg:px-6
          bg-[#0A0E17]/70 backdrop-blur-lg border-b border-white/10 shadow-md"
                >
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            className="lg:hidden p-2 rounded-md hover:bg-white/10"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <p className="text-lg lg:text-xl font-semibold text-amber-50">Dashboard</p>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <span className="text-xs lg:text-sm text-gray-300">Welcome, Staff</span>
                    </div>
                </header>

                <div className="flex-1  overflow-auto">
                    <div className="w-full mt-1  flex justify-center items-center rounded-lg p-2 lg:p-4">
                        <div
                            className="w-full  rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-[1px] shadow-2xl shadow-purple-500/30"
                        >
                            <div className="rounded-lg h-full bg-[#05070A]/90 backdrop-blur-xl p-4 lg:p-8">
                                <div className="rounded-2xl flex justify-center md:justify-between items-center mb-4 lg:mb-6">
                                    <div className="hidden md:block"></div>
                                    <span className="text-xs lg:text-sm font-medium text-gray-200 text-center md:text-right">
                    {isMobile
                        ? new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                        : dateTime
                    }
                  </span>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}