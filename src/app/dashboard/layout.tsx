"use client";

import Link from "next/link";

import {isAuthenticated} from "@/lib/actions";
import {redirect} from "next/navigation";
import {useState, useEffect} from "react";
import {Menu, X} from "lucide-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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


    useEffect(() => {
        (async () => {
            const result = await isAuthenticated();
            if (!result) {
                redirect("/login");
            } else {
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

    if (authed === null) return null; // prevent flicker




    return (
        <div className="w-screen h-screen flex bg-[#05070A] text-white">
            <div
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 h-full 
          bg-[#0A0E17]/80 backdrop-blur-xl border-r border-white/10 
          shadow-lg flex flex-col justify-between transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <p className="text-3xl font-extrabold text-center py-[14px] border-b border-white/10 text-amber-50 tracking-wide">
                    IMS
                </p>

                <nav className="flex flex-col h-full gap-2 px-4 mt-4">
                    <Link  onClick={() => setSidebarOpen(false)}
                        href="/dashboard"
                        className="text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-lg font-medium hover:bg-gray-300/10"
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white"
                            icon={faUser}
                        />
                        Profile
                    </Link>
                    <Link  onClick={() => setSidebarOpen(false)}
                        href="/dashboard/inventory"
                        className="text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-lg font-medium hover:bg-gray-300/10"
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white"
                            icon={faBoxesStacked}
                        />
                        Inventory
                    </Link>
                    <Link  onClick={() => setSidebarOpen(false)}
                        href="/dashboard/user"
                        className="text-gray-200 group px-3 flex gap-3 items-center py-2 rounded-xl transition text-lg font-medium hover:bg-gray-300/10"
                    >
                        <FontAwesomeIcon
                            className="bg-gray-300/10 p-2 text-blue-600 rounded-lg transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white"
                            icon={faUsers}
                        />
                        Users
                    </Link>
                </nav>

                <div className="p-4 border-t flex justify-center items-center cursor-pointer border-white/10">
                    <LogoutButton/>
                </div>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col">

                <header
                    className="h-18 flex items-center  py-4 md:py-0 justify-between px-6
          bg-[#0A0E17]/70 backdrop-blur-lg border-b border-white/10 shadow-md"
                >
                    <div className="flex items-center gap-4">

                        <button
                            className="lg:hidden p-2 rounded-md hover:bg-white/10"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                        </button>
                        <p className="text-xl font-semibold text-amber-50">Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">Welcome, Staff</span>
                    </div>
                </header>

                    <div data-aos="zoom-in" className="w-full h-full rounded-lg p-4">
                        <div
                            className="w-full h-full rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-[1px] shadow-2xl shadow-purple-500/30">
                            <div className="rounded-lg h-full bg-[#05070A]/90 backdrop-blur-xl p-8">
                                <div className="rounded-2xl flex justify-center md:justify-between items-center   mb-6">
                                    <div className=""></div>
                                    <span className=" h-8 font-medium text-gray-200">{dateTime}</span>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
}
