import LoginForm from "@/app/(auth)/login/_component/LoginForm";
import {isAuthenticated} from "@/lib/actions";
import {redirect} from "next/navigation";

export  default async function LoginPage() {

    const authed = await isAuthenticated();

    if (authed) {
        redirect('/dashboard');
    }

    return(
            <div>
                <LoginForm />
            </div>
        );
}