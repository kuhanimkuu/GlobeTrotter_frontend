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
    <div className="bg-white rounded-2xl shadow-md p-6 mb-4 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* User Avatar */}
          {review.user?.avatar_url ? (
            <img
              src={review.user.avatar_url}
              alt={review.user.first_name || review.user.username || "User"}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {review.user?.first_name?.[0] ||
                review.user?.username?.[0] ||
                "U"}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.first_name || review.user?.username || "Anonymous"}
            </h4>
            <p className="text-sm text-gray-500">Verified Traveler</p>
          </div>
        </div>

        {/* Rating */}
        <div
          className="flex items-center"
          role="img"
          aria-label={`Rating: ${review.rating || 0} out of 5`}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (review.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {review.title && (
        <h5 className="font-semibold text-lg mb-2 text-gray-800">
          {review.title}
        </h5>
      )}

      <p className="text-gray-700 mb-4 leading-relaxed">
        {review.body || "No review text provided."}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-2">
        <span>{formatDate(review.created_at)}</span>
        <span className="italic">
          {review.content_object_display || "Item"}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
