"use client"
import Navbar from "@/app/navbar";
import QuizCard from "@/app/quizzes/quizCard";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import startAutoLogout from "@/app/login/logout";

interface QuizzesData {
    id: number,
    creatorId: string,
    quizIdentifier: string,
    title: string,
    description: string,
    createdDate: string,
    timeDuration: string
    state: string,
    dueDate: string,
}

export default function Quizzes() {
    const [data, setData] = useState<QuizzesData[] | null>(null);
    const router = useRouter();
    const quizDataUrl = "/api/squiz/v1/quizzes"
    const token = sessionStorage.getItem("authToken") || "";

    startAutoLogout(token);

    const fetchData = async () => {
        const headers = {
            Authorization: token ? `Bearer ${token}` : "",
        };
        const response = await fetch(quizDataUrl, {headers: headers});
        const responseData = await response.clone().text();

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load quizzes!');
        }
        const result: QuizzesData[] = (!responseData || responseData.trim() === '') ? null : await response.json();
        return result;
    }

    const publishQuiz = async (id: string) => {
        const publishUrl = `/api/squiz/v1/quiz/publish`

        const response = await fetch(publishUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quizId: id
            }),
        });

        if (!response.ok) {
            window.alert('Failed to publish quiz!');
        } else {
            fetchData().then(data => setData(data));
        }
    }

    useEffect(() => {
        fetchData().then(data => setData(data));
    }, [])


    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar id={"quizzes"}/>
            <button
                className="absolute top-0 right-0 mt-28 mr-16 text-xl py-3 px-6 bg-blue-500 text-center text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                    router.push('/quizzes/add');
                }}
            >
                + Add
            </button>
            <div className="bg-gray-200 mt-28 mb-12 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-12">Your Quizzes</h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {data?.map((quiz) => (
                        <QuizCard
                            key={quiz.id}
                            id={quiz.id.toString()}
                            identifier={quiz.quizIdentifier}
                            title={quiz.title}
                            state={quiz.state}
                            description={quiz.description}
                            publishQuiz={publishQuiz}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}