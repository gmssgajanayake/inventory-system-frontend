"use client";

import {addUser, getAllUsers, updateUser, deleteUser, getUserInfo} from "@/lib/actions";
import { useEffect, useState, useTransition } from "react";

type UserType = {
    id: number;
    username: string;
    role: "ADMIN" | "USER" | string;
};

export default function User() {
    const [users, setUsers] = useState<UserType[]>([]);

    const [editingUser, setEditingUser] = useState<UserType | null>(null);


    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<UserType["role"]>("USER");


    const [curentUser,setCurrentUser]=useState<string>("");


    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let isMounted = true;

        async function fetchUsers() {
            try {
                const [allUsers, loginUser] = await Promise.all([
                    getAllUsers(),
                    getUserInfo(),
                ]);

                if (!isMounted) return;

                setCurrentUser(loginUser?.username || "");
                if (allUsers) setUsers(allUsers as UserType[]);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();

        return () => {
            isMounted = false; // cleanup to avoid memory leak
        };
    }, []);


    const handleEditClick = (user: UserType) => {
        setEditingUser(user);
        setUsername(user.username);
        setRole(user.role);
        setPassword("");
        window.scrollTo(0, 0);
    };


    const resetForm = () => {
        setEditingUser(null);
        setUsername("");
        setPassword("");
        setRole("USER");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        formData.append("role", role);
        if (password) {
            formData.append("password", password);
        }

        startTransition(async () => {
            let result;
            if (editingUser) {
                formData.append("id", editingUser.id.toString());
                result = await updateUser("", formData);
            } else {
                result = await addUser("", formData);
            }

            if (result) {
                resetForm();
                const allUsers = await getAllUsers();
                if (allUsers) setUsers(allUsers as UserType[]);
            } else {
                alert(`Error: ${result}`);
            }
        });
    };


    const handleDeleteClick = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            startTransition(async () => {
                const result = await deleteUser(id);
                if (result.success) {
                    const allUsers = await getAllUsers();
                    if (allUsers) setUsers(allUsers as UserType[]);
                } else {
                    alert(`Error: ${result.message}`);
                }
            });
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4">
                {editingUser ? `Editing User: ${editingUser.username}` : "Add a New User"}
            </h1>


            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col md:flex-row flex-wrap items-stretch gap-4 md:gap-6 mb-8"
            >
                <input type="hidden" name="id" value={editingUser?.id || ""} />

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <input
                        name="username"
                        className="bg-transparent outline-none w-full"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={!!editingUser}
                    />
                </div>

                <div className={ `flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border ${editingUser ? "hidden" : "block"} border-white/10 shadow-xl p-3`}>
                    <input
                        name="password"
                        type="password"
                        className={`bg-transparent outline-none w-full `}
                        placeholder={ "Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!!editingUser}
                    />
                </div>

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <select
                        name="role"
                        className="bg-transparent outline-none w-full"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <div className="flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`flex-1 text-white px-4 py-3 rounded-xl cursor-pointer ${
                            isPending
                                ? "bg-gray-500"
                                : editingUser
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isPending ? "Saving..." : editingUser ? "Update User" : "+ Add User"}
                    </button>
                    {editingUser && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 md:flex-initial bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <hr className="my-6 border-gray-700" />

            <div>
                <h2 className="text-lg md:text-xl font-bold mb-4">Existing Other Users</h2>

                {users.length > 1 ? (
                    <>
                        <div className="block md:hidden space-y-4">
                            {users.map((user) => (
                                user.username!==username &&
                                <div
                                    key={user.id}
                                    className="rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg ">{user.username}</h3>
                                        <span className="text-sm text-gray-400">ID: {user.id}</span>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-sm text-gray-400">Role:</span>
                                        <span className="ml-2 capitalize">{user.role}</span>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="hidden md:block overflow-x-auto border rounded-lg">
                            <table className="w-full min-w-[600px] text-left border-collapse">
                                <thead className="bg-gray-800 text-white sticky top-0">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((u) => (
                                    u.username !== curentUser &&
                                    <tr
                                        key={u.id}
                                        className="border-b border-gray-700 hover:bg-gray-900/50"
                                    >
                                        <td className="p-3">{u.id}</td>
                                        <td className="p-3">{u.username}</td>
                                        <td className="p-3 capitalize">{u.role}</td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="px-3 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(u.id)}
                                                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p>No any other users found.</p>
                )}
            </div>
        </div>
    );
}