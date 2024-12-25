import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow z-50">
            <div className="container mx-auto px-4 py-4 flex items-center">
                {/* Logo */}
                <a href="#" className="text-xl font-bold flex-shrink-0">Squiz App</a>

                {/* Navigation Links */}
                <ul className="flex space-x-14 justify-center flex-grow">
                    <li>
                        <Link href="/quizzes" className="hover:text-blue-200">
                            Quizzes
                        </Link>
                    </li>
                    <li>
                        <Link href="/find" className="hover:text-blue-200">
                            Find
                        </Link>
                    </li>
                    <li>
                        <Link href="/leaderboards" className="hover:text-blue-200">
                            Leaderboards
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:text-blue-200">
                            About
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}