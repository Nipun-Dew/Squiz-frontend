interface QuizCardProps {
    id: string;
    title: string;
    description: string;
}

const QuizCard: React.FC<QuizCardProps> = ({id, title, description}) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 cursor-pointer transition duration-300 w-[500px]"
            // onClick={onClick}
        >
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{"Quiz no: " + id}</h2>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
        </div>
    )
}

export default QuizCard;