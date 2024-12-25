import QuizClient from "./quizClient";

export default async function Quiz({params}: {
    params: { id: string }
}) {
    const { id } = await params

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <QuizClient id={id}/>
        </div>
    );
}