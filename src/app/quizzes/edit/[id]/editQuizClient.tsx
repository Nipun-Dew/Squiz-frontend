"use client"
import React, {useEffect, useState} from "react";
import Navbar from "@/app/navbar";

interface Question {
    quizId: string,
    questionNumber: string,
    question: string,
    imageName: string,
    allocatedTime: number,
}

interface Option {
    choiceNumber: string
    choiceText: string,
    helperText: string,
    imageUrl: string,
    imageName: string,
    correctAnswer: boolean,
}

interface QuestionInfo {
    question: Question,
    answers: Option[],
}

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

interface QuizData {
    quiz: Quiz,
    questions: QuestionInfo[],
}

export default function EditQuizClient({id}: { id: string }) {
    const defaultOptions: Option[] = [];
    const defaultQuestion = {
        quizId: id,
        questionNumber: "",
        question: "",
        imageName: "",
        allocatedTime: 0,
    }

    const [question, setQuestion] = useState<Question>(defaultQuestion);
    const [options, setOptions] = useState<Option[]>(defaultOptions);
    const [savedQuestions, setSavedQuestions] = useState<QuestionInfo[]>([]);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = question;
        value.question = e.target.value;
        setQuestion(value);
    };

    const handleQuestionNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = question;
        value.questionNumber = e.target.value;
        setQuestion(value);
    };

    const handleOptionsChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            choiceNumber: index.toString(),
            choiceText: value,
            helperText: value,
            imageUrl: "",
            imageName: "",
            correctAnswer: false,
        };
        setOptions(updatedOptions);
    };

    const addOption = () => {
        const value = {
            choiceNumber: "",
            choiceText: "",
            helperText: "",
            imageUrl: "",
            imageName: "",
            correctAnswer: false,
        }
        setOptions([...options, value]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const addCorrectFlag = (index: number) => {
        const updatedOptions = [...options];
        updatedOptions[index].correctAnswer = !updatedOptions[index].correctAnswer;
        setOptions(updatedOptions);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await postQuestion(question, options);
        clearStates();
    };

    const clearStates = () => {
        setQuestion(defaultQuestion);
        setOptions(defaultOptions);
    }

    const postQuestion = async (question: Question, options: Option[]) => {
        const token = window.sessionStorage.getItem("authToken");
        const postQuizUrl = `/api/squiz/v1/question`

        const response = await fetch(postQuizUrl, {
            method: "POST",
            headers: {
                'Authorization': token ? `Bearer ${token}` : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                answers: options,
            }),
        });

        // TODO add proper error handling logic
        if (response.ok) {
            const updatedQuestion = savedQuestions;
            updatedQuestion.push({
                question: question,
                answers: options,
            });
            setSavedQuestions(updatedQuestion);
        } else {
            window.alert('Failed to save the Question!');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem("authToken");
            const headers = {Authorization: token ? `Bearer ${token}` : ""};
            const quizDataUrl = `/api/squiz/v1/quiz/${id}`

            const response = await fetch(quizDataUrl, {headers: headers});

            // TODO add proper error handling logic
            if (!response.ok) {
                window.alert('Failed to load questions of the quiz!');
            }

            const result: QuizData = await response.json();
            setSavedQuestions(result.questions);
        }
        fetchData();
    }, []);

    return (
        <>
            <Navbar/>
            <div className="bg-gray-200 mt-24 flex flex-col items-center justify-center min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white mt-12 mb-12 p-6 rounded-lg shadow-md w-full max-w-xl"
                >
                    <h1 className="text-2xl font-bold mb-4 text-center">Add a new question</h1>
                    <div className="mb-4">
                        <label htmlFor="heading" className="block text-lg font-bold text-gray-700">
                            Question
                        </label>
                        <input
                            type="text"
                            id="heading"
                            value={question?.question}
                            onChange={handleQuestionChange}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Question"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="heading" className="block text-lg font-bold text-gray-700">
                            Question Number
                        </label>
                        <input
                            type="text"
                            id="heading"
                            value={question?.questionNumber}
                            onChange={handleQuestionNumberChange}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Question Number"
                        />
                    </div>

                    {options.map((option, index) => (
                        <div key={index} className="mb-4 flex items-center">
                            <button
                                type="button"
                                onClick={() => addCorrectFlag(index)}
                                className={`ml-2 p-1 transition font-light duration-200 hover:bg-green-100 text-gray-400 
                                rounded-lg text-white-100 ${option.correctAnswer ? "bg-green-100" : ""}`}
                            >
                                correct
                            </button>
                            <input
                                type="text"
                                value={option.choiceText}
                                onChange={(e) => handleOptionsChange(index, e.target.value)}
                                className="block p-2 m-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={`Option ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </div>
                    ))}

                    {/* Add Subheading Button */}
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={addOption}
                            className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                        >
                            + Add Option
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Submit
                    </button>
                </form>
                {savedQuestions.map((questionInfo, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md mb-6 p-6 w-[580px] h-auto flex flex-col"
                    >
                        <h2 className="text-lg font-bold text-gray-800 mb-2">{questionInfo?.question?.question}</h2>
                        <ul className="space-y-1">
                            {questionInfo?.answers?.map((option, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-600 ml-8 mt-3 text-sm leading-relaxed list-decimal list-inside"
                                >
                                    {option?.choiceText}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
}
