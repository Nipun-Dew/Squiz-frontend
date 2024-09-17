
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Squiz App</h1>
      <p className="text-lg mb-8">Please choose an option to get started</p>
      <div className="space-y-4">
        <Link className="block py-2 px-4 bg-blue-500 text-center text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          href="/login">
          Login
        </Link>
        <Link className="block py-2 px-4 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          href="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
