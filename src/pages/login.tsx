import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login to Ella AI</h1>
        <Link to="/" className="bg-[#5b4c9c] text-white px-4 py-2 rounded">
          Log In
        </Link>
      </div>
    </div>
  );
}
