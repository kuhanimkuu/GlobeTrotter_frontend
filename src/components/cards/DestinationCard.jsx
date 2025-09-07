import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const DestinationCard = ({ destination }) => {
  return (
    <Link to={`/destinations/${destination.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Destination Image */}
        <div className="h-48 bg-gray-200 relative">
          {destination.cover_image_url ? (
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{destination.city}, {destination.country}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {destination.short_description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>4.7 (128 reviews)</span>
            </div>
            <span className="font-semibold">15+ tours</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;