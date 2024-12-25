"use client";

import React, {useState} from "react";
import Navbar from "@/app/navbar";
import decodeToken from "@/utils/decodeToken";
import {useRouter} from "next/navigation";

interface QuizProps {
    creatorId: string,
    title: string,
    description: string,
    timeDuration: string,
    state: string,
    dueDate: string,
}

export default function AddQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token: string = sessionStorage.getItem("authToken") || "";
        const creatorId = decodeToken(token)?.sub || "";
        postQuiz({
            creatorId: typeof creatorId === "string" ? creatorId : creatorId(),
            title: title,
            description: description,
            timeDuration: time,
            state: "Init",
            dueDate: `${date}T00:00:00`,
        }).then(() => router.push('/quizzes'))
    };

    const postQuiz = async (data: QuizProps) => {
        const token = window.sessionStorage.getItem("authToken");
        const postQuizUrl = `/api/squiz/v1/quiz`

        const response = await fetch(postQuizUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to create Quiz!');
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar/>
            <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
                >
                    <h1 className="text-2xl font-bold mb-6 text-center">Create New Quiz</h1>

                    {/* Title Input */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-base font-bold text-gray-700">
                            Quiz Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                title ? "text-gray-500" : "text-gray-400"
                            }`}
                            placeholder="Enter the title"
                        />
                    </div>

                    {/* Description Text Area */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-base font-bold text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y max-h-40 ${
                                description ? "text-gray-500" : "text-gray-400"
                            }`}
                            rows={4}
                            placeholder="Enter the description"
                        />
                    </div>

                    {/* Number Selector Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="number" className="block text-base font-bold text-gray-700">
                            Quiz Duration
                        </label>
                        <select
                            id="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                time ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                            <option value="" disabled className="text-gray-400">
                                Select quiz duration
                            </option>
                            <option value={5}>5 minutes</option>
                            <option value={10}>10 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={20}>20 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div className="mb-12">
                        <label htmlFor="date" className="block text-base font-bold text-gray-700">
                            Due date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                date ? "text-gray-500" : "text-gray-400"
                            }`}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}