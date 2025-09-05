import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;