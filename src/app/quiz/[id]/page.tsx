import PlayQuizClient from "@/app/quiz/[id]/playQuizClient";

export default async function PlayQuiz({params}: {
    params: { id: string }
}) {
    const { id } = await params

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <PlayQuizClient id={id}/>
        </div>
    );
}