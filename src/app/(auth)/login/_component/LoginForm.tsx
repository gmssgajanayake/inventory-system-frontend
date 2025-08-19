"use client";

import SubmitButton from "@/app/(auth)/login/_component/SubmitButton";
import {useActionState} from "react";
import {login} from "@/lib/actions";

export default function LoginForm(){

    const [errorMessage, dispatch] = useActionState(login, undefined);

    return(
        <div>
            <div>
                <h1>Login</h1>
                <form action={dispatch}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" defaultValue="admin" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" defaultValue="admin123" required />
                    </div>
                    <SubmitButton />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}