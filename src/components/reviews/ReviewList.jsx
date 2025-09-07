import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const ReviewList = ({ type, objectId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.reviews.list({ content_type: type, object_id: objectId });
      setReviews(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [type, objectId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (reviews.length === 0) return <p className="text-gray-500">No reviews yet.</p>;

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
      {reviews.map((review) => (
        <div key={review.id} className="border p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{review.user.username}</span>
            <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
          </div>
          {review.title && <p className="font-medium">{review.title}</p>}
          <p>{review.body}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
