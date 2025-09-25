import React from "react";

import { format } from "../utils/format";
const TourPackageModal = ({ isOpen, onClose, packageData }) => {
  if (!isOpen || !packageData) return null;

  const {
    title,
    summary,
    description,
    highlights,
    policies,
    destination,
    hotel,
    car,
    images,
    main_image_url,
    total_price,
    average_rating,
    total_reviews,
    start_date,
    end_date,
    base_price,
    commission,
  } = packageData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl overflow-y-auto max-h-[90vh] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold text-xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{summary}</p>

        {/* Images */}
        {images?.length > 0 || main_image_url ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {main_image_url && (
              <img
                src={main_image_url}
                alt={title}
                className="w-full h-32 object-cover rounded"
              />
            )}
            {images?.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={img.caption || ""}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        ) : null}

        {/* Details */}
        <div className="mb-4">
          <p className="mb-1">
            <span className="font-semibold">Destination:</span>{" "}
            {destination?.name || "-"}
          </p>
          {hotel && (
            <p className="mb-1">
              <span className="font-semibold">Hotel:</span> {hotel.name}
            </p>
          )}
          {car && (
            <p className="mb-1">
              <span className="font-semibold">Car:</span> {car.name}
            </p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Start Date:</span>{" "}
            {start_date || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">End Date:</span> {end_date || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Base Price:</span>{" "}
            {format.currency(base_price)}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Total Price:</span>{" "}
            {format.currency(total_price)}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Commission:</span> {commission}%
          </p>
        </div>

        {/* Ratings */}
        <div className="mb-4">
          <p>
            <span className="font-semibold">Average Rating:</span>{" "}
            {average_rating?.toFixed(1) || 0} / 5
          </p>
          <p>
            <span className="font-semibold">Total Reviews:</span>{" "}
            {total_reviews || 0}
          </p>
        </div>

        {/* Highlights & Policies */}
        {highlights && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Highlights</h3>
            <p className="text-gray-700">{highlights}</p>
          </div>
        )}
        {policies && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Policies</h3>
            <p className="text-gray-700">{policies}</p>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPackageModal;
