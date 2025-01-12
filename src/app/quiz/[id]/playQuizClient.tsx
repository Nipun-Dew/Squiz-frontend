"use client"

import React, {useEffect, useState} from "react";
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/navigation";
import startAutoLogout from "@/app/login/logout";

interface Quiz {
    id: number,
    creatorId: string,
    title: string,
    description: string,
    createdDate: string,
    modifiedDate: string,
    timeDuration: number,
    state: string,
    dueDate: string,
}

interface QuestionMetadata {
    questionId: number,
    questionNumber: string
}

interface QuestionMetadataInfo {
    quiz: Quiz,
    questionsMetadata: QuestionMetadata[],
}

interface Question {
    id: number,
    quizId: number,
    questionNumber: string,
    question: string,
    imageUrl: string,
    imageName: string | null,
    allocatedTime: number
}

interface Choice {
    id: number,
    questionId: string,
    choiceNumber: string,
    choiceText: string,
    helperText: string,
    imageUrl: string,
    imageName: string,
}

interface Answer {
    id: number,
    questionId: number,
    choiceId: number,
    sessionId: number,
    submitTime: string,
    isCorrectAnswer: boolean,
    correctAnswer: string
}

interface QuestionData {
    question: Question,
    choices: Choice[],
    answers: Answer[]
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

export default function PlayQuizClient({id}: { id: string }) {
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const [questionMetadata, setQuestionMetadata] = useState<QuestionMetadataInfo | null>(null);
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [answerData, setAnswerData] = useState<Answer[] | null>(null);

    const [selectedAnswer, setSelectedAnswer] = useState(0);

    const token = sessionStorage.getItem("authToken") || "";
    startAutoLogout(token);

    const headers = {Authorization: token ? `Bearer ${token}` : ""};

    const router = useRouter();

    const handleIndexClick = (number: number) => {
        setSelectedNumber(number);
        fetchQuestionData(number.toString(), sessionData?.id.toString() || "0");
    };

    const handleSelectAnswer = (number: number) => {
        setSelectedAnswer(number);
    }

    const handleSubmit = async () => {
        await submitAnswers(sessionData?.id.toString() || "0");
        router.push(`/quiz/${id}/results`);
    }

    const submitAnswers = async (sessionId: string) => {
        const postQuizUrl = `/api/squiz/v1/session/submit`

        const response = await fetch(postQuizUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sessionId: sessionId}),
        });

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed submit the quiz!');
        }
    }

    const handleSaveAnswer = async (choiceId: number) => {
        const postQuizUrl = `/api/squiz/v1/session/answer`

        const requestBody = (answerData !== null && answerData.length > 0)
            ? {
                id: answerData.at(0)?.id.toString() || "",
                questionId: questionData?.question?.id,
                choiceId: choiceId,
                sessionId: sessionData?.id
            } : {
                questionId: questionData?.question?.id,
                choiceId: choiceId,
                sessionId: sessionData?.id

            }

        const response = await fetch(postQuizUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to save the answer!');
        }
    }

    const fetchQuestionData = async (questionId: string, sessionId: string) => {
        const questionDataUrl = `/api/squiz/v1/question?questionId=${questionId}&sessionId=${sessionId}`
        const response = await fetch(questionDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load questions of the quiz!');
        }

        // TODO In here, answer have the isCorrect flag, when fetch data for quiz answering, should hide the value from the backend
        const result: QuestionData = await response.json();
        setQuestionData(result);
        setSelectedAnswer(result?.answers?.at(0)?.choiceId || 0);

        if (result?.answers !== null) {
            setAnswerData(result?.answers);
        } else {
            setAnswerData(null);
        }
    }

    const fetchSessionData = async () => {
        const sessionDataUrl = `/api/squiz/v1/session/user/quiz/${id}`
        const response = await fetch(sessionDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load session data!');
        }

        const result: Session = await response.json();
        setSessionData(result);
    }

    const fetchQuestionsMetadata = async () => {
        const quizDataUrl = `/api/squiz/v1/quiz/questions/${id}`
        const response = await fetch(quizDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load questions of the quiz!');
        }

        const result: QuestionMetadataInfo = await response.json();
        setQuestionMetadata(result);

        return result;
    }

    useEffect(() => {
        fetchSessionData();
        fetchQuestionsMetadata().then((result) => {
            setSelectedNumber(result?.questionsMetadata[0]?.questionId);
            fetchQuestionData(result?.questionsMetadata[0]?.questionId?.toString() || "0",
                sessionData?.id.toString() || "0");
        });
    }, []);

    return (
        <div className="flex h-screen">
            {/* Left Column */}
            <div className="w-1/4 bg-gray-100 border-r border-gray-300 overflow-y-scroll">
                <ul className="space-y-4 p-4">
                    {questionMetadata?.questionsMetadata?.map((question) => (
                        <li
                            key={question.questionId}
                            className={`cursor-pointer p-2 rounded-lg text-center ${
                                selectedNumber === question.questionId
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-800 hover:bg-blue-100"
                            }`}
                            onClick={() => handleIndexClick(question.questionId)}
                        >
                            {question.questionNumber}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col overflow-y-scroll relative">
                <div className="p-8 flex-grow">
                    {selectedNumber !== null ? (
                        <div className="bg-white shadow-md rounded-lg p-6 max-w-[60rem] mx-auto">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                {questionData?.question?.question}
                            </h2>
                            <hr className="mb-4 border-gray-300"/>
                            {questionData?.choices?.map((choice) => {
                                return (
                                    <div key={choice.id} className="mb-4 flex">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectAnswer(choice.id)}
                                            className="ml-2 p-1 transition font-light duration-200 text-gray-400
                                                rounded-lg text-white-100"
                                        >
                                            <CheckCircleIcon
                                                className={`h-6 w-6 hover:text-green-500 transition duration-200 
                                                    ${selectedAnswer === choice.id ? "text-green-500" : "text-gray-200"}`}/>
                                        </button>
                                        <p className="mx-2 text-gray-600">
                                            <span className="font-semibold">{`${choice.choiceNumber}. `}</span>
                                            {choice.choiceText}
                                        </p>
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => handleSaveAnswer(selectedAnswer)}
                                className="px-4 py-2 ml-4 mt-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center mt-20">
                            Select a number from the list to view details.
                        </p>
                    )}
                </div>

                {/* Bottom Buttons */}
                <div className="p-4 bg-white border-t border-gray-300 flex justify-end space-x-4 sticky bottom-0">
                    <button
                        // onClick={handleExit}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Exit
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};