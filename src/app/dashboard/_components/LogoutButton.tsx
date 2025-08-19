'use client';
import { logout } from '@/lib/actions';

export default function LogoutButton() {
    const handleLogout = async () => {
        await logout();
    };

    return (
        <button onClick={handleLogout} className="btn">
            Logout
        </button>
    );
}
