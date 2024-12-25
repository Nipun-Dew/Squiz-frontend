import React from "react";

import EditQuizClient from "@/app/quizzes/edit/[id]/editQuizClient";

export default async function EditQuiz({params}: {
    params: { id: string }
}) {
    const id: string = (params).id

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <EditQuizClient id={id}/>
        </div>
    )
}