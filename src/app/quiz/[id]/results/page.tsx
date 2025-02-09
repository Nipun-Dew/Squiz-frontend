'use client';

import {useSearchParams} from 'next/navigation';
import Navbar from "@/app/navbar";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import React, {useEffect, useState} from "react";
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

interface Results {
    id: number,
    quizResponse: Quiz,
    sessionResponse: Session,
    correctNoOfAnswers: number,
    incorrectNoOfAnswers: number,
    duration: number
}

interface Answer {
    id: number,
    questionId: number,
    choiceId: number,
    sessionId: number,
    submitTime: string,
    isCorrectAnswer: boolean,
    correctAnswer: string,
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

interface Question {
    id: number,
    quizId: number,
    questionNumber: string,
    question: string,
    imageUrl: string,
    imageName: string | null,
    allocatedTime: number
}

interface QuestionData {
    question: Question,
    choices: Choice[]
}

interface QuizData {
    quiz: Quiz,
    questions: QuestionData[],
}

export default function QuizResultsPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');

    const [resultsData, setResultsData] = useState<Results | null>(null);
    const [userGivenAnswers, setUserGivenAnswers] = useState<Answer[] | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);

    const token = sessionStorage.getItem("authToken") || "";
    startAutoLogout(token);

    const headers = {Authorization: token ? `Bearer ${token}` : ""};

    const fetchResultsData = async () => {
        const resultsDataUrl = `/api/squiz/v1/results/${sessionId}`
        const response = await fetch(resultsDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load session results!');
        }

        const result: Results = await response.json();
        setResultsData(result);

        return result;
    }

    const fetchQuizData = async (id: string) => {
        const quizDataUrl = `/api/squiz/v1/quiz/${id}`

        const response = await fetch(quizDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load quiz data!');
        }

        const result: QuizData = await response.json();
        setQuizData(result);
    }

    const fetchAnswers = async () => {
        const answersDataUrl = `/api/squiz/v1/session/answers/${sessionId}`
        const response = await fetch(answersDataUrl, {headers: headers});

        // TODO add proper error handling logic
        if (!response.ok) {
            window.alert('Failed to load answers!');
        }

        const result: Answer[] = await response.json();
        setUserGivenAnswers(result);

        return result;
    }

    useEffect(() => {
        fetchAnswers();
        fetchResultsData().then(resultsData =>
            fetchQuizData(resultsData?.quizResponse?.id?.toString()));
    }, []);


    return (
        <>
            <Navbar id={"quizzes"}/>
            <div className="mt-24 flex flex-col gap-8 p-8 items-center">
                <h1 className="text-2xl font-bold text-green-600 mb-2">{"Correct number of answers given : " + resultsData?.correctNoOfAnswers}</h1>
                <h1 className="text-2xl font-bold text-red-600 mb-6">{"Incorrect number of answers : " + resultsData?.incorrectNoOfAnswers}</h1>
                {quizData?.questions?.map((data, idx) => (
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
                                    {!!(userGivenAnswers?.find(userGivenAnswer => userGivenAnswer?.choiceId === answer?.id)?.isCorrectAnswer) ?
                                        <CheckCircleIcon
                                            className="h-6 w-6 mt-3 ml-5 text-green-500"
                                        /> : <></>}
                                    {(userGivenAnswers?.find(userGivenAnswer => userGivenAnswer?.choiceId === answer?.id)?.isCorrectAnswer === false) ?
                                        <XCircleIcon
                                            className="h-6 w-6 mt-3 ml-5 text-red-500"
                                        /> : <></>}
                                </div>
                            ))}
                        </ul>
                        {userGivenAnswers?.find(userGivenAnswer => userGivenAnswer?.questionId === data?.question?.id)?.isCorrectAnswer === false ?
                            <h4 className="text-sm font-bold text-red-800 mt-4 mb-2">{"Correct answer is : " +
                                userGivenAnswers?.find(userGivenAnswer => userGivenAnswer?.questionId === data?.question?.id)?.correctAnswer}</h4> : <></>}
                    </div>
                ))}
            </div>
        </>
    );
}