"use client"
import Link from "next/link";
import { useState } from "react";

export default function Login() {

    const [formData, setFormData] = useState({});

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    return (
        <div className="bg-gray-200 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-gray-500 text-4xl font-bold mb-6">Login</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                            onChange={(event) => handleInputChange(event)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                            onChange={(event) => handleInputChange(event)}
                        />
                    </div>
                </form>
                <div className="mt-4 text-center flex items-center justify-center">
                    <button
                        type="submit"
                        className="block py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <Link className="text-gray-500 text-sm hover:underline"
                        href="/">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}