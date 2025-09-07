import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book flights, hotels, cars, and amazing tour packages all in one place. 
            Your dream vacation is just a click away.
          </p>
          <div className="flex justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/auth/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  Get Started
                </Link>
                <Link to="/auth/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/flights" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Start Booking
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="font-semibold mb-2">Flights</h3>
              <p className="text-gray-600">Book domestic and international flights</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="font-semibold mb-2">Hotels</h3>
              <p className="text-gray-600">Find the perfect accommodation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold mb-2">Car Rentals</h3>
              <p className="text-gray-600">Rent cars for your travels</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌴</span>
              </div>
              <h3 className="font-semibold mb-2">Tour Packages</h3>
              <p className="text-gray-600">All-inclusive vacation packages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group cursor-pointer">
              <img src="/api/placeholder/400/300" alt="Paris" className="w-full h-64 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6 group-hover:bg-opacity-20 transition-all">
                <div>
                  <h3 className="text-white text-xl font-semibold">Paris, France</h3>
                  <p className="text-white">From $499</p>
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <img src="/api/placeholder/400/300" alt="Bali" className="w-full h-64 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6 group-hover:bg-opacity-20 transition-all">
                <div>
                  <h3 className="text-white text-xl font-semibold">Bali, Indonesia</h3>
                  <p className="text-white">From $799</p>
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <img src="/api/placeholder/400/300" alt="New York" className="w-full h-64 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end p-6 group-hover:bg-opacity-20 transition-all">
                <div>
                  <h3 className="text-white text-xl font-semibold">New York, USA</h3>
                  <p className="text-white">From $599</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/destinations" className="text-blue-600 font-semibold hover:text-blue-700">
              View All Destinations →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;