"use client"
import Navbar from "@/app/navbar";
import {MagnifyingGlassIcon, PlayIcon} from "@heroicons/react/24/solid"
import {useState} from "react";
import startAutoLogout from "@/app/login/logout";
import {useRouter} from "next/navigation";

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

interface Session {
    id: number,
    quizId: number,
    quizIdentifier: string,
    userId: string,
    startTime: string,
    submitTime: string,
    endTime: string,
    duration: number,
    completed: boolean
}

export default function Find() {
    const [searchInput, setSearchInput] = useState("");
    const [quizInfo, setQuizInfo] = useState<QuizData | null>(null);
    const [isCompletedSession, setIsCompletedSession] = useState(false);

    const router = useRouter();

    const token = sessionStorage.getItem("authToken") || "";
    startAutoLogout(token);

    const handleSearch = async () => {
        const response = await findQuiz({identifier: searchInput});
        const responseData = await response.clone().text();

        const quizData: QuizData = (!responseData || responseData.trim() === '') ? null : await response.json();

        if (response.ok && quizData !== null) {
            setQuizInfo(quizData);
            const sessionResponse = await findSession(quizData.id.toString());
            const resultText = await sessionResponse.clone().text();

            const sessionData: Session = (!resultText || resultText.trim() === '') ? null : await sessionResponse.json();
            setIsCompletedSession(sessionData?.completed);

        } else {
            setQuizInfo(null)
            window.alert('Failed to load quiz!');
        }
    };

    const startQuiz = async (id: string) => {
        const result = await findSession(id);
        const resultText = await result.text();
        if (!resultText || resultText.trim() === '') {
            await addSession(parseInt(id))
        }
        router.push(`/quiz/${id}`);
    }

    const addSession = async (id: number) => {
        const findSessionUrl = `/api/squiz/v1/session`

        return await fetch(findSessionUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"quizId": id}),
        });
    }

    const findSession = async (id: string) => {
        const findSessionUrl = `/api/squiz/v1/session/user/quiz/${id}`

        const headers = {
            Authorization: token ? `Bearer ${token}` : "",
        };

        const response = await fetch(findSessionUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load quizzes!');
        }
        return response;
    }

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

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar id={"find"}/>
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
                                    className={`mt-6 flex items-center justify-center px-4 py-2 
                                    ${!isCompletedSession ? 
                                        'bg-green-500 text-white rounded-md hover:bg-green-600' : 
                                        'bg-gray-300 text-gray-500 rounded-md cursor-not-allowed'
                                    } focus:outline-none`}
                                    aria-label="Play"
                                    onClick={() => {
                                        startQuiz(quizInfo?.id?.toString());
                                    }}
                                    disabled={isCompletedSession}
                                >
                                    <PlayIcon className="w-5 h-5 mr-2"/>
                                    Start
                                </button>
                                {isCompletedSession ? <p className="mt-4 text-sm text-blue-400">
                                    Note: This quiz is attempted before, unable to start!
                                </p> : <></>}
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