import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      username: '',
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: '',
      role: 'CUSTOMER', 
    },
    async (formValues) => {
      const requiredFields = ['username', 'email', 'password', 'password2'];
      for (let field of requiredFields) {
        const errorMsg = validateRequired(formValues[field], field);
        if (errorMsg) {
          setError(errorMsg);
          return;
        }
      }

      if (!validateEmail(formValues.email)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (!validatePassword(formValues.password)) {
        setError(
          'Password must be at least 8 characters long and include a mix of letters, numbers, or symbols.'
        );
        return;
      }

      if (formValues.password !== formValues.password2) {
        setError('Passwords do not match.');
        return;
      }

      try {
        await api.auth.register({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          password2: formValues.password2,
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          role: formValues.role,
        });
        navigate('/login?registered=true');
      } catch (err) {
        setError(err.response?.data?.detail || 'Registration failed');
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
            Start Your Journey
            <span className="block text-yellow-400">Create Account</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join thousands of travelers discovering amazing destinations worldwide
          </p>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Travel Account
              </h2>
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={values.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={values.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Username and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* User Type */}
              <div>
                <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">
                  I am a...
                </label>
                <select
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="CUSTOMER">👤 Traveler</option>
                  <option value="AGENT">🏢 Travel Agent</option>
                </select>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Create a password"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Must be at least 8 characters with letters, numbers, or symbols
                  </p>
                </div>

                <div>
                  <label htmlFor="password2" className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    required
                    value={values.password2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
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
                    Creating Account...
                  </span>
                ) : (
                  'Start Your Travel Journey'
                )}
              </button>
            </form>

            {/* Benefits Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Join Our Travel Community</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Discover Destinations</h4>
                  <p className="text-sm text-gray-600">Access exclusive travel deals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Manage Bookings</h4>
                  <p className="text-sm text-gray-600">All your trips in one place</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn Rewards</h4>
                  <p className="text-sm text-gray-600">Get points for every booking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              🔒 Your information is secure and will never be shared with third parties
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;