import Link from "next/link";
import LogoutButton from "@/app/dashboard/_components/LogoutButton";
import {isAuthenticated} from "@/lib/actions";
import {redirect} from "next/navigation";


export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {



    const authed = await isAuthenticated();

    if (!authed) {
        redirect('/login');
    }


    return (
        <div className={"w-screen h-screen flex justify-center items-center bg-[#05070A] text-white"}>
            <div className="">
                Dashboard Layout
            </div>

            <Link href={"/dashboard/Inventory"}>Inventory</Link>
            <br/>
            <Link href={"/dashboard/user"}>User</Link>

            <br/>

            <LogoutButton/>
            {children}
        </div>
    );
}
