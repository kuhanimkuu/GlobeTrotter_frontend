import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateRequired } from '../../utils/validation';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      username: '',
      password: ''
    },
    async (formValues) => {
      const requiredFields = ['username', 'password'];
      for (let field of requiredFields) {
        const errorMsg = validateRequired(formValues[field], field);
        if (errorMsg) {
          setError(errorMsg);
          return;
        }
      }

      try {
        await login(formValues); 
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.detail || 'Login failed');
      }
    }
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome Back
            <span className="block text-yellow-400">Traveler</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Sign in to continue your journey and access your travel plans
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-gray-600">
                Or{' '}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={values.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={values.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In to Your Account'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            {/* Additional Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-center">
                  <div className="text-2xl mb-2"></div>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2"></div>
                  <p className="text-sm text-gray-600">Flights</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2"></div>
                  <p className="text-sm text-gray-600">Hotels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Quick access to popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/destinations"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Explore Destinations
              </Link>
              <Link
                to="/tour-packages"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Tour Packages
              </Link>
              <Link
                to="/flights"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Flight Deals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;