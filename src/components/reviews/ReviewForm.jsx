import React, { useState } from "react";
import { api } from "../../services/api";

const ReviewForm = ({ type, objectId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !objectId) {
      setError("Missing content type or object ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.reviews.create({
        content_type: type.toLowerCase(), 
        object_id: objectId,
        rating,
        title,
        body,
      });


      setRating(5);
      setTitle("");
      setBody("");

     
      onSuccess?.();
    } catch (err) {
      console.error("Review submit error:", err);
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <textarea
          placeholder="Write your review..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
