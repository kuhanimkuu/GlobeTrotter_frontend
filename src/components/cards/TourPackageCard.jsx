import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Users } from 'lucide-react';

const TourPackageCard = ({ tourPackage }) => { 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        {tourPackage.main_image_url ? (
          <img
            src={tourPackage.main_image_url}
            alt={tourPackage.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            tourPackage.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {tourPackage.is_active ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{tourPackage.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tourPackage.summary}</p>
        
        {/* Destination */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{tourPackage.destination?.name}</span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{tourPackage.duration_days} days</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Max {tourPackage.max_capacity} people</span>
          </div>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">
            ${tourPackage.base_price}
            <span className="text-sm font-normal text-gray-600">/{tourPackage.currency}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold">4.8</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/packages/${tourPackage.slug}`}
          className="w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition-colors block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TourPackageCard;