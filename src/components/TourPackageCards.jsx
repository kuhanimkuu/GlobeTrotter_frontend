import React, { useState } from "react";

const TourPackageCard = ({
  label,
  items = [],
  selectedItem,
  setSelectedItem,
  itemType = "hotel", 
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleItemChange = (e) => {
    const item = items.find((i) => String(i.id) === e.target.value);
    setSelectedItem(item);
    setSelectedRoom(null); 
  };

  const handleRoomChange = (e) => {
    if (!selectedItem) return;
    const room = selectedItem.room_types?.find(
      (r) => String(r.id) === e.target.value
    );
    setSelectedRoom(room);
  };

  // Get appropriate icon based on item type
  const getItemIcon = () => {
    return itemType === "hotel" ? "🏨" : "🚗";
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-bold text-gray-900 mb-3">
        {getItemIcon()} {label}
      </label>

      {/* Main Item Dropdown */}
      <select
        value={selectedItem?.id || ""}
        onChange={handleItemChange}
        className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">-- Select {itemType} --</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {itemType === "hotel" && (
              <>
                {item.name} {item.rating ? `(${item.rating}⭐)` : ""}
              </>
            )}
            {itemType === "car" && (
              <>
                {item.make} {item.model} ({item.category})
                {item.daily_rate ? ` - $${item.daily_rate}/day` : ""}
              </>
            )}
          </option>
        ))}
      </select>

      {/* Details Section */}
      {selectedItem && (
        <div className="mt-4 p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          {/* Hotel details */}
          {itemType === "hotel" && (
            <div className="space-y-4">
              {/* Hotel Header */}
              <div className="flex items-start gap-4">
                {selectedItem.cover_image_url && (
                  <img
                    src={selectedItem.cover_image_url}
                    alt={selectedItem.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedItem.name}</h3>
                  {selectedItem.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{selectedItem.rating}/5</span>
                    </div>
                  )}
                  {selectedItem.address && (
                    <p className="text-gray-600 text-sm mt-1">📍 {selectedItem.address}</p>
                  )}
                </div>
              </div>

              {selectedItem.description && (
                <p className="text-gray-700 leading-relaxed bg-white/50 p-3 rounded-xl">
                  {selectedItem.description}
                </p>
              )}

              {/* Room Selection */}
              {selectedItem.room_types?.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    🛏️ Select Room Type
                  </label>
                  <select
                    value={selectedRoom?.id || ""}
                    onChange={handleRoomChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-3"
                  >
                    <option value="">-- Choose Room --</option>
                    {selectedItem.room_types.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.base_price} - Available: {room.quantity}
                      </option>
                    ))}
                  </select>
                  
                  {selectedRoom && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-green-900 text-lg">Selected Room</p>
                          <p className="text-gray-700">{selectedRoom.name}</p>
                          <p className="text-sm text-gray-600">Capacity: {selectedRoom.capacity} pax</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${selectedRoom.base_price}</p>
                          <p className="text-sm text-green-700">Available: {selectedRoom.quantity}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Car details */}
          {itemType === "car" && (
            <div className="space-y-4">
              {/* Car Header */}
              <div className="flex items-start gap-4">
                {selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt={`${selectedItem.make} ${selectedItem.model}`}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedItem.make} {selectedItem.model}
                  </h3>
                  <p className="text-blue-600 font-semibold">{selectedItem.category}</p>
                  {selectedItem.provider && (
                    <p className="text-gray-600 text-sm">Provider: {selectedItem.provider}</p>
                  )}
                </div>
              </div>

              {/* Car Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Vehicle:</span> {selectedItem.make} {selectedItem.model}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Category:</span> {selectedItem.category}
                  </p>
                  {selectedItem.daily_rate && (
                    <p className="text-green-700 font-bold text-lg">
                      💰 Daily Rate: ${selectedItem.daily_rate}
                    </p>
                  )}
                </div>

                {/* Driver Information */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-2">👨‍✈️ Driver Information</h4>
                  {selectedItem.driver_name && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Name:</span> {selectedItem.driver_name}
                    </p>
                  )}
                  {selectedItem.driver_contact && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Contact:</span> {selectedItem.driver_contact}
                    </p>
                  )}
                  {selectedItem.city && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Location:</span> {selectedItem.city}
                    </p>
                  )}
                </div>
              </div>

              {selectedItem.description && (
                <p className="text-gray-700 bg-white/50 p-3 rounded-xl">
                  {selectedItem.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-2">{getItemIcon()}</div>
          <p className="text-gray-600">No {itemType}s available</p>
        </div>
      )}
    </div>
  );
};

export default TourPackageCard;