'use client';
import { logout } from '@/lib/actions';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

export default function LogoutButton() {
    const handleLogout = async () => {
        await logout();
    };

    return (
        <button onClick={handleLogout} className="btn cursor-pointer w-full h-full gap-x-3 flex items-center justify-center">
            Logout
            <FontAwesomeIcon icon={faRightFromBracket}/>
        </button>
    );
}
