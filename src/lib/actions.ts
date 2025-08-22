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


export async function getToken(): Promise<string | null> {
    return await getSessionToken();
}


export async function getUserInfo(): Promise<JWTPayload | null> {

    const token = await getSessionToken();
    if (!token) {
        return null;
    }

    try {
        const decoded: JWTPayload = jwtDecode<JWTPayload>(token);
        return decoded;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}


export async function getAllUsers(): Promise<JWTPayload[] | null> {
    const token = await getSessionToken();
    if (!token) {
        return null;
    }

    try {
        const res = await fetch('http://localhost:8080/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        return data.data as JWTPayload[];
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return null;
    }
}


export async function addUser(prevState: string | undefined, formData: FormData) {


    const token = await getSessionToken();
    if (!token) {
        return null;
    }


    try {
        const username = formData.get('username');
        const password = formData.get('password');
        const role = formData.get('role');


        console.log(`Adding user with username: ${username}, role: ${role}, password: ${password}`);

        const res = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({username, password, role}),

        });

        console.log(res)

        return res.ok;

    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'Can\'t register user at this time.';
    }

}


export async function deleteUser(id: number): Promise<{ success: boolean; message?: string }> {


    console.log("ewdewd")

    const token = await getSessionToken();
    if (!token) {
        return {success: false, message: 'Not authenticated'};
    }

    try {
        const res = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to delete user');
        }

        return {success: true, message: 'User deleted successfully'};
    } catch (error) {
        console.error('Failed to delete user:', error);
        return {success: false, message: error instanceof Error ? error.message : 'An unknown error occurred.'};
    }
}


export async function updateUser(prevState: string | undefined, formData: FormData) {

    const token = await getSessionToken();
    if (!token) {
        return null;
    }

    try {
        const id = formData.get('id');
        const username = formData.get('username');
        const password = formData.get('password');
        const role = formData.get('role');

        console.log(`Updating user with ID: ${id}, username: ${username}, role: ${role}`);

        const res = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({username, password, role}),
        });

        return res.ok;

    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'Can\'t update user at this time.';
    }
}


export async function getAllItems(): Promise<JWTPayload[] | null> {
    const token = await getSessionToken();
    if (!token) {
        return null;
    }

    try {
        const res = await fetch('http://localhost:8080/api/items');

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        return data.data as JWTPayload[];
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return null;
    }
}


export async function updateItems(prevState: string | undefined, formData: FormData) {

    const token = await getSessionToken();
    if (!token) {
        return {success: false, message: 'Not authenticated'};
    }

    try {
        const id = formData.get('id');
        const name = formData.get('name');
        const description = formData.get('description');
        const quantity = formData.get('quantity');
        const price = formData.get('price');

        const res = await fetch(`http://localhost:8080/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({name, description, quantity, price}),
        });


        if (!res.ok) {
            const errorData = await res.json();
            return {success: false, message: errorData.message || 'Failed to update item.'};
        }

        return {success: true, message: 'Item updated successfully.'};

    } catch (error) {
        // ... (error handling)
        return {success: false, message: 'An unknown error occurred.'};
    }
}


export async function deleteItem(id: number): Promise<{ success: boolean; message?: string }> {

    const token = await getSessionToken();
    if (!token) {
        return {success: false, message: 'Not authenticated'};
    }

    try {
        const res = await fetch(`http://localhost:8080/api/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to delete item');
        }

        return {success: true, message: 'Item deleted successfully'};
    } catch (error) {
        console.error('Failed to delete item:', error);
        return {success: false, message: error instanceof Error ? error.message : 'An unknown error occurred.'};
    }
}


export async function addItems(prevState: string | undefined, formData: FormData) {


    const token = await getSessionToken();
    if (!token) {
        return {success: false, message: 'Not authenticated'};
    }


    try {

        const name = formData.get('name');
        const description = formData.get('description');
        const quantity = Number(formData.get('quantity'));
        const price = Number(formData.get('price'));

        const res = await fetch('http://localhost:8080/api/items/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // Send the correct item data
            body: JSON.stringify({name, description, quantity, price}),
        });

        console.log(res)

        if (!res.ok) {
            return {success: false, message: 'Failed to add item.'};
        }

        return {success: true, message: 'Item added successfully.'};

    } catch (error) {
        return {success: false, message: 'An unknown error occurred.'};
    }
}


export default async function isUser() {
    const user = await getUserInfo();
    return user?.role === 'USER';
}
