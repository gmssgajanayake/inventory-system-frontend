// lib/actions.ts
'use server';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {jwtDecode} from "jwt-decode";


interface JWTPayload {
    role: string;
    id: number;
    username: string;
    sub: string;
    iat: number;
    exp: number;
}

export async function login(prevState: string | undefined, formData: FormData) {
    try {
        const username = formData.get('username');
        const password = formData.get('password');

        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        const data = await res.json();


        if (data.statusCode !== 200) {
            return data.message || 'Login failed. Please check your credentials.';
        }

        const token = data.data.token;
        const decoded: JWTPayload = jwtDecode<JWTPayload>(token);
        const expireDate = new Date(decoded.exp * 1000);


        (await cookies()).set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            expires: new Date(expireDate), // Use the expiry date from the API
            path: '/',
            sameSite: 'strict', // Helps prevent CSRF
        });


    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unknown error occurred.';
    }
    redirect('/dashboard');
}


export async function logout() {

    (await cookies()).set('session_token', '', {expires: new Date(0)});
    redirect('/login');
}


export async function getSessionToken(): Promise<string | null> {
    return (await cookies()).get("session_token")?.value || null;
}


export async function isAuthenticated(): Promise<boolean> {
    const token = await getSessionToken();
    return !!token;
}