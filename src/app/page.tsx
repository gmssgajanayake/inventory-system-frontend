import welcomeImage from "@/assets/welcome.png";
import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <div className="w-screen flex-col h-screen flex justify-center bg-[#05070A] items-center">
            {/* Navbar */}
            <nav className="w-full flex justify-center h-1/12">
                <div className="bg-gradient-to-r text-sm gap-x-1.5 from-pink-500 via-purple-600 to-blue-600 text-white w-full h-full flex justify-center items-center">
                    <Image
                        className="rotate-[-10deg]"
                        src={welcomeImage}
                        width={28}
                        height={28}
                        alt=""
                    />
                    <p className="ml-2">
                        Welcome to&nbsp;
                        <span className="border-b border-white animate-pulse cursor-pointer">
              Inventory Management System
            </span>
                        &nbsp;!
                    </p>
                    <Link
                        href="/login"
                        className="ml-4 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
                    >
                        Get started
                    </Link>
                </div>
            </nav>

            {/* Body Area */}
            <div className="flex flex-col justify-center items-center w-full h-11/12 text-center px-4">
                <h1 className="text-6xl md:text-8xl text-amber-50 font-bold mb-6 animate-pign">
                    Inventory Management System
                </h1>
                <p className="text-gray-300 mb-10 max-w-3xl text-2xl md:text-3xl">
                    Manage your stock, sales, and products efficiently with our modern
                    Inventory Management System. Fast, reliable, and easy-to-use.
                </p>

                <div className="  mb-5">
                    <FontAwesomeIcon className={"animate-bounce"} icon={faChevronDown} width={30} height={30} color={"white"} size="sm" />
                </div>

                <Link
                    href="/login"
                    className="px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    Get started
                </Link>
            </div>
        </div>
    );
}
