import { useRouter } from 'next/navigation';
import { PencilIcon, PaperAirplaneIcon, LinkIcon } from "@heroicons/react/24/outline";

interface QuizCardProps {
    id: string;
    identifier: string;
    title: string;
    description: string;
}

const QuizCard: React.FC<QuizCardProps> = ({id, identifier, title, description}) => {
    const router = useRouter();
    const navigateToDynamicRoute = () => {
        router.push(`quizzes/${id.toString()}`);
    };

    const navigateToDynamicEditRoute = () => {
        router.push(`quizzes/edit/${id.toString()}`);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 cursor-pointer transition duration-300 w-[500px]"
            onClick={() => navigateToDynamicRoute()}
        >
            <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-gray-800">{title}</h2>
                <div className="border-b border-gray-200 mb-4"></div>
                <p className="text-gray-600 mt-2">{description}</p>

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from navigating to the dynamic route
                            navigator.clipboard.writeText(identifier);
                        }}
                        className="flex items-center space-x-2 p-2 transition duration-300 hover:bg-orange-100 hover:text-white rounded-xl"
                    >
                        <LinkIcon className="h-5 w-5 text-orange-400 transition duration-300"/>
                        <span className="text-sm text-orange-400">Copy</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from navigating to the dynamic route
                        }}
                        className="flex items-center space-x-2 p-2 transition duration-300 hover:bg-green-100 hover:text-white rounded-xl"
                    >
                        <PaperAirplaneIcon className="h-5 w-5 text-green-600 transition duration-300"/>
                        <span className="text-sm text-green-600">Publish</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from navigating to the dynamic route
                            navigateToDynamicEditRoute();
                        }}
                        className="flex items-center space-x-2 p-2 transition duration-300 hover:bg-blue-100 hover:text-white rounded-xl"
                    >
                        <PencilIcon className="h-5 w-5 text-blue-600 transition duration-300"/>
                        <span className="text-sm text-blue-600">Edit</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuizCard;