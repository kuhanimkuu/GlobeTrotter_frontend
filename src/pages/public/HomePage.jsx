import React from "react";
import { Link } from "react-router-dom";
import DestinationCard from "../../components/cards/DestinationCard";
import ReviewCard from "../../components/cards/ReviewCard";

const HomePage = () => {
  const featuredDestinations = [
    { id: 1, name: "Maasai Mara", image: "/images/OIP-1816564833.jpeg", description: "Wildlife Safari Adventure" },
    { id: 2, name: "Diani Beach", image: "/images/OIP-347162889.jpeg", description: "Tropical Beach Paradise" },
    { id: 3, name: "Dubai", image: "/images/OIP-3724049105.jpeg", description: "Luxury City Experience" },
  ];

  const reviews = [
    { id: 1, name: "Alice", text: "Amazing safari experience!", rating: 5, avatar: "👩" },
    { id: 2, name: "John", text: "Loved the beach holiday!", rating: 4, avatar: "👨" },
    { id: 3, name: "Sarah", text: "Best vacation ever!", rating: 5, avatar: "👩" },
    { id: 4, name: "Mike", text: "Excellent service throughout!", rating: 5, avatar: "👨" },
  ];

  const services = [
    { icon: "", title: "Flights", description: "Best deals on flights worldwide", link: "/flights" },
    { icon: "", title: "Hotels", description: "Luxury stays at affordable prices", link: "/hotels" },
    { icon: "", title: "Car Rentals", description: "Flexible rental options", link: "/cars" },
    { icon: "", title: "Tour Packages", description: "Curated travel experiences", link: "/tour-packages" },
  ];

  const experiences = [
    { image: "/images/OIP-3355514081.jpeg", title: "Wildlife Safaris", description: "Encounter amazing wildlife" },
    { image: "/images/OIP-292472245.jpeg", title: "Beach Holidays", description: "Relax on pristine beaches" },
    { image: "/images/OIP-1900420781.jpeg", title: "City Breaks", description: "Explore vibrant cities" },
    { image: "/images/OIP-3632286247.jpeg", title: "Adventure Sports", description: "Thrilling activities" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Your Next
            <span className="block text-yellow-400">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore tours, flights, hotels & cars all in one place. Your journey of a lifetime starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/destinations"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
               Explore Destinations
            </Link>
            <Link
              to="/tour-packages"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
               View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Everything you need for the perfect trip, all in one place
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 group text-center"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the world's most amazing places with our curated selection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredDestinations.map((dest) => (
              <div key={dest.id} className="group">
                <Link to={`/destinations/`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                    <img
                      src={ dest.image}
                      alt={dest.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h3>
                      <p className="text-gray-600">{dest.description}</p>
                      <div className="mt-4 flex items-center text-yellow-600 font-semibold">
                        Explore →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/destinations"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 inline-block"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Experiences Section - Updated */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Popular Experiences</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find your perfect travel style with our diverse range of experiences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Updated */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied travelers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{review.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <div className="flex text-yellow-400">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - Updated */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Your Journey Starts Here
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ready to create unforgettable memories? Let's plan your perfect trip together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/destinations"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              Start Planning Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;