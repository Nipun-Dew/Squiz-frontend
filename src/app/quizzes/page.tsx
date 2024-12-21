"use client"
import Navbar from "@/app/navbar";
import QuizCard from "@/app/quizzes/quizCard";
import {useEffect, useState} from "react";

interface QuizzesData {
    id: number,
    creatorId: string,
    title: string,
    description: string,
    createdDate: string,
    timeDuration: string
    state: string,
    dueDate: string,
}

export default function Quizzes() {
    const [data, setData] = useState<QuizzesData[] | null>(null);

    const quizDataUrl = "/api/squiz/v1/quizzes"

    const fetchData = async () => {
        const token = sessionStorage.getItem("authToken");

        const headers = {
            Authorization: token ? `Bearer ${token}` : "",
        };
        const response = await fetch(quizDataUrl, { headers: headers });

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load quizzes!');
        }
        const result: QuizzesData[] = await response.json();
        return result;
    }

    useEffect(() => {
        fetchData().then(data => setData(data));
    }, [])


    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar/>
                <button
                    className="absolute top-0 right-0 mt-28 mr-16 text-xl py-3 px-6 bg-blue-500 text-center text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    + Add
                </button>
            <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-6">Your Quizzes</h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {data?.map((quiz) => (
                        <QuizCard
                            key={quiz.id}
                            id={quiz.id.toString()}
                            title={quiz.title}
                            description={quiz.description}/>
                    ))}
                </div>
            </div>
        </div>
    )
}