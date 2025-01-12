"use client"
import Navbar from "../../navbar";
import React, {useEffect, useState} from "react";
import startAutoLogout from "@/app/login/logout";
import {CheckCircleIcon} from "@heroicons/react/24/solid";

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
    correctAnswer: boolean
}

interface QuestionData {
    question: Question,
    choices: Choice[]
}

interface QuizData {
    quiz: Quiz,
    questions: QuestionData[],
}

export default function QuizClient({id}: { id: string }) {
    const [data, setData] = useState<QuizData | null>(null);

    const token = window.sessionStorage.getItem("authToken") || "";
    startAutoLogout(token);

    useEffect(() => {
        const fetchData = async () => {
            const headers = {Authorization: token ? `Bearer ${token}` : ""};
            const quizDataUrl = `/api/squiz/v1/quiz/${id}`

            const response = await fetch(quizDataUrl, {headers: headers});

            // TODO add proper error handling logic
            if (!response.ok) {
                window.alert('Failed to load quiz data!');
            }

            const result: QuizData = await response.json();
            setData(result);
        }
        fetchData();
    }, [id]);

    return (
        <>
            <Navbar id={"quizzes"}/>
            <div className="mt-24 flex flex-col gap-8 p-8 items-center">
                <h1 className="text-4xl font-bold mb-6">{data?.quiz?.title}</h1>
                {data?.questions?.map((data, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md m-1 p-6 w-[800px] h-auto flex flex-col"
                    >
                        <h2 className="text-lg font-bold text-gray-800 mb-2">{data.question.question}</h2>
                        <h4 className="text-sm font-bold text-gray-800 mb-2">{`Question number: ${data.question.questionNumber}`}</h4>
                        <ul className="space-y-1">
                            {data?.choices?.map((answer, idx) => (
                                <div key={idx} className="flex items-center">
                                    <li
                                        key={idx}
                                        className="text-gray-600 ml-8 mt-3 text-sm leading-relaxed list-decimal list-inside"
                                    >
                                        {answer.choiceText}
                                    </li>
                                    {answer.correctAnswer ? <CheckCircleIcon
                                        className="h-6 w-6 mt-3 ml-5 text-green-500"
                                    /> : <></>}
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}