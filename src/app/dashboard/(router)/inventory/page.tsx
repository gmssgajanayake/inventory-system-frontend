"use client";

import {getAllItems, deleteItem, updateItems, addItems, getUserInfo} from "@/lib/actions";
import { useEffect, useState, useTransition } from "react";

type ItemType = {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
};

const getPriceFormat = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
    }).format(price);
}

export default function Inventory() {
    const [items, setItems] = useState<ItemType[]>([]);
    const [editingItem, setEditingItem] = useState<ItemType | null>(null);

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [price, setPrice] = useState<string>("");

    const [isPending, startTransition] = useTransition();
    const [userRole, setUserRole] = useState<string>("");


    useEffect(() => {
        async function fetchItems() {
            const allItems = await getAllItems();
            if (allItems) setItems(allItems as unknown as ItemType[]);
        }
        fetchItems();
    }, []);



    useEffect(() => {
        async function getCurrentLoginUserRole() {
            const userInfo = await getUserInfo();
            return userInfo?.role
        }
        getCurrentLoginUserRole().then((role) => {
            setUserRole(role || "");
        });
    }, [userRole]);


    const handleEditClick = (item: ItemType) => {
        setEditingItem(item);
        setName(item.name);
        setDescription(item.description);
        setQuantity(item.quantity.toString());
        setPrice(item.price.toString());
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setEditingItem(null);
        setName("");
        setDescription("");
        setQuantity("");
        setPrice("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("quantity", String(Number(quantity)));
        formData.append("price", String(Number(price)));

        startTransition(async () => {
            let result;
            if (editingItem) {
                formData.append("id", editingItem.id.toString());
                result = await updateItems("", formData);
            } else {
                result = await addItems("", formData);
            }

            if (result?.success) {
                resetForm();
                const allItems = await getAllItems();
                if (allItems) setItems(allItems as unknown as ItemType[]);
            } else {
                alert(`Error: ${result?.message || "An unexpected error occurred."}`);
            }
        });
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            startTransition(async () => {
                const result = await deleteItem(id);

                if (result.success) {
                    const allItems = await getAllItems();
                    if (allItems) setItems(allItems as unknown as ItemType[]);
                } else {
                    alert(`Error: ${result.message}`);
                }
            });
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4">
                {editingItem ? `Editing Item: ${editingItem.name}` : "Add a New Item"}
            </h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col md:flex-row flex-wrap items-stretch gap-4 md:gap-6 mb-8"
            >
                <input type="hidden" name="id" value={editingItem?.id || ""} />

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <input
                        name="name"
                        type="text"
                        className="bg-transparent outline-none w-full"
                        placeholder="Item Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={userRole==="USER" && !!editingItem}
                    />
                </div>

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <input
                        name="description"
                        type="text"
                        className="bg-transparent outline-none w-full"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required={!editingItem}
                        disabled={userRole==="USER" && !!editingItem}
                    />
                </div>

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <input
                        name="price"
                        type="number"
                        className="bg-transparent outline-none w-full"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required={!editingItem}
                        disabled={userRole==="USER" && !!editingItem}
                    />
                </div>

                <div className="flex-1 min-w-0 rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-3">
                    <input
                        name="quantity"
                        type="number"
                        className="bg-transparent outline-none w-full"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required={!editingItem}
                    />
                </div>

                <div className="flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`flex-1 text-white px-4 py-3 rounded-xl cursor-pointer ${
                            isPending
                                ? "bg-gray-500"
                                : editingItem
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isPending
                            ? "Saving..."
                            : editingItem
                                ? "Update Item"
                                : "+ Add Item"}
                    </button>
                    {editingItem && (
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

            {/* Items Display */}
            <div>
                <h2 className="text-lg md:text-xl font-bold mb-4">Existing Items</h2>

                {items.length > 0 ? (
                    <>
                        {/* Mobile View - Cards */}
                        <div className="block md:hidden space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <span className="text-sm text-gray-400">ID: {item.id}</span>
                                    </div>
                                    <p className="text-gray-300 mb-3">{item.description}</p>
                                    <div className="flex justify-between mb-3">
                                        <div>
                                            <span className="text-sm text-gray-400">Quantity:</span>
                                            <span className="ml-2">{item.quantity}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-400">Price:</span>
                                            <span className="ml-2">{item.price}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item.id)}
                                            className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700`}
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
                                    <th className="p-3">Item Name</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3 ">Price</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-gray-700 hover:bg-gray-900/50"
                                    >
                                        <td className="p-3">{u.id}</td>
                                        <td className="p-3">{u.name}</td>
                                        <td className="p-3 capitalize">{u.description}</td>
                                        <td className="p-3">{u.quantity}</td>
                                        <td className="p-3"> {getPriceFormat(u.price)}</td>
                                        <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="px-3 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            {
                                                userRole === "ADMIN" && (
                                                    <button
                                                        onClick={() => handleDeleteClick(u.id)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p>No items found.</p>
                )}
            </div>
        </div>
    );
}