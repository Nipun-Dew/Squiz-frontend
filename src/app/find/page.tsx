"use client"
import Navbar from "@/app/navbar";
import {MagnifyingGlassIcon, PlayIcon} from "@heroicons/react/24/solid"
import {useState} from "react";
import startAutoLogout from "@/app/login/logout";

interface FindQuizBody {
    identifier: string
}

interface QuizData {
    id: number,
    creatorId: string,
    title: string,
    description: string,
    createdDate: string,
    timeDuration: string
    state: string,
    dueDate: string,
}

interface CardData {
    title: string;
    details: { label: string; value: string }[];
}

export default function Find() {
    const [searchInput, setSearchInput] = useState("");
    const [quizInfo, setQuizInfo] = useState<QuizData | null>(null);

    const token = sessionStorage.getItem("authToken") || "";
    startAutoLogout(token);

    const handleSearch = async () => {
        const response = await findQuiz({identifier: searchInput});
        const quizData: QuizData = await response.json();

        if (response.ok) {
            setQuizInfo(quizData)
        } else {
            window.alert('Failed to find the quiz!');
        }
    };

    const findQuiz = async (data: FindQuizBody) => {
        const findQuizUrl = `/api/squiz/v1/quiz/play`

        return await fetch(findQuizUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    const results: CardData[] = [
        {
            title: "Result 1",
            details: [
                {label: "Author", value: "John Doe"},
                {label: "Year", value: "2023"},
            ],
        },
        {
            title: "Result 2",
            details: [
                {label: "Author", value: "Jane Smith"},
                {label: "Year", value: "2022"},
            ],
        },
        {
            title: "Result 3",
            details: [
                {label: "Author", value: "Sam Wilson"},
                {label: "Year", value: "2021"},
            ],
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar/>
            <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen">
                <div
                    className="flex items-center mb-24 bg-gray-100 w-full max-w-md mx-auto border rounded-lg overflow-hidden shadow-md">
                    <button
                        className="px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6"/>
                    </button>
                    <input
                        type="text"
                        placeholder="Search the quiz..."
                        className="flex-grow px-4 py-2 text-gray-700 bg-white focus:outline-none"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                {!!quizInfo && (
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg w-[400px]">
                            <h3 className="text-xl font-bold mb-4">{quizInfo?.title}</h3>
                            <div className="border-b border-gray-200 mb-4"></div>
                            <div className="flex flex-col gap-3">
                                <span className="font-light text-gray-500 mb-5 w-[360px]">{quizInfo?.description}</span>
                                <div className="flex">
                                    <span className="font-medium mb-0.5 w-[70px]">Creator:</span>
                                    <span className="font-light text-gray-500">{quizInfo?.creatorId}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium mb-0.5 w-[115px]">Time Duration:</span>
                                    <span className="font-light text-gray-500">{quizInfo?.timeDuration} mins</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium mb-0.5 w-[85px]">Due Date:</span>
                                    <span className="font-light text-gray-500">{quizInfo?.dueDate.slice(0, 10)}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium mb-0.5 w-[110px]">Created Date:</span>
                                    <span
                                        className="font-light text-gray-500">{quizInfo?.createdDate.slice(0, 10)}</span>
                                </div>
                                <button
                                    className="mt-6 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                                    aria-label="Play"
                                >
                                    <PlayIcon className="w-5 h-5 mr-2"/>
                                    Play
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!quizInfo && searchInput && (
                    <p className="text-center text-gray-500 mt-6">No results found.</p>
                )}
            </div>
        </div>
    )
}