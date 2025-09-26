import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  
  if (!review?.is_approved) return null;

  
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-4 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-yellow-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* User Avatar */}
          {review.user?.avatar_url ? (
            <img
              src={review.user.avatar_url}
              alt={review.user.first_name || review.user.username || "User"}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 border-2 border-white shadow-md">
              {review.user?.first_name?.[0] ||
                review.user?.username?.[0] ||
                "U"}
            </div>
          )}

          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {review.user?.first_name || review.user?.username || "Anonymous"}
            </h4>
            <p className="text-sm text-blue-600 font-medium">Verified Traveler</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full" role="img" aria-label={`Rating: ${review.rating || 0} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < (review.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 font-bold text-gray-900">{review.rating || 0}.0</span>
        </div>
      </div>

      {/* Content */}
      {review.title && (
        <h5 className="font-bold text-xl mb-3 text-gray-800 border-l-4 border-yellow-400 pl-3">
          {review.title}
        </h5>
      )}

      <p className="text-gray-700 mb-4 leading-relaxed text-lg bg-white/50 p-4 rounded-xl">
        {review.body || "No review text provided."}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-3">
        <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
          📅 {formatDate(review.created_at)}
        </span>
        <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          {review.content_object_display || "Hotel Stay"}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;