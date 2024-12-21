import QuizClient from "./QuizClient";

export default async function Quiz({params}: {
    params: { id: string }
}) {
    const id: string = params.id

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <QuizClient id={id}/>
        </div>
    );
}