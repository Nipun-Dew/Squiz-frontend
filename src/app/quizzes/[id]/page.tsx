import Navbar from "@/app/navbar";

export default async function Quiz({params,}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    const cards = [
        {
            title: "Card Title 1",
            subtitles: ["Subtitle 1.1", "Subtitle 1.2", "Subtitle 1.3"],
        },
        {
            title: "Card Title 2",
            subtitles: ["Subtitle 2.1", "Subtitle 2.2", "Subtitle 2.3"],
        },
        {
            title: "Card Title 3",
            subtitles: ["Subtitle 3.1", "Subtitle 3.2", "Subtitle 3.3"],
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar/>
            <div className="flex flex-col gap-8 p-8 items-center">
                <h1 className="text-4xl font-bold mb-6">Quiz Name</h1>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md m-1 p-6 w-[800px] h-auto flex flex-col"
                    >
                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h2>

                        {/* Subtitles List */}
                        <ul className="space-y-1">
                            {card.subtitles.map((subtitle, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-600 text-sm leading-relaxed list-disc list-inside"
                                >
                                    {subtitle}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}