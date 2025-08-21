"use client";

import { addUser, getAllUsers, updateUser, deleteUser } from "@/lib/actions";
import { useEffect, useState, useTransition } from "react";

type UserType = {
    id: number;
    username: string;
    role: "ADMIN" | "USER" | string;
};

export default function User() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // State to manage which user is being edited
    const [editingUser, setEditingUser] = useState<UserType | null>(null);

    // Form state
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<UserType["role"]>("USER"); // ✅ default role USER

    // For handling pending states of server actions
    const [isPending, startTransition] = useTransition();

    // Fetch users initially
    useEffect(() => {
        async function fetchUsers() {
            const allUsers = await getAllUsers();
            if (allUsers) setUsers(allUsers as UserType[]);
        }
        fetchUsers();
    }, [searchQuery]);

    // Edit user
    const handleEditClick = (user: UserType) => {
        setEditingUser(user);
        setUsername(user.username);
        setRole(user.role);
        setPassword("");
        window.scrollTo(0, 0);
    };

    // Reset form
    const resetForm = () => {
        setEditingUser(null);
        setUsername("");
        setPassword("");
        setRole("USER"); // ✅ reset role to USER
    };

    // Submit handler
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

    // Delete user
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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                {editingUser ? `Editing User: ${editingUser.username}` : "Add a New User"}
            </h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="w-full flex items-start gap-6 p-2 mb-8"
            >
                <input type="hidden" name="id" value={editingUser?.id || ""} />

                <div className="flex-1 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4">
                    <input
                        name="username"
                        className="bg-transparent outline-none w-full"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="flex-1 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4">
                    <input
                        name="password"
                        type="password"
                        className="bg-transparent outline-none w-full"
                        placeholder={editingUser ? "New Password (optional)" : "Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!editingUser}
                    />
                </div>

                <div className="flex-1 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4">
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

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`w-40 text-white px-4 py-4 rounded-xl cursor-pointer ${
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
                            className="w-28 bg-gray-600 hover:bg-gray-700 text-white px-4 py-4 rounded-xl"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <hr className="my-6 border-gray-700" />

            {/* Users Table */}
            <div>
                <h2 className="text-xl font-bold mb-4">Existing Users</h2>

                {users.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-left border-collapse">
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
                                            className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(u.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
}
