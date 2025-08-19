import LoginForm from "@/app/(auth)/login/_component/LoginForm";
import {isAuthenticated} from "@/lib/actions";
import {redirect} from "next/navigation";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export  default async function LoginPage() {

    const authed = await isAuthenticated();
    await delay(500);

    if (authed) {
        redirect('/dashboard');
    }

    return(
            <div className={"w-screen h-screen flex justify-center items-center bg-[#05070A]"}>
                <LoginForm />
            </div>
        );
}