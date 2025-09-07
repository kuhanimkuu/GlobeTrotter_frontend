import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {review.user?.first_name?.[0] || review.user?.username?.[0] || 'U'}
          </div>
          <div>
            <h4 className="font-semibold">
              {review.user?.first_name || review.user?.username || 'Anonymous'}
            </h4>
            <p className="text-sm text-gray-500">Verified Traveler</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {review.title && (
        <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
      )}
      
      <p className="text-gray-700 mb-4">{review.body}</p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(review.created_at).toLocaleDateString()}</span>
        <span>{review.content_object?.title || 'Item'}</span>
      </div>
    </div>
  );
};

export default ReviewCard;