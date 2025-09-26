import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Compass } from 'lucide-react';

const DestinationCard = ({ destination }) => {
  return (
    <Link to={`/destinations/${destination.slug}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-transparent hover:border-yellow-400">
        {/* Destination Image */}
        <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
          {destination.cover_image_url ? (
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Compass className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            4.7
          </div>
          
          {/* Tours Badge */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center">
            <Users className="w-3 h-3 mr-1" />
            15+
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {destination.name}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-sm">{destination.city}, {destination.country}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {destination.short_description || "Discover amazing experiences in this beautiful destination"}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span>4.7 (128 reviews)</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Popular
            </div>
          </div>

          {/* Hover Action Indicator */}
          <div className="mt-3 text-center">
            <span className="text-blue-500 text-sm font-semibold group-hover:text-yellow-600 transition-colors">
              Explore Destination →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;